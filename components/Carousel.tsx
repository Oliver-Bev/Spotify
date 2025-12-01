"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";


const MY_BUCKET_NAME = 'images'; 
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;


type CarouselProps = {
  images: { src: string; alt?: string }[];
  itemsPerView?: number;
  gap?: number;
};

export default function Carousel({
  images,
  itemsPerView = 3,
  gap = 16,
}: CarouselProps) {
  const total = images.length;

  const CLONE_COUNT = itemsPerView;
  const itemWidthPercent = 50 / itemsPerView; 

  const extendedImages = useMemo(() => {
    if (total === 0) return [];
    const headClones = images.slice(0, CLONE_COUNT);
    const tailClones = images.slice(-CLONE_COUNT);
    return [...tailClones, ...images, ...headClones];
  }, [images, total, CLONE_COUNT]);

  const initialIndex = CLONE_COUNT;
  const [index, setIndex] = useState(initialIndex);
  const [withTransition, setWithTransition] = useState(true);

  const buildSupabaseUrl = (fileName: string): string => {
    if (!SUPABASE_URL) {
      console.error("Błąd: NEXT_PUBLIC_SUPABASE_URL nie jest zdefiniowany.");
      return fileName; 
    }
    if (fileName.startsWith('http')) return fileName; 

    return `${SUPABASE_URL}/storage/v1/object/public/${MY_BUCKET_NAME}/${fileName}`;
  };

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex, total]);

  const goToIndex = (newIndex: number, animate = true) => {
    setWithTransition(animate);
    setIndex(newIndex);
  };

  const next = () => {
    if (!total) return;
    const lastRealIndex = CLONE_COUNT + total - 1;

    if (index === lastRealIndex) {
      goToIndex(index + 1, true);
 
      setTimeout(() => {
        goToIndex(initialIndex, false);
      }, 300);
    } else {
      goToIndex(index + 1, true);
    }
  };

  const prev = () => {
    if (!total) return;
    const firstRealIndex = CLONE_COUNT;

    if (index === firstRealIndex) {
      goToIndex(index - 1, true);
      
      setTimeout(() => {
        goToIndex(firstRealIndex + total - 1, false);
      }, 300);
    } else {
      goToIndex(index - 1, true);
    }
  };

  const trackWidthPercent = extendedImages.length * itemWidthPercent; 

  const elementWidthStyle = {
      width: `${itemWidthPercent}%`,
      minWidth: `${itemWidthPercent}%`,
  };

  const transformValue = `translateX(-${index * itemWidthPercent}%)`; 


  return (
    <div className="relative w-full py-6">
      
   
      <button
        aria-label="Previous"
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-1 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-black shadow transition hover:scale-105"
      >
        ‹
      </button>

      <button
        aria-label="Next"
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-1 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-black shadow transition hover:scale-105"
      >
        ›
      </button>

      <div className="overflow-hidden w-full">
        <div
          className={`flex ${withTransition ? "transition-transform duration-300 ease-in-out" : ""}`}
          style={{
            width: `${trackWidthPercent}%`, 
            gap: `${gap}px`,
            transform: transformValue 
          }}
        >
          {extendedImages.map((img, i) => {
            
            const finalSrc = buildSupabaseUrl(img.src);

            return (
              <div
                key={`${img.src}-${i}`}
                className="flex-shrink-0"
                style={{
                  ...elementWidthStyle,
                }}
              >
                <div className="mx-auto max-w-xs overflow-hidden rounded-lg bg-slate-800 shadow-md">
                  <Image
                    
                    src={finalSrc} 
                    alt={img.alt ?? `slide-${i}`}
              
                    width={250}
                    height={250}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}