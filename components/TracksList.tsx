'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import TrackCard from '@/components/TrackCard';

type TrackRow = {
  id: number;
  title: string | null;
  artist: string | null;
  album: string | null;
  file_path: string | null;
  track_images?: { file_path: string | null }[] | null;
};

const TracksList = () => {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchTracks = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        const { data, error } = await supabase
          .from('tracks')
          .select(
            `
            id,
            title,
            artist,
            album,
            file_path,
            track_images ( file_path )
          `,
          )
          .order('created_at', { ascending: false })
          .limit(100);

        console.log('[TracksList] response:', { data, error });

        if (error) {
          console.error('[TracksList] supabase error:', error);
          if (!cancelled) {
            setErrorMsg(error.message ?? 'Błąd pobierania utworów');
            setLoading(false);
          }
          return;
        }

        const rows: TrackRow[] = Array.isArray(data) ? (data as TrackRow[]) : [];

        const mapped = rows.map((r) => ({
          id: r.id,
          title: r.title ?? 'Brak tytułu',
          artist: r.artist ?? 'Brak artysty',
          album: r.album ?? 'Brak albumu',
          file_path: r.file_path ?? '',
          thumbnail_path: r.track_images?.[0]?.file_path ?? null,
        }));

        console.log('[TracksList] mapped:', mapped);

        if (!cancelled) {
          setTracks(mapped);
        }
      } catch (err: any) {
        console.error('[TracksList] unexpected error:', err);
        if (!cancelled) setErrorMsg('Nieoczekiwany błąd');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTracks();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div>Ładowanie utworów…</div>;
  if (errorMsg) return <div>Błąd: {errorMsg}</div>;
  if (!tracks.length) return <div>Brak utworów w bazie.</div>;

  return (
    <div className="space-y-4">
      {tracks.map((t) => (
        <TrackCard key={t.id} track={t} />
      ))}
    </div>
  );
};

export default TracksList;
