'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  FileText, 
  Terminal, 
  Cpu, 
  Database, 
  Layers, 
  ArrowUpRight, 
  ArrowRight,
  Code,
  Sparkles
} from 'lucide-react';
import { useTilt } from '../hooks/useTilt';
import { useScrollReveal } from '../hooks/useScrollReveal';
import styles from './page.module.css';

// Project Card Component with 3D Tilt Effect
interface ProjectCardProps {
  title: string;
  githubUrl?: string;
  liveUrl?: string;
  tags: string[];
  description: string;
}

function ProjectCard({ 
  title, 
  githubUrl, 
  liveUrl, 
  tags, 
  description
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltStyle = useTilt(cardRef, 8);

  return (
    <div 
      className={styles.projectCardWrapperMarquee}
      ref={cardRef}
    >
      <div className={styles.projectCard} style={tiltStyle}>
        <div className={styles.projectCardContent}>
          <div className={styles.projectHeader}>
            <h3 className={styles.projectTitle}>{title}</h3>
            <div className={styles.socialRow}>
              {githubUrl && (
                <a 
                  href={githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.projectIconLink}
                  aria-label={`${title} GitHub Repository`}
                >
                  <Github size={18} />
                </a>
              )}
              {liveUrl && (
                <a 
                  href={liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.projectIconLink}
                  aria-label={`${title} Live Site`}
                >
                  <ArrowUpRight size={18} />
                </a>
              )}
            </div>
          </div>

          <div className={styles.projectMeta}>
            {tags.map((tag, idx) => (
              <span key={idx} className={styles.techTag}>
                {tag}
              </span>
            ))}
          </div>

          <p className={styles.projectDescription}>{description}</p>
        </div>
      </div>
    </div>
  );
}

const row1Projects = [
  {
    title: "CodeWar — Real-Time Coding Battle Platform",
    githubUrl: "https://github.com/Pulkitarora12/CodeWar",
    tags: ["Spring Boot", "WebSocket", "Redis", "React", "MySQL"],
    description: "A competitive coding matchmaking platform hosting real-time, rating-balanced developer face-offs based on live Codeforces problem distributions."
  },
  {
    title: "GrindLog — Personal Productivity & Learning Tracker",
    githubUrl: "https://github.com/Pulkitarora12/GrindLog",
    tags: ["Next.js", "Prisma", "PostgreSQL", "React", "TypeScript"],
    description: "A personal productivity tracker and editorial blog designed to record daily developer logs, track skill checklists, and visualize progress on an interactive activity calendar."
  }
];

const row2Projects = [
  {
    title: "AuthTemplate — Secure Spring Boot Auth Boilerplate",
    githubUrl: "https://github.com/Pulkitarora12/AuthTemplate",
    tags: ["Spring Security", "JWT", "OAuth2", "Redis", "TOTP MFA"],
    description: "A production-ready security starter pack providing modular authorization, token lifecycle controls, and robust audit logging."
  },
  {
    title: "Research-Assistant — AI-Powered Chrome Companion",
    githubUrl: "https://github.com/Pulkitarora12/Research-Assistant",
    tags: ["Chrome Extension", "Gemini AI API", "JavaScript", "HTML5", "CSS"],
    description: "An intelligent browser extension that captures text selection context and triggers semantic explanations, summaries, or translations via Google's Gemini AI."
  }
];

interface ScrollMarqueeProps {
  children: React.ReactNode;
  direction: 'left' | 'right';
  speed?: number;
}

function ScrollMarquee({ children, direction, speed = 1.0 }: ScrollMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const scrollPosRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    scrollPosRef.current = container.scrollLeft;

    const getSingleSetWidth = () => {
      return track.scrollWidth / 3;
    };

    let animationId: number;

    const tick = () => {
      if (isDownRef.current) {
        scrollPosRef.current = container.scrollLeft;
        animationId = requestAnimationFrame(tick);
        return;
      }

      const singleWidth = getSingleSetWidth();
      if (singleWidth <= 0) {
        animationId = requestAnimationFrame(tick);
        return;
      }

      if (Math.abs(container.scrollLeft - scrollPosRef.current) > 1.5) {
        scrollPosRef.current = container.scrollLeft;
      }

      if (direction === 'left') {
        scrollPosRef.current += speed;
        if (scrollPosRef.current >= singleWidth) {
          scrollPosRef.current = scrollPosRef.current - singleWidth;
        }
      } else {
        scrollPosRef.current -= speed;
        if (scrollPosRef.current <= 0) {
          scrollPosRef.current = singleWidth + scrollPosRef.current;
        }
      }

      container.scrollLeft = Math.round(scrollPosRef.current);
      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);

    const handleScroll = () => {
      const singleWidth = getSingleSetWidth();
      if (singleWidth <= 0) return;

      let currentScroll = container.scrollLeft;
      if (currentScroll >= singleWidth * 1.8) {
        container.scrollLeft = currentScroll - singleWidth;
        scrollPosRef.current = container.scrollLeft;
      } else if (currentScroll <= singleWidth * 0.2) {
        container.scrollLeft = currentScroll + singleWidth;
        scrollPosRef.current = container.scrollLeft;
      }
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [direction, speed]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    
    isDownRef.current = true;
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftRef.current = container.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDownRef.current) return;
    const container = containerRef.current;
    if (!container) return;

    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    container.scrollLeft = scrollLeftRef.current - walk;
    scrollPosRef.current = container.scrollLeft;
  };

  const handleMouseUpOrLeave = () => {
    isDownRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      className={styles.marqueeContainer}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onDragStart={(e) => e.preventDefault()}
    >
      <div ref={trackRef} className={styles.marqueeTrack}>
        {children}
      </div>
    </div>
  );
}

function LeetCodeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      width={size} 
      height={size} 
      fill="currentColor" 
      style={{ display: 'block' }}
    >
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.414L.771 12.166a1.373 1.373 0 0 0 0 1.94l2.05 2.051a1.373 1.373 0 0 0 1.94 0l11.717-11.717a1.373 1.373 0 0 0 0-1.94L14.444.414a1.374 1.374 0 0 0-.961-.414zm.011 2.378l1.37 1.37-11.717 11.717-1.37-1.37zM21.851 11.727a1.373 1.373 0 0 0-1.94 0L13.5 18.138l-1.94-1.94a1.373 1.373 0 0 0-1.94 0l-2.05 2.05a1.373 1.373 0 0 0 0 1.94l3.885 3.885a1.373 1.373 0 0 0 1.94 0l8.748-8.748a1.373 1.373 0 0 0 0-1.94z" />
    </svg>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');
  
  // Refs for sections to track navigation
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const leadershipRef = useRef<HTMLDivElement>(null);

  // Hook for 3D Hero Viewport (ref is placed on the tracking scene div, style on the rotated viewport)
  const heroSceneRef = useRef<HTMLDivElement>(null);
  const heroViewportStyle = useTilt(heroSceneRef, 12);

  // Apply scroll reveal animations to sections
  useScrollReveal(heroRef);
  useScrollReveal(aboutRef);
  useScrollReveal(projectsRef);
  useScrollReveal(skillsRef);
  useScrollReveal(experienceRef);
  useScrollReveal(educationRef);
  useScrollReveal(leadershipRef);

  // Scrollspy effect to dynamically sync active nav links on scroll
  useEffect(() => {
    const sections = [
      { id: 'hero', ref: heroRef },
      { id: 'about', ref: aboutRef },
      { id: 'experience', ref: experienceRef },
      { id: 'projects', ref: projectsRef },
      { id: 'skills', ref: skillsRef },
      { id: 'education', ref: educationRef },
      { id: 'leadership', ref: leadershipRef },
    ];

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((sec) => {
      if (sec.ref.current) {
        observer.observe(sec.ref.current);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (sectionId: string, ref: React.RefObject<HTMLDivElement | null>) => {
    setActiveSection(sectionId);
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={styles.container}>
      {/* Left Sticky Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          {/* Unconventional Avatar Frame */}
          <div className={styles.avatarFrame}>
            <span className={styles.avatarInitial}>PA</span>
          </div>
          
          <div className={styles.titleBlock}>
            <h1>Pulkit Arora</h1>
            <h2>SDE & Backend Engineer</h2>
            <p className={styles.profileBio}>
              Final-year CSE student at BPIT, Delhi, working as a Java backend developer.
            </p>
            <div className={styles.socialRow} style={{ marginTop: '16px' }}>
              <a href="https://github.com/Pulkitarora12" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="GitHub Profile">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com/in/pulkit-arora-92502321a" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn Profile">
                <Linkedin size={20} />
              </a>
              <a href="https://leetcode.com/u/pulkitarora0714/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LeetCode Profile">
                <LeetCodeIcon size={20} />
              </a>
              <a href="mailto:pulkitarora0714@gmail.com" className={styles.socialIcon} aria-label="Send Email">
                <Mail size={20} />
              </a>
              <a href="https://drive.google.com/file/d/1JfiQZNpRdWQkMmdui78LoARna6dBXbIE/view?usp=sharing" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="View Resume / CV">
                <FileText size={20} />
              </a>
            </div>
          </div>

          <nav className={styles.navMenu}>
            <button 
              onClick={() => scrollToSection('hero', heroRef)} 
              className={`${styles.navLink} ${activeSection === 'hero' ? styles.navLinkActive : ''}`}
            >
              Focus
            </button>
            <button 
              onClick={() => scrollToSection('about', aboutRef)} 
              className={`${styles.navLink} ${activeSection === 'about' ? styles.navLinkActive : ''}`}
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('experience', experienceRef)} 
              className={`${styles.navLink} ${activeSection === 'experience' ? styles.navLinkActive : ''}`}
            >
              Experience
            </button>
            <button 
              onClick={() => scrollToSection('projects', projectsRef)} 
              className={`${styles.navLink} ${activeSection === 'projects' ? styles.navLinkActive : ''}`}
            >
              Projects
            </button>
            <button 
              onClick={() => scrollToSection('skills', skillsRef)} 
              className={`${styles.navLink} ${activeSection === 'skills' ? styles.navLinkActive : ''}`}
            >
              Tech Stack
            </button>
            <button 
              onClick={() => scrollToSection('education', educationRef)} 
              className={`${styles.navLink} ${activeSection === 'education' ? styles.navLinkActive : ''}`}
            >
              Education
            </button>
            <button 
              onClick={() => scrollToSection('leadership', leadershipRef)} 
              className={`${styles.navLink} ${activeSection === 'leadership' ? styles.navLinkActive : ''}`}
            >
              Leadership
            </button>
          </nav>
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.socialRow}>
            <a href="https://github.com/Pulkitarora12" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="GitHub Profile">
              <Github size={20} />
            </a>
            <a href="https://linkedin.com/in/pulkit-arora-92502321a" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn Profile">
              <Linkedin size={20} />
            </a>
            <a href="https://leetcode.com/u/pulkitarora0714/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LeetCode Profile">
              <LeetCodeIcon size={20} />
            </a>
            <a href="mailto:pulkitarora0714@gmail.com" className={styles.socialIcon} aria-label="Send Email">
              <Mail size={20} />
            </a>
            <a href="https://drive.google.com/file/d/1JfiQZNpRdWQkMmdui78LoARna6dBXbIE/view?usp=sharing" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="View Resume / CV">
              <FileText size={20} />
            </a>
          </div>

          <div className={styles.statusIndicator}>
            <span className={styles.statusDot}></span>
            <span>Status: Available for SDE roles (2027 Track)</span>
          </div>
        </div>
      </aside>

      {/* Right Scrollable Panel */}
      <main className={styles.content}>
        {/* HERO SECTION */}
        <section ref={heroRef} id="hero" className={`${styles.section} ${styles.heroSection}`}>
          <div className={styles.heroGrid}>
            <div className={styles.heroIntro}>
              <span className={styles.sectionTag}>Core Mission</span>
              <h2 className={styles.heroTagline}>Building highly-scalable, deterministic backend systems.</h2>
              <p className={styles.heroText}>
                Engineering high-performance backend systems that require low latency, real-time message routing, and reliable telemetry synchronization. Deep focus on Spring Boot, high-performance concurrency models, and multi-tier memory caching schemes.
              </p>
              <div className={styles.heroCta}>
                <button onClick={() => scrollToSection('experience', experienceRef)} className={styles.btnPrimary}>
                  View Experience <ArrowRight size={16} />
                </button>
                <button onClick={() => scrollToSection('projects', projectsRef)} className={styles.btnSecondary}>
                  Verify Projects
                </button>
              </div>
            </div>

            {/* Custom CSS 3D Viewport - Tilts dynamically with mouse movement */}
            <div 
              className={styles.scene3D}
              ref={heroSceneRef}
            >
              <div className={styles.viewport3D} style={heroViewportStyle}>
                <div className={styles.gridBackground}></div>
                
                <div className={styles.dashboardHeader}>
                  <div className={styles.dashboardWindowDots}>
                    <span className={`${styles.dashboardDot} ${styles.dashboardDotActive}`}></span>
                    <span className={styles.dashboardDot}></span>
                    <span className={styles.dashboardDot}></span>
                  </div>
                  <span className={styles.dashboardTitle}>pulkit_telemetry.sys</span>
                </div>

                <div className={styles.dashboardContent}>
                  <div>
                    <div className={styles.dashLine}>$ systemctl status pulkit-dev</div>
                    <div className={`${styles.dashLine} ${styles.dashLineHighlight}`}>● active (running) since August 2023</div>
                    <div className={styles.dashLine}>&gt; Core runtime: JDK 21 / Spring Boot 3</div>
                    <div className={styles.dashLine}>&gt; Uptime: 2+ years production systems</div>
                  </div>

                  <div className={styles.dashMetricGrid}>
                    <div className={styles.dashMetricCard}>
                      <div className={styles.metricVal}>600+</div>
                      <div className={styles.metricLbl}>Algo Problems</div>
                    </div>
                    <div className={styles.dashMetricCard}>
                      <div className={styles.metricVal}>90%</div>
                      <div className={styles.metricLbl}>DB Reads Cached</div>
                    </div>
                    <div className={styles.dashMetricCard}>
                      <div className={styles.metricVal}>100ms</div>
                      <div className={styles.metricLbl}>Broadcast Latency</div>
                    </div>
                    <div className={styles.dashMetricCard}>
                      <div className={styles.metricVal}>6+</div>
                      <div className={styles.metricLbl}>Projects Built</div>
                    </div>
                  </div>

                  <div className={styles.dashGraphic}>
                    <span className={styles.dashGraphicBar}></span>
                    <span className={styles.dashGraphicBar}></span>
                    <span className={styles.dashGraphicBar}></span>
                    <span className={styles.dashGraphicBar}></span>
                    <span className={styles.dashGraphicBar}></span>
                    <span className={styles.dashGraphicBar}></span>
                    <span className={styles.dashGraphicBar}></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section ref={aboutRef} id="about" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Who I Am</span>
            <h2 className={styles.sectionTitle}>About Me</h2>
          </div>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutBio}>
              <p className={styles.aboutPara}>
                I am a final-year CSE student at BPIT, Delhi, working as a Java backend developer. I build production systems with Spring Boot, MySQL/PostgreSQL, and Docker, including a Manufacturing MIS deployed for a real client. Right now I&apos;m deep into distributed systems work like Redis caching, RabbitMQ, and rate limiters with Lua scripting, and exploring agentic AI architectures on the side.
              </p>
              <p className={styles.aboutPara}>
                Currently open to <strong>SDE / Backend internships (PPO/Full-time) for 2027</strong>. If you&apos;re building something serious with Java, Spring Boot, or distributed data — I&apos;m interested.
              </p>
            </div>
            <div className={styles.aboutStats}>
              <div className={styles.aboutStatCard}>
                <span className={styles.aboutStatVal}>2023</span>
                <span className={styles.aboutStatLbl}>Started shipping production code</span>
              </div>
              <div className={styles.aboutStatCard}>
                <span className={styles.aboutStatVal}>8.78</span>
                <span className={styles.aboutStatLbl}>CGPA at BPIT</span>
              </div>
              <div className={styles.aboutStatCard}>
                <span className={styles.aboutStatVal}>Freelance</span>
                <span className={styles.aboutStatLbl}>Systems Shipped for Clients</span>
              </div>
              <div className={styles.aboutStatCard}>
                <span className={styles.aboutStatVal}>Football</span>
                <span className={styles.aboutStatLbl}>Active Player & Sports Enthusiast</span>
              </div>
            </div>
          </div>
        </section>

        {/* EXPERIENCE TIMELINE SECTION */}
        <section ref={experienceRef} id="experience" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Project Experience</span>
            <h2 className={styles.sectionTitle}>Project Experience</h2>
          </div>

          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <span className={styles.timelineNode}></span>
              <div className={styles.timelineHeader}>
                <span className={styles.timelinePeriod}>Nov 2025 – Jan 2026</span>
                <h3 className={styles.timelineTitle}>Full Stack Developer (Freelance)</h3>
                <span className={styles.timelineCompany}>Faridabad, India</span>
              </div>
              <div className={styles.timelineBody}>
                <ul>
                  <li>Architected and implemented a Manufacturing Management Information System (MIS) with Spring Boot and Thymeleaf, integrating Google Sheets SDK for real-time MySQL operational synchronization.</li>
                  <li>Created an interactive production follow-up system with WebSockets and dynamic Role-Based Access Control, shortening operational issue resolution times by 30%.</li>
                  <li>Deployed core micro-services as robust background operations on Windows cloud infrastructure with monitoring telemetry.</li>
                  <li>Penned and executed end-to-end integration tests covering complex CRUD operations, API routes, and task-state queues.</li>
                </ul>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <span className={styles.timelineNode}></span>
              <div className={styles.timelineHeader}>
                <span className={styles.timelinePeriod}>June 2025 – August 2025</span>
                <h3 className={styles.timelineTitle}>Software Engineer (Intern)</h3>
                <span className={styles.timelineCompany}>Delhi, India</span>
              </div>
              <div className={styles.timelineBody}>
                <ul>
                  <li>Engineered a high-performance Sales Management SaaS Platform featuring OAuth 2.0 security, fine-grained access matching, and responsive CSV reporting pipelines.</li>
                  <li>Built responsive administrative panels and statistical telemetry tracking elements utilizing Spring Boot core and Spring Data JPA.</li>
                  <li>Containerized backend modules with Docker and deployed the target build on remote Linux systems behind Nginx reverse proxy configurations managing automated SSL handshakes.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section ref={projectsRef} id="projects" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Selected Deployments</span>
            <h2 className={styles.sectionTitle}>Engineered Architectures</h2>
          </div>

          <div className={styles.projectList}>
            {/* First Row (Scrolls Left) */}
            <ScrollMarquee direction="left" speed={0.8}>
              {row1Projects.map((proj, idx) => (
                <ProjectCard key={`r1-orig-${idx}`} {...proj} />
              ))}
              {row1Projects.map((proj, idx) => (
                <ProjectCard key={`r1-dup1-${idx}`} {...proj} />
              ))}
              {row1Projects.map((proj, idx) => (
                <ProjectCard key={`r1-dup2-${idx}`} {...proj} />
              ))}
            </ScrollMarquee>

            {/* Second Row (Scrolls Right) */}
            <ScrollMarquee direction="right" speed={0.8}>
              {row2Projects.map((proj, idx) => (
                <ProjectCard key={`r2-orig-${idx}`} {...proj} />
              ))}
              {row2Projects.map((proj, idx) => (
                <ProjectCard key={`r2-dup1-${idx}`} {...proj} />
              ))}
              {row2Projects.map((proj, idx) => (
                <ProjectCard key={`r2-dup2-${idx}`} {...proj} />
              ))}
            </ScrollMarquee>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section ref={skillsRef} id="skills" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Tech Stack Mapping</span>
            <h2 className={styles.sectionTitle}>Systems Blueprint</h2>
          </div>

          <div className={styles.skillsArchGrid}>
            <div className={styles.skillsRow}>
              <div className={styles.skillsRowHeader}>
                <span className={styles.skillsRowTitle}>
                  <Cpu size={16} /> Application Core
                </span>
              </div>
              <div className={styles.skillsCellList}>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>Java</span>
                  <div className={styles.skillLevel}>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={styles.skillLevelDot}></span>
                  </div>
                </div>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>Spring Boot</span>
                  <div className={styles.skillLevel}>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={styles.skillLevelDot}></span>
                  </div>
                </div>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>C++</span>
                  <div className={styles.skillLevel}>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={styles.skillLevelDot}></span>
                    <span className={styles.skillLevelDot}></span>
                  </div>
                </div>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>Spring Security</span>
                  <div className={styles.skillLevel}>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={styles.skillLevelDot}></span>
                    <span className={styles.skillLevelDot}></span>
                  </div>
                </div>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>React.js</span>
                  <div className={styles.skillLevel}>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={styles.skillLevelDot}></span>
                    <span className={styles.skillLevelDot}></span>
                  </div>
                </div>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>JavaScript</span>
                  <div className={styles.skillLevel}>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={styles.skillLevelDot}></span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.skillsRow}>
              <div className={styles.skillsRowHeader}>
                <span className={styles.skillsRowTitle}>
                  <Database size={16} /> Data & Caching
                </span>
              </div>
              <div className={styles.skillsCellList}>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>Redis</span>
                  <div className={styles.skillLevel}>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={styles.skillLevelDot}></span>
                  </div>
                </div>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>PostgreSQL</span>
                  <div className={styles.skillLevel}>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={styles.skillLevelDot}></span>
                    <span className={styles.skillLevelDot}></span>
                  </div>
                </div>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>MySQL</span>
                  <div className={styles.skillLevel}>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={styles.skillLevelDot}></span>
                  </div>
                </div>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>MongoDB</span>
                  <div className={styles.skillLevel}>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={styles.skillLevelDot}></span>
                    <span className={styles.skillLevelDot}></span>
                    <span className={styles.skillLevelDot}></span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.skillsRow}>
              <div className={styles.skillsRowHeader}>
                <span className={styles.skillsRowTitle}>
                  <Layers size={16} /> Networking
                </span>
              </div>
              <div className={styles.skillsCellList}>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>WebSockets</span>
                  <div className={styles.skillLevel}>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={styles.skillLevelDot}></span>
                  </div>
                </div>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>REST APIs</span>
                  <div className={styles.skillLevel}>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={styles.skillLevelDot}></span>
                  </div>
                </div>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>Event-Driven</span>
                  <div className={styles.skillLevel}>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={styles.skillLevelDot}></span>
                    <span className={styles.skillLevelDot}></span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.skillsRow}>
              <div className={styles.skillsRowHeader}>
                <span className={styles.skillsRowTitle}>
                  <Terminal size={16} /> Operations & Build
                </span>
              </div>
              <div className={styles.skillsCellList}>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>Docker</span>
                  <div className={styles.skillLevel}>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={styles.skillLevelDot}></span>
                    <span className={styles.skillLevelDot}></span>
                  </div>
                </div>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>Nginx</span>
                  <div className={styles.skillLevel}>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={styles.skillLevelDot}></span>
                    <span className={styles.skillLevelDot}></span>
                  </div>
                </div>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>AWS</span>
                  <div className={styles.skillLevel}>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={styles.skillLevelDot}></span>
                    <span className={styles.skillLevelDot}></span>
                    <span className={styles.skillLevelDot}></span>
                  </div>
                </div>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>Linux</span>
                  <div className={styles.skillLevel}>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={styles.skillLevelDot}></span>
                    <span className={styles.skillLevelDot}></span>
                  </div>
                </div>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>Git</span>
                  <div className={styles.skillLevel}>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={styles.skillLevelDot}></span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.skillsRow}>
              <div className={styles.skillsRowHeader}>
                <span className={styles.skillsRowTitle}>
                  <Sparkles size={16} /> AI & Developer Tools
                </span>
              </div>
              <div className={styles.skillsCellList}>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>Claude</span>
                  <div className={styles.skillLevel}>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={styles.skillLevelDot}></span>
                  </div>
                </div>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>Antigravity</span>
                  <div className={styles.skillLevel}>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                  </div>
                </div>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>Gemini</span>
                  <div className={styles.skillLevel}>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={`${styles.skillLevelDot} ${styles.skillLevelDotActive}`}></span>
                    <span className={styles.skillLevelDot}></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EDUCATION SECTION */}
        <section ref={educationRef} id="education" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Academic Record</span>
            <h2 className={styles.sectionTitle}>Education</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className={styles.educationCard}>
              <div className={styles.educationLeft}>
                <div className={styles.educationDegree}>B.Tech in Computer Science &amp; Engineering</div>
                <div className={styles.educationInstitute}>Bhagwan Parshuram Institute of Technology (BPIT)</div>
                <div className={styles.educationMeta}>Affiliated to GGSIPU · New Delhi, India</div>
              </div>
              <div className={styles.educationRight}>
                <div className={styles.educationStat}>
                  <span className={styles.educationStatVal}>8.78</span>
                  <span className={styles.educationStatLbl}>CGPA</span>
                </div>
                <div className={styles.educationStat}>
                  <span className={styles.educationStatVal}>2027</span>
                  <span className={styles.educationStatLbl}>Graduation</span>
                </div>
              </div>
            </div>

            <div className={styles.educationCard}>
              <div className={styles.educationLeft}>
                <div className={styles.educationDegree}>Class XII (Senior Secondary)</div>
                <div className={styles.educationInstitute}>Ben-Hur Public School</div>
                <div className={styles.educationMeta}>CBSE Board · Pilibhit, Uttar Pradesh</div>
              </div>
              <div className={styles.educationRight}>
                <div className={styles.educationStat}>
                  <span className={styles.educationStatVal}>91.6%</span>
                  <span className={styles.educationStatLbl}>Score</span>
                </div>
                <div className={styles.educationStat}>
                  <span className={styles.educationStatVal}>2022</span>
                  <span className={styles.educationStatLbl}>Graduation</span>
                </div>
              </div>
            </div>

            <div className={styles.educationCard}>
              <div className={styles.educationLeft}>
                <div className={styles.educationDegree}>Class X (Secondary)</div>
                <div className={styles.educationInstitute}>Ben-Hur Public School</div>
                <div className={styles.educationMeta}>CBSE Board · Pilibhit, Uttar Pradesh</div>
              </div>
              <div className={styles.educationRight}>
                <div className={styles.educationStat}>
                  <span className={styles.educationStatVal}>94.6%</span>
                  <span className={styles.educationStatLbl}>Score</span>
                </div>
                <div className={styles.educationStat}>
                  <span className={styles.educationStatVal}>2020</span>
                  <span className={styles.educationStatLbl}>Graduation</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LEADERSHIP SECTION */}
        <section ref={leadershipRef} id="leadership" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Community & Leadership</span>
            <h2 className={styles.sectionTitle}>Leadership</h2>
          </div>
          <div className={styles.leadershipCard}>
            <div className={styles.leadershipOrg}>
              <div className={styles.leadershipOrgName}>Drishti — Rotaract Club of BPIT</div>
              <div className={styles.leadershipOrgMeta}>Part-time · 2 yrs 9 mos</div>
            </div>
            <div className={styles.leadershipTimeline}>
              <div className={styles.leadershipItem}>
                <div className={styles.leadershipDot}></div>
                <div className={styles.leadershipContent}>
                  <div className={styles.leadershipRole}>Vice President</div>
                  <div className={styles.leadershipPeriod}>Jul 2025 – Jun 2026 · 1 yr</div>
                </div>
              </div>
              <div className={styles.leadershipItem}>
                <div className={styles.leadershipDot}></div>
                <div className={styles.leadershipContent}>
                  <div className={styles.leadershipRole}>Executive Board Member</div>
                  <div className={styles.leadershipPeriod}>Jul 2024 – Jun 2025 · 1 yr</div>
                </div>
              </div>
              <div className={styles.leadershipItem}>
                <div className={styles.leadershipDot}></div>
                <div className={styles.leadershipContent}>
                  <div className={styles.leadershipRole}>Member</div>
                  <div className={styles.leadershipPeriod}>Oct 2023 – Jun 2024 · 9 mos</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
