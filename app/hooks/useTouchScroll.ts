'use client';

import { useRef, useEffect } from 'react';

export const useTouchScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      startXRef.current = e.pageX;
      startScrollLeftRef.current = container.scrollLeft;
      container.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!startXRef.current) return;
      const x = e.pageX - startXRef.current;
      container.scrollLeft = startScrollLeftRef.current - x;
    };

    const handleMouseUp = () => {
      startXRef.current = 0;
      container.style.cursor = 'grab';
    };

    // Touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      startXRef.current = e.touches[0].pageX;
      startScrollLeftRef.current = container.scrollLeft;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!startXRef.current) return;
      const x = e.touches[0].pageX - startXRef.current;
      container.scrollLeft = startScrollLeftRef.current - x;
    };

    const handleTouchEnd = () => {
      startXRef.current = 0;
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseUp);
    
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return containerRef;
};
