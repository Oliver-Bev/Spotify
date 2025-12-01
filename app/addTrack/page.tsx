'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

function safeKey(folder: string, filename: string, { encode = false, maxLength = 1024 } = {}): string {
  let name = filename.normalize('NFKC');

  // Replace a set of unsafe characters (slashes, special slash-like, control chars, ?, #, %, :, *, ", <, >, |, backtick)
  name = name.replace(/[\/\\\u29F8\u2044\u2215\0-\x1F\?\#\%\:\*\\"<>\|\`]+/g, '-');

  // Replace whitespace sequences with single dash
  name = name.replace(/\s+/g, '-');

  // Collapse multiple dashes
  name = name.replace(/-+/g, '-');

  // Trim leading/trailing dashes or dots
  name = name.replace(/^[\.-]+|[\.-]+$/g, '');

  if (encode) {
    name = encodeURIComponent(name);
  }

  if (maxLength && name.length > maxLength) {
    const extIndex = name.lastIndexOf('.');
    if (extIndex > 0 && name.length - extIndex <= 16) {
      const ext = name.slice(extIndex);
      const base = name.slice(0, maxLength - ext.length);
      name = base + ext;
    } else {
      name = name.slice(0, maxLength);
    }
  }

  const key = `${folder.replace(/\/+$/,'')}/${name}`;
  return key;
}

export default function TrackAddPage() {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [trackFile, setTrackFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackFile) {
      setMessage('Musisz wybrać plik muzyczny!');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const user = (await supabase.auth.getUser()).data.user;
      const userId = user?.id ?? null;

      // 1️⃣ Upload muzyki do bucketu 'music' using sanitized key and metadata
      const trackKey = safeKey('tracks', trackFile.name);
      const trackUpload = await supabase.storage
        .from('music')
        .upload(trackKey, trackFile, {
          cacheControl: '3600',
          upsert: true,
          // store original filename in metadata
          metadata: { original_name: trackFile.name, uploaded_by: userId ?? '' },
        });

      if (trackUpload.error) throw trackUpload.error;
      const trackPath = trackUpload.data.path;

      // 2️⃣ Dodaj wpis do tabeli tracks
      const { data: trackData, error: trackError } = await supabase
        .from('tracks')
        .insert({
          title,
          artist,
          album,
          file_path: trackPath,
          user_id: userId,
        })
        .select()
        .single();

      if (trackError) throw trackError;

      // 3️⃣ Upload miniatury do bucketu 'images' jeśli wybrano
      if (imageFile) {
        const imageKey = safeKey('images', imageFile.name);
        const imageUpload = await supabase.storage
          .from('images')
          .upload(imageKey, imageFile, {
            cacheControl: '3600',
            upsert: true,
            metadata: { original_name: imageFile.name, uploaded_by: userId ?? '' },
          });

        if (imageUpload.error) throw imageUpload.error;
        const imagePath = imageUpload.data.path;

        // 4️⃣ Dodaj wpis do track_images
        const { error: imageDbError } = await supabase
          .from('track_images')
          .insert({
            track_id: trackData.id,
            file_path: imagePath,
            type: 'thumbnail',
          });

        if (imageDbError) throw imageDbError;
      }

      setMessage('Dodano utwór i miniaturę!');
      setTitle('');
      setArtist('');
      setAlbum('');
      setTrackFile(null);
      setImageFile(null);
    } catch (error: any) {
      console.error(error);
      setMessage('Wystąpił błąd: ' + (error.message ?? String(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow text-white">
      <h1 className="text-xl font-bold mb-4">Dodaj nowy utwór</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Tytuł"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Artysta"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Album"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setTrackFile(e.target.files?.[0] || null)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Wgrywanie...' : 'Dodaj utwór'}
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}