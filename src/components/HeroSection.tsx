import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, BookOpen, FlaskConical } from 'lucide-react';
import { Lang, PROFILE_BY_LANG, UI_COPY } from '../data/profile';
import { formatNum } from '../utils/format';
import { Hero3DMode, Hero3DScene } from './Hero3DScene';

interface HeroSectionProps {
  lang: Lang;
  onNavigate: (id: string) => void;
  ready: boolean;
  reducedMotion: boolean;
}

function CountUpNumber({
  target,
  suffix,
  ready,
  lang,
}: {
  target: number;
  suffix: string;
  ready: boolean;
  lang: Lang;
}) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!ready) return;
    let raf = 0;
    const duration = 1100;
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

  const formattedVal = formatNum(val, lang);
  const formattedSuffix = formatNum(suffix, lang);

  return (
    <span dir={lang === 'fa' ? 'rtl' : 'ltr'} className="tabular-nums inline-block">
      {formattedVal}
      {formattedSuffix}
    </span>
  );
}

export function HeroSection({
  lang,
  onNavigate,
  ready,
  reducedMotion,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [sceneMode, setSceneMode] = useState<Hero3DMode>('stress');
  const profile = PROFILE_BY_LANG[lang];
  const copy = UI_COPY[lang];
  const isRtl = lang === 'fa';

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const topLineX = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', isRtl ? '8%' : '-10%']
  );
  const middleScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const bottomLineX = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', isRtl ? '-8%' : '10%']
  );
  const heroOpacity = useTransform(scrollYProgress, [0, 0.78], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -32]);
  const sceneFade = useTransform(scrollYProgress, [0, 0.9], [1, 0.14]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-between pt-20 pb-6 px-4 sm:px-8 lg:px-12 overflow-hidden"
    >
      {/* Fullscreen Spatial 3D WebGL Layer */}
      <motion.div
        style={{ opacity: sceneFade }}
        className="absolute inset-0 z-0"
      >
        <Hero3DScene
          mode={sceneMode}
          reducedMotion={reducedMotion}
          isRtl={isRtl}
        />

        {/* Directional legibility scrim aligned to LTR or RTL */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 ${
            isRtl
              ? 'bg-gradient-to-l from-[#050608]/88 via-[#050608]/40 to-transparent'
              : 'bg-gradient-to-r from-[#050608]/85 via-[#050608]/35 to-transparent'
          }`}
        />
        {/* Bottom horizon blend */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#050608] via-[#050608]/65 to-transparent"
        />
      </motion.div>

      {/* Foreground Editorial Typography Floating Over the 3D World */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="pointer-events-none mx-auto w-full max-w-6xl relative z-10 my-auto py-2"
      >
        <div className="max-w-2xl space-y-4">
          {/* Eyebrow & Name Badge */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="flex flex-wrap items-center gap-2.5"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#2EE6D6]/40 bg-[#050608]/65 backdrop-blur-md px-3.5 py-1 text-[11px] font-medium tracking-wide text-[#2EE6D6]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2EE6D6]" />
              {profile.fullName}
            </span>
            <span className="text-[11px] tracking-wider text-[#98A2B3] uppercase">
              {profile.heroEyebrow}
            </span>
          </motion.div>

          {/* Kinetic Split Display Headline */}
          <div className="space-y-1 select-none drop-shadow-[0_12px_36px_rgba(5,6,8,0.85)]">
            <motion.h1
              style={{ x: topLineX }}
              initial={{ opacity: 0, y: 26 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className={`font-semibold tracking-tight text-[#F4F1EA] ${
                isRtl
                  ? 'text-3xl sm:text-5xl md:text-6xl leading-[1.14]'
                  : 'text-4xl sm:text-5xl md:text-6xl xl:text-[4.15rem] leading-[0.98]'
              }`}
            >
              {profile.heroHeadlineTop}
            </motion.h1>

            <motion.div
              style={{ scale: middleScale }}
              initial={{ opacity: 0, y: 26 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className={`${
                isRtl
                  ? 'origin-right text-4xl sm:text-6xl md:text-7xl font-extrabold leading-[1.15]'
                  : 'origin-left font-serif italic text-5xl sm:text-6xl md:text-7xl xl:text-[4.95rem] leading-[0.95] pe-4'
              } bg-gradient-to-r from-[#2EE6D6] via-[#F4F1EA] to-[#F5B971] bg-clip-text text-transparent`}
            >
              {profile.heroHeadlineItalic}
            </motion.div>

            <motion.div
              style={{ x: bottomLineX }}
              initial={{ opacity: 0, y: 26 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={`font-semibold tracking-tight text-[#F4F1EA]/95 ${
                isRtl
                  ? 'text-3xl sm:text-5xl md:text-6xl leading-[1.14]'
                  : 'text-4xl sm:text-5xl md:text-6xl xl:text-[4.15rem] leading-[0.98]'
              }`}
            >
              {profile.heroHeadlineBottom}
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.36 }}
            className="text-sm sm:text-base text-[#D0D5DD] leading-relaxed max-w-xl drop-shadow-[0_4px_16px_rgba(5,6,8,0.9)]"
          >
            {profile.heroDescription}
          </motion.p>

          {/* Primary CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.44 }}
            className="pointer-events-auto flex flex-wrap items-center gap-3 pt-1 w-fit"
          >
            <button
              onClick={() => onNavigate('laboratory')}
              data-cursor="LAB"
              className="group inline-flex items-center gap-2 rounded-full bg-[#F4F1EA] px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[#050608] hover:bg-[#2EE6D6] transition-all duration-300 cursor-pointer shadow-[0_0_28px_rgba(46,230,214,0.25)]"
            >
              <FlaskConical className="w-4 h-4 shrink-0" />
              <span>{copy.hero.exploreLab}</span>
              <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </button>

            <button
              onClick={() => onNavigate('publications')}
              data-cursor="PAPERS"
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#050608]/55 backdrop-blur-md px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-[#F4F1EA] hover:border-[#2EE6D6]/55 hover:bg-[#2EE6D6]/15 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#2EE6D6] shrink-0" />
              <span>{copy.hero.publications}</span>
              <ArrowUpRight className="w-4 h-4 text-[#98A2B3] group-hover:text-[#2EE6D6] transition-colors" />
            </button>
          </motion.div>

          {/* Compact Affiliation Pill */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.5 }}
            className="pointer-events-auto glass-panel rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 max-w-xl"
          >
            <div className="space-y-0.5">
              <div className="text-[11px] font-medium tracking-wide text-[#2EE6D6]">
                ● {profile.roleTitle}
              </div>
              <div className="text-xs text-[#F4F1EA]/90">{profile.affiliation}</div>
            </div>
            <div className="text-xs text-[#F5B971] shrink-0">
              {profile.location}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Telemetry Strip + Seamless 3D Field Switcher */}
      <motion.div
        style={{ opacity: heroOpacity }}
        initial={{ opacity: 0, y: 16 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.54 }}
        className="mx-auto w-full max-w-6xl relative z-10 mt-3 pt-4 border-t border-white/12 flex flex-col lg:flex-row lg:items-end justify-between gap-4"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 flex-1">
          {profile.stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <div
                className={`text-2xl sm:text-4xl text-[#F4F1EA] ${
                  isRtl ? 'font-bold font-fa-force' : 'font-serif italic'
                }`}
              >
                <CountUpNumber
                  target={stat.value}
                  suffix={stat.suffix}
                  ready={ready}
                  lang={lang}
                />
              </div>
              <div className="text-[10px] sm:text-[11px] tracking-wider text-[#98A2B3]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Seamless 3D Spatial Controls */}
        <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
          <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.16em] text-[#98A2B3]">
            {copy.hero.dragHint}
          </span>
          <div className="inline-flex items-center gap-1 rounded-full glass-panel p-1.5 w-fit">
            {copy.hero.modes.map((item) => {
              const active = sceneMode === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSceneMode(item.id)}
                  className={`rounded-full px-3 py-1 text-[10px] sm:text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#2EE6D6] text-[#050608] font-semibold'
                      : 'text-[#98A2B3] hover:text-[#F4F1EA]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
