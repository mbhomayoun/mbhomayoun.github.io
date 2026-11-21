import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Lang, PROFILE_BY_LANG, UI_COPY } from '../data/profile';

export function TimelineSection({ lang }: { lang: Lang }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const profile = PROFILE_BY_LANG[lang];
  const copy = UI_COPY[lang];
  const isRtl = lang === 'fa';

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 65%'],
  });

  const spineScaleY = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 26,
  });

  return (
    <section id="chronicle" className="relative py-16 sm:py-20 px-4 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 sm:mb-16">
          <div className="text-[11px] tracking-[0.18em] text-[#8B7CFF] mb-2">
            {copy.chronicle.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#F4F1EA]">
            {copy.chronicle.headingLead}{' '}
            <span
              className={
                isRtl
                  ? 'text-[#8B7CFF] font-bold'
                  : 'font-serif italic font-normal text-[#8B7CFF]'
              }
            >
              {copy.chronicle.headingAccent}
            </span>
          </h2>
        </div>

        <div ref={containerRef} className="relative">
          {/* Background track */}
          <div
            aria-hidden="true"
            className="absolute start-4 md:start-1/2 top-0 bottom-0 w-px bg-white/10 ltr:-translate-x-1/2 rtl:translate-x-1/2"
          />

          {/* Scroll-drawn luminous laser beam */}
          <motion.div
            aria-hidden="true"
            style={{ scaleY: spineScaleY, transformOrigin: 'top center' }}
            className="absolute start-4 md:start-1/2 top-0 bottom-0 w-[2px] ltr:-translate-x-1/2 rtl:translate-x-1/2 bg-gradient-to-b from-[#2EE6D6] via-[#8B7CFF] to-[#F5B971] shadow-[0_0_20px_rgba(46,230,214,0.65)]"
          />

          <div className="space-y-10 sm:space-y-12">
            {profile.timeline.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div
                  key={item.id}
                  className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center"
                >
                  <div
                    aria-hidden="true"
                    className="absolute start-4 md:start-1/2 top-7 md:top-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
                  >
                    <span className="h-4 w-4 rounded-full bg-[#050608] border-2 border-[#2EE6D6] shadow-[0_0_16px_rgba(46,230,214,0.85)]" />
                  </div>

                  <div className={isLeft ? 'hidden md:block md:order-2' : 'hidden md:block md:order-1'} />

                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.08 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={`ps-11 md:ps-0 ${
                      isLeft ? 'md:order-1 md:pe-6' : 'md:order-2 md:ps-6'
                    }`}
                  >
                    <div className="glass-panel rounded-3xl p-5 sm:p-7 space-y-3.5 border border-white/10 hover:border-[#8B7CFF]/40 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs tracking-wider text-[#2EE6D6]">
                          {item.period}
                        </span>
                        <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-[#8B7CFF]/15 text-[#8B7CFF] border border-[#8B7CFF]/30">
                          {item.kind}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-[#F4F1EA]">
                          {item.role}
                        </h3>
                        <p className="text-sm font-medium text-[#F5B971] mt-0.5">
                          {item.institution} ·{' '}
                          <span className="text-[#98A2B3] font-normal">
                            {item.location}
                          </span>
                        </p>
                      </div>

                      <p className="text-sm text-[#98A2B3] leading-relaxed">
                        {item.summary}
                      </p>

                      <ul className="space-y-1.5 pt-2 border-t border-white/8">
                        {item.highlights.map((h) => (
                          <li
                            key={h}
                            className="flex items-start gap-2 text-xs text-[#F4F1EA]/85"
                          >
                            <span className="mt-1.5 h-1 w-1 rounded-full bg-[#2EE6D6] shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
