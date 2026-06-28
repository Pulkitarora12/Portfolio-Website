'use client';

import { useEffect, RefObject } from 'react';

export function useScrollReveal(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Add initial reveal styles dynamically
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    el.style.willChange = 'opacity, transform';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        } else {
          // Disappear when scrolled out of focus (up or down)
          el.style.opacity = '0';
          el.style.transform = entry.boundingClientRect.top < 0 ? 'translateY(-40px)' : 'translateY(40px)';
        }
      },
      {
        threshold: 0.05,
        rootMargin: '-20% 0px -20% 0px', // Focused middle 60% of the viewport
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [ref]);
}
