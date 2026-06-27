'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Offer } from '@/lib/models/Offer';
import { useTouchScroll } from '@/app/hooks/useTouchScroll';

interface OfferCarouselProps {
  offers: Offer[];
}

export default function OfferCarousel({ offers }: OfferCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);

  const maxIndex = Math.max(0, offers.length - visibleCount);
  const totalDots = maxIndex + 1;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset index if visibleCount changes and index is out of bounds
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [visibleCount, maxIndex]);

  // Auto-scroll
  useEffect(() => {
    if (offers.length <= visibleCount) return;
    autoScrollTimer.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => { if (autoScrollTimer.current) clearInterval(autoScrollTimer.current); };
  }, [offers.length, visibleCount, maxIndex]);

  const stopAuto = () => {
    if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
  };

  const handlePrev = () => { stopAuto(); setCurrentIndex((p) => Math.max(0, p - 1)); };
  const handleNext = () => { stopAuto(); setCurrentIndex((p) => Math.min(maxIndex, p + 1)); };

  // Touch/drag handlers
  const onDragStart = (clientX: number) => { dragStart.current = clientX; };
  const onDragEnd = (clientX: number) => {
    if (dragStart.current === null) return;
    const diff = dragStart.current - clientX;
    if (Math.abs(diff) > 50) {
      stopAuto();
      diff > 0 ? handleNext() : handlePrev();
    }
    dragStart.current = null;
  };

  if (offers.length === 0) return null;

  const gap = 16; // px, matches gap-4
  const slideWidth = 100 / visibleCount;

  return (
    <div className="w-full bg-gradient-to-r from-slate-50 to-blue-50 py-8 px-4 sm:py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            🔥 Hot Offers Just for You
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Limited time deals on premium products
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Prev button */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 rounded-full bg-white shadow-lg hover:bg-blue-50 transition-all p-2 sm:p-3"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
          )}

          {/* Track wrapper — overflow-hidden clips the sliding track */}
          <div className="overflow-hidden">
            <div
              ref={trackRef}
              className="flex transition-transform duration-500 ease-out cursor-grab active:cursor-grabbing"
              style={{
                transform: `translateX(calc(-${currentIndex * slideWidth}% - ${currentIndex * gap / visibleCount}px))`,
                gap: `${gap}px`,
              }}
              onMouseDown={(e) => onDragStart(e.clientX)}
              onMouseUp={(e) => onDragEnd(e.clientX)}
              onMouseLeave={() => { dragStart.current = null; }}
              onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
              onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX)}
            >
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="flex-shrink-0"
                  style={{ width: `calc(${slideWidth}% - ${gap * (visibleCount - 1) / visibleCount}px)` }}
                >
                  <OfferCard offer={offer} />
                </div>
              ))}
            </div>
          </div>

          {/* Next button */}
          {currentIndex < maxIndex && (
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 rounded-full bg-white shadow-lg hover:bg-blue-50 transition-all p-2 sm:p-3"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>
          )}
        </div>

        {/* Dots */}
        {totalDots > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: totalDots }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => { stopAuto(); setCurrentIndex(idx); }}
                className={`rounded-full transition-all ${
                  currentIndex === idx ? 'bg-blue-600 w-5 h-2.5' : 'bg-slate-300 w-2.5 h-2.5 hover:bg-slate-400'
                }`}
                aria-label={`Go to ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!offer.expiryDate) return;

    const updateTimer = () => {
      const now = new Date();
      const expiry = new Date(offer.expiryDate!);
      const diff = expiry.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [offer.expiryDate]);

  const handleShopNow = () => {
    // Navigate to home page with offer context
    // In a real scenario, you could filter products based on offer category
    // For now, we'll navigate to home and show a notification
    router.push('/?offerClicked=' + offer.id);
  };

  const badgeColorMap: Record<string, string> = {
    primary: 'bg-blue-600 text-white',
    secondary: 'bg-orange-500 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-500 text-slate-900',
    danger: 'bg-red-600 text-white',
  };

  const badgeColor =
    badgeColorMap[offer.badgeColor || 'primary'] ||
    badgeColorMap['primary'];

  return (
    <div className="group h-full rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 aspect-square sm:aspect-video lg:aspect-square">
        {offer.image ? (
          <img
            src={offer.image}
            alt={offer.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-2">🎁</div>
              <p className="text-xs sm:text-sm text-slate-600">Special Offer</p>
            </div>
          </div>
        )}

        {/* Badge */}
        {offer.badge && (
          <div
            className={`absolute top-3 right-3 sm:top-4 sm:right-4 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${badgeColor} shadow-lg`}
          >
            {offer.badge}
          </div>
        )}

        {/* Discount Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-3 sm:p-4">
        {/* Title */}
        <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
          {offer.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-3 flex-grow">
          {offer.description}
        </p>

        {/* Discount and Timer */}
        <div className="flex items-center justify-between mb-3 gap-2">
          {/* Discount */}
          <div className="flex-shrink-0">
            <div className="inline-flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg px-2 sm:px-3 py-1 sm:py-2">
              <span className="text-base sm:text-lg font-bold text-white">
                {offer.discount}
              </span>
              <span className="text-xs sm:text-sm font-bold text-white ml-0.5">
                {offer.discountType === 'percentage' ? '%' : '$'} OFF
              </span>
            </div>
          </div>

          {/* Timer */}
          {offer.expiryDate && (
            <div className="flex items-center gap-1 text-xs sm:text-sm text-orange-600 font-semibold">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="flex-shrink-0">{timeLeft}</span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleShopNow}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 sm:py-2.5 rounded-lg transition-all duration-300 text-xs sm:text-sm transform group-hover:scale-105 cursor-pointer"
        >
          Shop Now
        </button>
      </div>
    </div>
  );
}
