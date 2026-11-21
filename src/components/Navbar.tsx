import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Command, Sparkles } from 'lucide-react';
import { PROFILE, ShaderMode } from '../data/profile';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  onOpenCommand: () => void;
  shaderMode: ShaderMode;
  onCycleShader: () => void;
}

const NAV_ITEMS = [
  { id: 'laboratory', label: 'Lab' },
  { id: 'projects', label: 'Projects' },
  { id: 'publications', label: 'Papers' },
  { id: 'chronicle', label: 'Chronicle' },
  { id: 'writing', label: 'Notes' },
  { id: 'contact', label: 'Contact' },
];

export function Navbar({
  onNavigate,
  onOpenCommand,
  shaderMode,
  onCycleShader,
}: NavbarProps) {
  const [activeId, setActiveId] = useState<string>('hero');
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 26,
    restDelta: 0.001,
  });

  useEffect(() => {
    const sections = ['hero', ...NAV_ITEMS.map((i) => i.id)];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-38% 0px -48% 0px' }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none">
      <div className="mx-auto max-w-6xl flex items-center justify-between gap-3">
        {/* Brand Monogram Pill */}
        <button
          onClick={() => onNavigate('hero')}
          data-cursor="TOP"
          className="pointer-events-auto glass-panel rounded-full px-4 py-2 flex items-center gap-2.5 group hover:border-[#2EE6D6]/40 transition-colors cursor-pointer"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2EE6D6] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2EE6D6]" />
          </span>
          <span className="font-serif italic text-lg text-[#F4F1EA] leading-none">
            {PROFILE.shortName}
          </span>
          <span className="hidden md:inline font-mono text-[10px] tracking-widest uppercase text-[#98A2B3] border-l border-white/10 pl-2.5">
            Observatory
          </span>
        </button>

        {/* Center Navigation Rail */}
        <nav
          aria-label="Primary Navigation"
          className="pointer-events-auto hidden md:flex items-center gap-1 glass-panel rounded-full p-1.5"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#050608]'
                    : 'text-[#98A2B3] hover:text-[#F4F1EA]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-[#F4F1EA]"
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Shader Mode & Cmd+K */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={onCycleShader}
            data-cursor="FIELD"
            title="Cycle live WebGL field shader"
            className="glass-panel rounded-full px-3 py-2 flex items-center gap-1.5 text-[11px] font-mono text-[#98A2B3] hover:text-[#2EE6D6] hover:border-[#2EE6D6]/40 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2EE6D6]" />
            <span className="hidden sm:inline uppercase tracking-wider">
              {shaderMode}
            </span>
          </button>

          <button
            onClick={onOpenCommand}
            data-cursor="CMD+K"
            className="glass-panel rounded-full px-3.5 py-2 flex items-center gap-2 text-xs text-[#F4F1EA] hover:border-[#2EE6D6]/45 transition-colors cursor-pointer"
          >
            <Command className="w-3.5 h-3.5 text-[#2EE6D6]" />
            <span className="hidden sm:inline font-mono text-[11px] text-[#98A2B3]">
              Menu
            </span>
            <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/8 border border-white/10 text-[#F4F1EA]">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      {/* Ultra-thin scroll progress hairline */}
      <div className="mx-auto max-w-6xl mt-2 px-4">
        <div className="h-[1px] w-full bg-white/5 overflow-hidden rounded-full">
          <motion.div
            className="h-full origin-left bg-gradient-to-r from-[#2EE6D6] via-[#8B7CFF] to-[#F5B971]"
            style={{ scaleX: smoothProgress }}
          />
        </div>
      </div>
    </header>
  );
}
