"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState, ReactNode } from 'react';

interface SwipeNavigationProps {
  children: ReactNode;
}

export default function SwipeNavigation({ children }: SwipeNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [translateX, setTranslateX] = useState(0);

  // Define el orden de las páginas para el swipe
  const pages = ['/', '/transactions', '/accounts', '/settings'];
  const currentIndex = pages.indexOf(pathname);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX.current;
    
    // Limitar el arrastre
    const maxDrag = 100;
    const limitedDiff = Math.max(-maxDrag, Math.min(maxDrag, diff));
    
    setTranslateX(limitedDiff);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    setIsDragging(false);
    setTranslateX(0);
    
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // Mínimo para considerar un swipe

    if (Math.abs(swipeDistance) < minSwipeDistance) {
      return; // No fue un swipe válido
    }

    // Swipe a la izquierda (siguiente página)
    if (swipeDistance > 0 && currentIndex < pages.length - 1) {
      router.push(pages[currentIndex + 1]);
    }
    // Swipe a la derecha (página anterior)
    else if (swipeDistance < 0 && currentIndex > 0) {
      router.push(pages[currentIndex - 1]);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, currentIndex]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        transform: `translateX(${translateX}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
      }}
    >
      {children}
    </div>
  );
}
