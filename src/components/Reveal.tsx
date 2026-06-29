'use client';

import React, { createContext, useContext } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Context to track if a Reveal component is nested within a RevealGroup
const RevealGroupContext = createContext<boolean>(false);

interface RevealProps {
  children: React.ReactNode;
  delay?: number; // Initial delay before the animation starts (in seconds)
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'; // Direction of transition
  yOffset?: number; // Starting translation offset on Y axis (pixels)
  xOffset?: number; // Starting translation offset on X axis (pixels)
  duration?: number; // Animation duration (in seconds)
}

export function Reveal({
  children,
  delay = 0,
  direction = 'up',
  yOffset = 40,
  xOffset = 40,
  duration = 0.8,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const isInGroup = useContext(RevealGroupContext);

  // If reduced motion is preferred, render standard elements with no styling transitions
  if (shouldReduceMotion) {
    return <div>{children}</div>;
  }

  // Calculate start offsets based on direction
  const getInitialOffset = () => {
    switch (direction) {
      case 'up':
        return { y: yOffset, x: 0 };
      case 'down':
        return { y: -yOffset, x: 0 };
      case 'left':
        return { y: 0, x: xOffset };
      case 'right':
        return { y: 0, x: -xOffset };
      case 'none':
      default:
        return { y: 0, x: 0 };
    }
  };

  const initialOffset = getInitialOffset();

  const variants = {
    hidden: {
      opacity: 0,
      ...initialOffset,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration,
        // If in a group, the group's staggerChildren handles delays, so we skip local delay
        delay: isInGroup ? undefined : delay,
        ease: [0.16, 1, 0.3, 1] as const, // easeOutExpo equivalent (extremely smooth deceleration)
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial={isInGroup ? undefined : 'hidden'}
      whileInView={isInGroup ? undefined : 'visible'}
      viewport={isInGroup ? undefined : { once: true, margin: '-10% 0px' }}
    >
      {children}
    </motion.div>
  );
}

interface RevealGroupProps {
  children: React.ReactNode;
  stagger?: number; // Time interval between animating adjacent children (in seconds)
  delay?: number; // Delay before the first child starts animating (in seconds)
}

export function RevealGroup({
  children,
  stagger = 0.1,
  delay = 0,
}: RevealGroupProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  return (
    <RevealGroupContext.Provider value={true}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10% 0px' }}
      >
        {children}
      </motion.div>
    </RevealGroupContext.Provider>
  );
}
