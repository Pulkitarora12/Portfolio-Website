'use client';

import { useState, useEffect, RefObject } from 'react';

interface TiltStyle {
  transform: string;
  transition: string;
}

export function useTilt(ref: RefObject<HTMLDivElement | null>, maxTilt = 10) {
  const [style, setStyle] = useState<TiltStyle>({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
    transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const percentX = (mouseX / width) - 0.5;
      const percentY = (mouseY / height) - 0.5;

      const rotateX = -percentY * maxTilt;
      const rotateY = percentX * maxTilt;

      setStyle({
        transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`,
        transition: 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)',
      });
    };

    const handleMouseLeave = () => {
      setStyle({
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
        transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, maxTilt]);

  return style;
}
