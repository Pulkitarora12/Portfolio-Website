'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Cpu, Database, Layers, ArrowUpRight } from 'lucide-react';
import { Reveal, RevealGroup } from '@/components/Reveal';
import styles from './demo.module.css';

export default function DemoPage() {
  return (
    <div className={styles.container}>
      {/* Dynamic Glassmorphic Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Sparkles size={20} />
          <span>Antigravity</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#hero" className={styles.navLink}>Home</a>
          <a href="#features" className={styles.navLink}>Features</a>
          <a href="#about" className={styles.navLink}>About</a>
        </div>
      </nav>

      {/* SECTION 1: HERO SECTION */}
      <section id="hero" className={`${styles.section} ${styles.hero}`}>
        {/* Simple single Reveal with small delay */}
        <Reveal delay={0.1} direction="up" yOffset={30}>
          <div className={styles.heroBadge}>
            <Sparkles size={14} />
            <span>Interactive Smooth Scroll Demo</span>
          </div>
        </Reveal>

        {/* Reveal heading with custom duration */}
        <Reveal delay={0.2} direction="up" yOffset={45} duration={0.9}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroGradientText}>Buttery-Smooth Inertia & </span>
            <span className={styles.heroAccentText}>Fluid Reveals</span>
          </h1>
        </Reveal>

        {/* Reveal paragraph text */}
        <Reveal delay={0.4} direction="up" yOffset={40}>
          <p className={styles.heroDescription}>
            Experience a premium user interface wrapped in Lenis scroll sync and Framer Motion orchestrations. 
            Scroll down to see staggered components and offset reveal animations.
          </p>
        </Reveal>

        {/* Reveal button row */}
        <Reveal delay={0.6} direction="up" yOffset={30}>
          <div className={styles.heroCta}>
            <a href="#features" className={styles.btnPrimary}>
              Explore Features <ArrowRight size={18} />
            </a>
            <a href="#about" className={styles.btnSecondary}>
              Learn More
            </a>
          </div>
        </Reveal>
      </section>

      {/* SECTION 2: FEATURES SECTION */}
      <section id="features" className={styles.section}>
        <div className={styles.sectionHeader}>
          <Reveal direction="down" yOffset={30}>
            <span className={styles.sectionTag}>Engineered Excellence</span>
          </Reveal>
          <Reveal delay={0.15} direction="up" yOffset={30}>
            <h2 className={styles.sectionTitle}>Staggered Grid Columns</h2>
          </Reveal>
        </div>

        {/* Staggered group container */}
        <RevealGroup stagger={0.15}>
          <div className={styles.featuresGrid}>
            
            {/* Card 1 */}
            <Reveal direction="up" yOffset={50}>
              <div className={styles.featureCard}>
                <div className={styles.cardIcon}>
                  <Cpu size={24} />
                </div>
                <h3 className={styles.cardTitle}>Inertia Scrolling</h3>
                <p className={styles.cardText}>
                  Tuned duration, exponential deceleration, and native browser compatibility prevent scroll-jacking frustrations.
                </p>
              </div>
            </Reveal>

            {/* Card 2 */}
            <Reveal direction="up" yOffset={50}>
              <div className={styles.featureCard}>
                <div className={styles.cardIcon}>
                  <Database size={24} />
                </div>
                <h3 className={styles.cardTitle}>Reduced Motion</h3>
                <p className={styles.cardText}>
                  Fully respects prefers-reduced-motion queries, disabling Lenis smoothing and skipping slide triggers for accessibility.
                </p>
              </div>
            </Reveal>

            {/* Card 3 */}
            <Reveal direction="up" yOffset={50}>
              <div className={styles.featureCard}>
                <div className={styles.cardIcon}>
                  <Layers size={24} />
                </div>
                <h3 className={styles.cardTitle}>Orchestrated Reveals</h3>
                <p className={styles.cardText}>
                  IntersectionObserver-based whileInView triggers animate elements once they enter the viewport to optimize frame rates.
                </p>
              </div>
            </Reveal>

          </div>
        </RevealGroup>
      </section>

      {/* SECTION 3: ABOUT / DATA SECTION */}
      <section id="about" className={styles.section}>
        <div className={styles.splitLayout}>
          
          {/* Left Column: Slides in from the left (xOffset > 0, direction="right") */}
          <Reveal direction="right" xOffset={60} duration={1.0}>
            <div className={styles.aboutContent}>
              <span className={styles.sectionTag}>System Performance</span>
              <h2 className={styles.aboutTitle}>Silky Smooth Layouts, Zero Layout Shifts</h2>
              <p className={styles.aboutText}>
                By animating only opacity and CSS transform matrix values, browsers avoid triggering paint reflow calculations. This yields consistent 60fps renders even on low-powered devices.
              </p>
              <div className={styles.highlightText}>
                Lenis is lazy-initialized on the client mount cycle, avoiding compilation errors or hydrated DOM mismatches during SSR rendering.
              </div>
              <div>
                <Link href="/" className={styles.btnPrimary} style={{ marginTop: '1rem' }}>
                  Back to Portfolio <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Slides in from the right (xOffset > 0, direction="left") */}
          <Reveal direction="left" xOffset={60} duration={1.0}>
            <div className={styles.aboutVisual}>
              
              <div className={styles.visualCard}>
                <span className={styles.visualNumber}>01</span>
                <div className={styles.visualText}>
                  <span className={styles.visualLabel}>Hardware Accelerated</span>
                  <span className={styles.visualSub}>Syncs directly via requestAnimationFrame</span>
                </div>
              </div>

              <div className={styles.visualCard}>
                <span className={styles.visualNumber}>02</span>
                <div className={styles.visualText}>
                  <span className={styles.visualLabel}>Anchor Safe</span>
                  <span className={styles.visualSub}>Listens to navigation clicks to scroll natively</span>
                </div>
              </div>

              <div className={styles.visualCard}>
                <span className={styles.visualNumber}>03</span>
                <div className={styles.visualText}>
                  <span className={styles.visualLabel}>Modal Compatible</span>
                  <span className={styles.visualSub}>Supported via data-lenis-prevent attributes</span>
                </div>
              </div>

            </div>
          </Reveal>

        </div>
      </section>
    </div>
  );
}
