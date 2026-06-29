'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  // 1. Initialize Lenis
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      console.log('Lenis: Reduced motion preferred. Smooth scroll disabled.');
      return;
    }

    // Inject Lenis CSS styles to avoid layout shifts or native scrolling conflicts
    const styleId = 'lenis-custom-styles';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = `
        html.lenis, html.lenis body {
          height: auto;
        }
        .lenis-smooth {
          scroll-behavior: auto !important;
        }
        .lenis-smooth [data-lenis-prevent] {
          overscroll-behavior: contain;
        }
        .lenis-stopped {
          overflow: hidden;
        }
        .lenis-smooth iframe {
          pointer-events: none;
        }
      `;
      document.head.appendChild(styleEl);
    }

    const lenisInstance = new Lenis({
      duration: 1.5, // Longer decay duration for a floatier, smoother glide
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential-out
      smoothWheel: true,
      wheelMultiplier: 1.3, // Increases the amount of scroll displacement per single wheel event
      touchMultiplier: 1.5, // Increases the displacement on touch devices for a smooth scroll feel
    });

    setLenis(lenisInstance);

    // Sync with RequestAnimationFrame
    let rafId: number;
    function raf(time: number) {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Intercept native anchor links click for smooth scroll-to-anchor
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (
        anchor &&
        anchor.hash &&
        anchor.origin === window.location.origin &&
        !anchor.hasAttribute('download') &&
        anchor.target !== '_blank'
      ) {
        const targetId = anchor.hash;
        const targetEl = document.querySelector(targetId);
        if (targetEl && targetEl instanceof HTMLElement) {
          e.preventDefault();
          lenisInstance.scrollTo(targetEl, {
            offset: 0,
            immediate: false,
          });
          // Update browser history/URL hash smoothly
          window.history.pushState(null, '', targetId);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(rafId);
      lenisInstance.destroy();
      document.removeEventListener('click', handleAnchorClick);
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
      setLenis(null);
    };
  }, []);

  // 2. Reset scroll instantly to the top on pathname changes (for route navigations)
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
