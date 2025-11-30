"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";

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

  return (
    <div className="relative w-full py-6">
      
      <button
        aria-label="Previous"
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-black shadow transition hover:scale-105"
      >
        ‹
      </button>

     
      <button
        aria-label="Next"
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-black shadow transition hover:scale-105"
      >
        ›
      </button>

      <div className="overflow-hidden w-full">
        <div
          className={`flex ${withTransition ? "transition-transform duration-300 ease-in-out" : ""}`}
          style={{
            width: `${trackWidthPercent}%`,
            gap: `${gap}px`,
            transform: `translateX(-${index * itemWidthPercent}%)`,
          }}
        >
          {extendedImages.map((img, i) => (
            <div
              key={`${img.src}-${i}`}
              className="flex-shrink-0"
              style={{
                width: `${itemWidthPercent}%`,
                minWidth: `${itemWidthPercent}%`,
              }}
            >
              <div className="mx-auto max-w-xs overflow-hidden rounded-lg bg-slate-800 shadow-md">
                <Image
                  src={img.src}
                  alt={img.alt ?? `slide-${i}`}
                  width={800}
                  height={800}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
