import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, BookOpen, FlaskConical } from 'lucide-react';
import { PROFILE } from '../data/profile';

interface HeroSectionProps {
  onNavigate: (id: string) => void;
  ready: boolean;
}

function CountUpNumber({
  target,
  suffix,
  ready,
}: {
  target: number;
  suffix: string;
  ready: boolean;
}) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!ready) return;
    let raf = 0;
    const duration = 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(target * eased));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ready]);

  return (
    <span className="tabular-nums">
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

export function HeroSection({ onNavigate, ready }: HeroSectionProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Kinetic scroll-driven parallax & split typography (never pushes downward into next section)
  const topLineX = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const middleScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const bottomLineX = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 140]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-between pt-28 pb-16 px-5 sm:px-8 lg:px-12 overflow-hidden"
    >
      {/* Decorative rotating orbital reticle */}
      <motion.div
        style={{ rotate: ringRotate, opacity: heroOpacity }}
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-20 sm:right-6 sm:top-24 w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] opacity-35"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <circle
            cx="200"
            cy="200"
            r="180"
            fill="none"
            stroke="rgba(46,230,214,0.22)"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
          <circle
            cx="200"
            cy="200"
            r="138"
            fill="none"
            stroke="rgba(245,185,113,0.18)"
            strokeWidth="1"
          />
          <ellipse
            cx="200"
            cy="200"
            rx="178"
            ry="66"
            transform="rotate(-24 200 200)"
            fill="none"
            stroke="rgba(139,124,255,0.28)"
            strokeWidth="1"
          />
          <circle cx="200" cy="20" r="3.5" fill="#2EE6D6" />
          <circle cx="338" cy="200" r="3" fill="#F5B971" />
        </svg>
      </motion.div>

      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="mx-auto w-full max-w-6xl relative z-10 my-auto"
      >
        {/* Eyebrow & Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex flex-wrap items-center gap-3 mb-7"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#2EE6D6]/30 bg-[#2EE6D6]/10 px-3.5 py-1 font-mono text-[10px] sm:text-[11px] tracking-[0.2em] text-[#2EE6D6] uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2EE6D6]" />
            {PROFILE.fullName}
          </span>
          <span className="font-mono text-[11px] tracking-[0.16em] text-[#98A2B3] uppercase">
            {PROFILE.heroEyebrow}
          </span>
        </motion.div>

        {/* Kinetic Split Display Headline */}
        <div className="space-y-1 sm:space-y-2 select-none">
          <motion.h1
            style={{ x: topLineX }}
            initial={{ opacity: 0, y: 40 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem] font-semibold tracking-tight leading-[0.98] text-[#F4F1EA]"
          >
            {PROFILE.heroHeadlineTop}
          </motion.h1>

          <motion.div
            style={{ scale: middleScale }}
            initial={{ opacity: 0, y: 40 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="origin-left font-serif italic text-5xl sm:text-7xl md:text-8xl lg:text-[6.2rem] leading-[0.94] bg-gradient-to-r from-[#2EE6D6] via-[#F4F1EA] to-[#F5B971] bg-clip-text text-transparent pr-4"
          >
            {PROFILE.heroHeadlineItalic}
          </motion.div>

          <motion.div
            style={{ x: bottomLineX }}
            initial={{ opacity: 0, y: 40 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem] font-semibold tracking-tight leading-[0.98] text-[#F4F1EA]/90"
          >
            {PROFILE.heroHeadlineBottom}
          </motion.div>
        </div>

        {/* Sub-grid: Narrative + Quick CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.48 }}
          className="mt-9 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end"
        >
          <div className="lg:col-span-7 space-y-4">
            <p className="text-base sm:text-lg text-[#98A2B3] leading-relaxed max-w-2xl">
              {PROFILE.heroDescription}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onNavigate('laboratory')}
                data-cursor="ENTER LAB"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#F4F1EA] px-6 py-3 text-sm font-semibold text-[#050608] hover:bg-[#2EE6D6] transition-all duration-300 cursor-pointer shadow-[0_0_30px_rgba(46,230,214,0.2)]"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Explore Living Lab</span>
                <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </button>

              <button
                onClick={() => onNavigate('publications')}
                data-cursor="PAPERS"
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-[#F4F1EA] hover:border-[#2EE6D6]/50 hover:bg-[#2EE6D6]/10 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#2EE6D6]" />
                <span>Publications &amp; Citations</span>
                <ArrowUpRight className="w-4 h-4 text-[#98A2B3] group-hover:text-[#2EE6D6] transition-colors" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 glass-panel rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-[#98A2B3]">
              <span>CURRENT APPOINTMENT</span>
              <span className="text-[#2EE6D6]">● ACTIVE</span>
            </div>
            <p className="text-sm font-medium text-[#F4F1EA]">{PROFILE.roleTitle}</p>
            <p className="text-xs text-[#98A2B3]">{PROFILE.affiliation}</p>
            <div className="pt-2 border-t border-white/8 flex items-center justify-between font-mono text-[11px] text-[#98A2B3]">
              <span>{PROFILE.location}</span>
              <span className="text-[#F5B971]">{PROFILE.coordinates}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Telemetry & Impact Strip */}
      <motion.div
        style={{ opacity: heroOpacity }}
        initial={{ opacity: 0, y: 20 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mx-auto w-full max-w-6xl relative z-10 mt-10 pt-6 border-t border-white/10"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {PROFILE.stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <div className="font-serif italic text-3xl sm:text-4xl text-[#F4F1EA]">
                <CountUpNumber
                  target={stat.value}
                  suffix={stat.suffix}
                  ready={ready}
                />
              </div>
              <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[#98A2B3]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
