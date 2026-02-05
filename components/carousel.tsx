'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  items: Array<{
    id: string;
    image_url?: string;
    title?: string;
    title_en?: string;
    title_ne?: string;
    description?: string;
    description_en?: string;
    description_ne?: string;
    [key: string]: any;
  }>;
  autoPlay?: boolean;
  interval?: number;
  language?: 'en' | 'ne';
}

export function Carousel({ items, autoPlay = true, interval = 5000, language = 'en' }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, items.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];
  const getText = (en?: string, ne?: string) => (language === 'ne' ? ne : en) || en;

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      {/* Main carousel item */}
      <div className="relative w-full h-full">
        {currentItem.image_url && (
          <img
            src={currentItem.image_url || "/placeholder.svg"}
            alt={getText(currentItem.title_en, currentItem.title_ne) || 'carousel item'}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/30" />

        {/* Content overlay */}
        {(currentItem.title || currentItem.title_en || currentItem.description || currentItem.description_en) && (
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
            {(currentItem.title || currentItem.title_en) && (
              <h3 className="text-2xl font-bold mb-2">
                {getText(currentItem.title_en, currentItem.title_ne) || currentItem.title}
              </h3>
            )}
            {(currentItem.description || currentItem.description_en) && (
              <p className="text-sm text-gray-100 line-clamp-2">
                {getText(currentItem.description_en, currentItem.description_ne) || currentItem.description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-all z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-all z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
