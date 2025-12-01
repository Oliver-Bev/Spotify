'use client';

import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Track = {
  id: number;
  title: string;
  artist?: string | null;
  album?: string | null;
  file_path: string;               // np. "tracks/xxx.mp3"
  thumbnail_path?: string | null;  // np. "images/4.JPG"
};

type Props = {
  track: Track;
  signedUrlExpiration?: number;
  className?: string;
};

export default function TrackCard({
  track,
  signedUrlExpiration = 60,
  className = '',
}: Props) {
  const [playing, setPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const resolveUrlExplicit = async (
    bucket: string,
    path: string | null | undefined,
  ) => {
    if (!path) return null;
    try {
      const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);
      if (publicData?.publicUrl) return publicData.publicUrl;

      const { data: signedData, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, signedUrlExpiration);

      if (error) {
        console.error('createSignedUrl error', error);
        return null;
      }

      return signedData?.signedUrl ?? null;
    } catch (err) {
      console.error('resolveUrlExplicit error', err);
      return null;
    }
  };

  const prepareMedia = async () => {
    if (audioUrl && thumbUrl) return;
    setLoading(true);
    try {
      const [a, t] = await Promise.all([
        resolveUrlExplicit('music', track.file_path),
        resolveUrlExplicit('images', track.thumbnail_path ?? null),
      ]);
      setAudioUrl(a);
      setThumbUrl(t);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    prepareMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlayHandler = async () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      await audioRef.current.play().catch((e) => console.error('play error', e));
      setPlaying(true);
    } else {
      audioRef.current.pause();
      setPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration || 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!audioRef.current) return;
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const formatTime = (sec: number) => {
    if (!sec || Number.isNaN(sec)) return '0:00';
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`bg-slate-900 rounded-xl shadow p-4 flex gap-4 items-center ${className}`}>
      <div className="w-24 h-24 bg-slate-800 rounded overflow-hidden flex-shrink-0">
        {thumbUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbUrl} alt={track.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">
            {loading ? 'Ładowanie...' : 'Brak miniatury'}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-lg truncate">{track.title}</div>
        <div className="text-sm text-slate-300 truncate">
          {track.artist ?? 'Unknown artist'}
        </div>
        <div className="text-xs text-slate-500 truncate">{track.album ?? ''}</div>

        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={togglePlayHandler}
            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition"
          >
            {playing ? (
              <span className="flex gap-1">
                <span className="w-1.5 h-4 bg-white rounded-sm" />
                <span className="w-1.5 h-4 bg-white rounded-sm" />
              </span>
            ) : (
              <span
                className="ml-0.5"
                style={{
                  width: 0,
                  height: 0,
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid transparent',
                  borderLeft: '12px solid white',
                }}
              />
            )}
          </button>

          <div className="flex-1 flex flex-col gap-1">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <audio
          ref={audioRef}
          src={audioUrl ?? undefined}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => {
            setPlaying(false);
            setCurrentTime(0);
          }}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}
