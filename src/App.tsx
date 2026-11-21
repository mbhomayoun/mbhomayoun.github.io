import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { MotionConfig } from 'framer-motion';
import { ShaderMode } from './data/profile';
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

const SHADER_CYCLE: ShaderMode[] = ['interference', 'lattice', 'aurora'];

export function App() {
  const [ready, setReady] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [shaderMode, setShaderMode] = useState<ShaderMode>('interference');
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
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
      lenisRef.current.scrollTo(el, { offset: 0, duration: 1.3 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const cycleShader = useCallback(() => {
    setShaderMode((prev) => {
      const idx = SHADER_CYCLE.indexOf(prev);
      return SHADER_CYCLE[(idx + 1) % SHADER_CYCLE.length];
    });
  }, []);

  return (
    <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>
      <Preloader onComplete={() => setReady(true)} />
      <WebGLBackdrop mode={shaderMode} reducedMotion={reducedMotion} />
      <MagneticCursor />

      <Navbar
        onNavigate={navigateTo}
        onOpenCommand={() => setCmdOpen(true)}
        shaderMode={shaderMode}
        onCycleShader={cycleShader}
      />

      <main className="relative">
        <HeroSection onNavigate={navigateTo} ready={ready} />
        <PinnedLabShowcase />
        <ProjectsSection />
        <PublicationsSection />
        <TimelineSection />
        <WritingSection />
        <ContactSection />
      </main>

      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onNavigate={navigateTo}
        shaderMode={shaderMode}
        onSetShaderMode={setShaderMode}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion((v) => !v)}
      />
    </MotionConfig>
  );
}

export default App;
