'use client';

import { useEffect, RefObject } from 'react';

export function useScrollReveal(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Add initial reveal styles dynamically
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1), transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
    el.style.willChange = 'opacity, transform';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        } else {
          // Disappear when scrolled out (up or down)
          el.style.opacity = '0';
          el.style.transform = entry.boundingClientRect.top < 0 ? 'translateY(-25px)' : 'translateY(25px)';
        }
      },
      {
        threshold: 0,
        rootMargin: '0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [ref]);
}
