import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { MotionConfig } from 'framer-motion';
import { Lang, PROFILE_BY_LANG } from './data/profile';
import { Preloader } from './components/Preloader';
import { WebGLBackdrop } from './components/WebGLBackdrop';
import { MagneticCursor } from './components/MagneticCursor';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PinnedLabShowcase } from './components/PinnedLabShowcase';
import { ProjectsSection } from './components/ProjectsSection';
import { PublicationsSection } from './components/PublicationsSection';
import { TimelineSection } from './components/TimelineSection';
import { WritingSection } from './components/WritingSection';
import { ContactSection } from './components/ContactSection';
import { CommandPalette } from './components/CommandPalette';

export function App() {
  const [ready, setReady] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = window.localStorage.getItem('observatory-lang');
    return saved === 'fa' ? 'fa' : 'en';
  });
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.title = PROFILE_BY_LANG[lang].pageTitle;
    window.localStorage.setItem('observatory-lang', lang);
  }, [lang]);

  useEffect(() => {
    // Enable Lenis smooth inertia on desktop fine pointers; leave native momentum scroll on mobile touchscreens
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const isDesktop = window.innerWidth >= 1024;
    if (reducedMotion || !isFinePointer || !isDesktop) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const navigateTo = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: 0, duration: 1.25 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'fa' : 'en'));
  }, []);

  return (
    <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>
      <Preloader onComplete={() => setReady(true)} lang={lang} />
      <WebGLBackdrop mode="interference" reducedMotion={reducedMotion} />
      <MagneticCursor />

      <Navbar
        lang={lang}
        onToggleLang={toggleLang}
        onNavigate={navigateTo}
        onOpenCommand={() => setCmdOpen(true)}
      />

      <main className="relative">
        <HeroSection
          lang={lang}
          onNavigate={navigateTo}
          ready={ready}
          reducedMotion={reducedMotion}
        />
        <PinnedLabShowcase lang={lang} />
        <ProjectsSection lang={lang} />
        <PublicationsSection lang={lang} />
        <TimelineSection lang={lang} />
        <WritingSection lang={lang} />
        <ContactSection lang={lang} />
      </main>

      <CommandPalette
        lang={lang}
        onToggleLang={toggleLang}
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onNavigate={navigateTo}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion((v) => !v)}
      />
    </MotionConfig>
  );
}

export default App;
