'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Offer } from '@/lib/models/Offer';

interface OfferCarouselProps {
  offers: Offer[];
}

export default function OfferCarousel({ offers }: OfferCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [autoScroll, setAutoScroll] = useState(true);
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);

  // Calculate visible items based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScroll || offers.length <= visibleCount) return;

    autoScrollTimer.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (offers.length - visibleCount + 1));
    }, 5000);

    return () => {
      if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    };
  }, [autoScroll, offers.length, visibleCount]);

  const handlePrev = () => {
    setAutoScroll(false);
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, offers.length - visibleCount) : prev - 1
    );
  };

  const handleNext = () => {
    setAutoScroll(false);
    setCurrentIndex((prev) =>
      prev >= offers.length - visibleCount ? 0 : prev + 1
    );
  };

  const handleDotClick = (index: number) => {
    setAutoScroll(false);
    setCurrentIndex(index);
  };

  if (offers.length === 0) return null;

  const visibleOffers = offers.slice(currentIndex, currentIndex + visibleCount);
  const totalDots = Math.max(1, offers.length - visibleCount + 1);

  return (
    <div className="w-full bg-gradient-to-r from-slate-50 to-blue-50 py-8 px-4 sm:py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
              🔥 Hot Offers Just for You
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Limited time deals on premium products
            </p>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Offers Grid */}
          <div className="overflow-hidden">
            <div
              className="flex gap-4 sm:gap-6 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(${-currentIndex * (100 / visibleCount)}%)`,
              }}
            >
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="flex-shrink-0"
                  style={{ width: `calc(${100 / visibleCount}% - ${((visibleCount - 1) * 1) / visibleCount}rem)` }}
                >
                  <OfferCard offer={offer} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {offers.length > visibleCount && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 z-10 rounded-full bg-white shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all p-2 sm:p-3 group"
                aria-label="Previous offers"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 group-hover:text-blue-600 transition-colors" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 z-10 rounded-full bg-white shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all p-2 sm:p-3 group"
                aria-label="Next offers"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 group-hover:text-blue-600 transition-colors" />
              </button>
            </>
          )}

          {/* Dots Navigation */}
          {offers.length > visibleCount && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: totalDots }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`transition-all rounded-full ${
                    currentIndex === idx
                      ? 'bg-blue-600 w-3 h-3'
                      : 'bg-slate-300 w-2 h-2 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to offer set ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
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
        <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 sm:py-2.5 rounded-lg transition-all duration-300 text-xs sm:text-sm transform group-hover:scale-105">
          Shop Now
        </button>
      </div>
    </div>
  );
}
