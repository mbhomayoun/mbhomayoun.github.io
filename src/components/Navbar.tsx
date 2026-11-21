import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Command, Globe } from 'lucide-react';
import { Lang, PROFILE_BY_LANG, UI_COPY } from '../data/profile';
import { CmsPost } from '../types/cms';
import { AlertBell } from './AlertBell';

interface NavbarProps {
  lang: Lang;
  onToggleLang: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenCommand: () => void;
  alerts: CmsPost[];
  dismissedAlertIds: string[];
  onDismissAllAlerts: () => void;
  onOpenAlert: (post: CmsPost) => void;
}

export function Navbar({
  lang,
  onToggleLang,
  onNavigate,
  onOpenCommand,
  alerts,
  dismissedAlertIds,
  onDismissAllAlerts,
  onOpenAlert,
}: NavbarProps) {
  const [activeId, setActiveId] = useState<string>('hero');
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 26,
    restDelta: 0.001,
  });

  const profile = PROFILE_BY_LANG[lang];
  const copy = UI_COPY[lang];
  const isRtl = lang === 'fa';

  useEffect(() => {
    const sections = ['hero', ...copy.nav.map((i) => i.id)];
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
  }, [copy.nav]);

  return (
    <header className="fixed top-3 sm:top-4 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none">
      <div className="mx-auto max-w-6xl flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand Pill */}
        <button
          onClick={() => onNavigate('hero')}
          data-cursor="TOP"
          className="pointer-events-auto glass-panel rounded-full px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2 group hover:border-[#2EE6D6]/40 transition-colors cursor-pointer"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="hidden sm:inline-flex animate-ping absolute h-full w-full rounded-full bg-[#2EE6D6] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2EE6D6]" />
          </span>
          <span
            className={`text-sm sm:text-base text-[#F4F1EA] leading-none whitespace-nowrap ${
              isRtl ? 'font-semibold' : 'font-serif italic text-base sm:text-lg'
            }`}
          >
            {profile.shortName}
          </span>
          <span className="hidden lg:inline font-mono text-[10px] tracking-widest uppercase text-[#98A2B3] border-s border-white/10 ps-2.5">
            {profile.brandSubtitle}
          </span>
        </button>

        {/* Center Navigation Rail */}
        <nav
          aria-label="Primary Navigation"
          className="pointer-events-auto hidden md:flex items-center gap-1 glass-panel rounded-full p-1.5"
        >
          {copy.nav.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
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

        {/* End Controls: Alert Bell, Language Switcher & Menu ⌘K */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          <AlertBell
            lang={lang}
            alerts={alerts}
            dismissedIds={dismissedAlertIds}
            onDismissAll={onDismissAllAlerts}
            onOpenAlert={onOpenAlert}
            onNavigateAcademy={() => onNavigate('academy')}
          />

          <button
            onClick={onToggleLang}
            data-cursor="LANG"
            aria-label={copy.langSwitchLabel}
            title={copy.langSwitchLabel}
            className="glass-panel rounded-full px-2.5 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 text-[11px] font-medium text-[#F4F1EA] hover:text-[#2EE6D6] hover:border-[#2EE6D6]/45 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#2EE6D6] shrink-0" />
            <span className="tracking-wide font-fa-force">{copy.langSwitchShort}</span>
          </button>

          <button
            onClick={onOpenCommand}
            data-cursor="MENU"
            className="glass-panel rounded-full px-3 sm:px-3.5 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 text-xs text-[#F4F1EA] hover:border-[#2EE6D6]/45 transition-colors cursor-pointer"
          >
            <Command className="w-3.5 h-3.5 text-[#2EE6D6] shrink-0" />
            <span className="text-[11px] font-medium text-[#F4F1EA]/90">
              {copy.indexLabel}
            </span>
            <kbd
              dir="ltr"
              className="hidden sm:inline font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/8 border border-white/10 text-[#98A2B3]"
            >
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      {/* Ultra-thin scroll progress hairline */}
      <div className="mx-auto max-w-6xl mt-2 px-3 sm:px-4">
        <div className="h-[1px] w-full bg-white/5 overflow-hidden rounded-full">
          <motion.div
            className={`h-full bg-gradient-to-r from-[#2EE6D6] via-[#8B7CFF] to-[#F5B971] ${
              isRtl ? 'origin-right' : 'origin-left'
            }`}
            style={{ scaleX: smoothProgress }}
          />
        </div>
      </div>
    </header>
  );
}
