import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, BookOpen, FlaskConical } from 'lucide-react';
import { PROFILE } from '../data/profile';
import { Hero3DScene } from './Hero3DScene';

interface HeroSectionProps {
  onNavigate: (id: string) => void;
  ready: boolean;
  reducedMotion: boolean;
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

export function HeroSection({
  onNavigate,
  ready,
  reducedMotion,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Kinetic scroll-driven parallax & split typography
  const topLineX = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
  const middleScale = useTransform(scrollYProgress, [0, 1], [1, 1.07]);
  const bottomLineX = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.78], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-between pt-24 pb-12 px-5 sm:px-8 lg:px-12 overflow-hidden"
    >
      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="mx-auto w-full max-w-6xl relative z-10 my-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left Editorial Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Eyebrow & Name Badge */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex flex-wrap items-center gap-2.5"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[#2EE6D6]/35 bg-[#2EE6D6]/10 px-3.5 py-1 font-mono text-[10px] sm:text-[11px] tracking-[0.18em] text-[#2EE6D6] uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2EE6D6]" />
                {PROFILE.fullName}
              </span>
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.14em] text-[#98A2B3] uppercase">
                {PROFILE.heroEyebrow}
              </span>
            </motion.div>

            {/* Kinetic Split Display Headline */}
            <div className="space-y-1 select-none">
              <motion.h1
                style={{ x: topLineX }}
                initial={{ opacity: 0, y: 36 }}
                animate={ready ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl sm:text-5xl md:text-6xl xl:text-[4.35rem] font-semibold tracking-tight leading-[0.98] text-[#F4F1EA]"
              >
                {PROFILE.heroHeadlineTop}
              </motion.h1>

              <motion.div
                style={{ scale: middleScale }}
                initial={{ opacity: 0, y: 36 }}
                animate={ready ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.85, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="origin-left font-serif italic text-5xl sm:text-6xl md:text-7xl xl:text-[5.2rem] leading-[0.94] bg-gradient-to-r from-[#2EE6D6] via-[#F4F1EA] to-[#F5B971] bg-clip-text text-transparent pr-4"
              >
                {PROFILE.heroHeadlineItalic}
              </motion.div>

              <motion.div
                style={{ x: bottomLineX }}
                initial={{ opacity: 0, y: 36 }}
                animate={ready ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.85, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl sm:text-5xl md:text-6xl xl:text-[4.35rem] font-semibold tracking-tight leading-[0.98] text-[#F4F1EA]/90"
              >
                {PROFILE.heroHeadlineBottom}
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.42 }}
              className="text-sm sm:text-base text-[#98A2B3] leading-relaxed max-w-xl"
            >
              {PROFILE.heroDescription}
            </motion.p>

            {/* Primary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.5 }}
              className="flex flex-wrap items-center gap-3 pt-1"
            >
              <button
                onClick={() => onNavigate('laboratory')}
                data-cursor="ENTER LAB"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#F4F1EA] px-5 sm:px-6 py-3 text-sm font-semibold text-[#050608] hover:bg-[#2EE6D6] transition-all duration-300 cursor-pointer shadow-[0_0_30px_rgba(46,230,214,0.22)]"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Explore Research Lab</span>
                <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </button>

              <button
                onClick={() => onNavigate('publications')}
                data-cursor="PAPERS"
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-5 sm:px-6 py-3 text-sm font-medium text-[#F4F1EA] hover:border-[#2EE6D6]/50 hover:bg-[#2EE6D6]/10 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#2EE6D6]" />
                <span>Publications</span>
                <ArrowUpRight className="w-4 h-4 text-[#98A2B3] group-hover:text-[#2EE6D6] transition-colors" />
              </button>
            </motion.div>

            {/* Compact Affiliation Pill Card */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.56 }}
              className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-xl"
            >
              <div className="space-y-0.5">
                <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#2EE6D6]">
                  ● {PROFILE.roleTitle}
                </div>
                <div className="text-xs text-[#F4F1EA]/90">{PROFILE.affiliation}</div>
              </div>
              <div className="font-mono text-[11px] text-[#F5B971] shrink-0">
                {PROFILE.location}
              </div>
            </motion.div>
          </div>

          {/* Right Massive Interactive 3D Centerpiece */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={ready ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.0, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <Hero3DScene reducedMotion={reducedMotion} />
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Telemetry & Output Strip */}
      <motion.div
        style={{ opacity: heroOpacity }}
        initial={{ opacity: 0, y: 20 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.62 }}
        className="mx-auto w-full max-w-6xl relative z-10 mt-8 pt-6 border-t border-white/10"
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
