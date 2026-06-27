'use client';

import { useRef, useEffect } from 'react';

export const useTouchScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const momentumIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      startXRef.current = e.pageX;
      lastXRef.current = e.pageX;
      lastTimeRef.current = Date.now();
      startScrollLeftRef.current = container.scrollLeft;
      container.style.cursor = 'grabbing';
      if (momentumIntervalRef.current) clearInterval(momentumIntervalRef.current);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!startXRef.current) return;
      const x = e.pageX - startXRef.current;
      container.scrollLeft = startScrollLeftRef.current - x;
      
      // Calculate velocity for momentum
      const now = Date.now();
      const timeDelta = now - lastTimeRef.current;
      if (timeDelta > 0) {
        velocityRef.current = (lastXRef.current - e.pageX) / timeDelta;
      }
      lastXRef.current = e.pageX;
      lastTimeRef.current = now;
    };

    const handleMouseUp = () => {
      startXRef.current = 0;
      container.style.cursor = 'grab';
      applyMomentum();
    };

    // Touch events for mobile with momentum
    const handleTouchStart = (e: TouchEvent) => {
      startXRef.current = e.touches[0].pageX;
      lastXRef.current = e.touches[0].pageX;
      lastTimeRef.current = Date.now();
      startScrollLeftRef.current = container.scrollLeft;
      if (momentumIntervalRef.current) clearInterval(momentumIntervalRef.current);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!startXRef.current) return;
      const x = e.touches[0].pageX - startXRef.current;
      container.scrollLeft = startScrollLeftRef.current - x;
      
      // Calculate velocity
      const now = Date.now();
      const timeDelta = now - lastTimeRef.current;
      if (timeDelta > 0) {
        velocityRef.current = (lastXRef.current - e.touches[0].pageX) / timeDelta;
      }
      lastXRef.current = e.touches[0].pageX;
      lastTimeRef.current = now;
    };

    const handleTouchEnd = () => {
      startXRef.current = 0;
      applyMomentum();
    };

    const applyMomentum = () => {
      if (Math.abs(velocityRef.current) < 0.5) {
        velocityRef.current = 0;
        return;
      }

      let currentVelocity = velocityRef.current;
      const friction = 0.95; // Friction coefficient

      if (momentumIntervalRef.current) clearInterval(momentumIntervalRef.current);

      momentumIntervalRef.current = setInterval(() => {
        if (Math.abs(currentVelocity) < 0.1) {
          if (momentumIntervalRef.current) clearInterval(momentumIntervalRef.current);
          velocityRef.current = 0;
          return;
        }

        container.scrollLeft += currentVelocity * 16; // 16ms frame
        currentVelocity *= friction;
      }, 16);
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseUp);
    
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      if (momentumIntervalRef.current) clearInterval(momentumIntervalRef.current);
    };
  }, []);

  return containerRef;
};
