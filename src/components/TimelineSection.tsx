import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { PROFILE } from '../data/profile';

export function TimelineSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 65%'],
  });

  const spineScaleY = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 26,
  });

  return (
    <section id="chronicle" className="relative py-20 px-5 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8B7CFF] mb-2">
            04 // ACADEMIC &amp; RESEARCH CHRONICLE
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#F4F1EA]">
            Trajectory &amp;{' '}
            <span className="font-serif italic font-normal text-[#8B7CFF]">
              Appointments
            </span>
          </h2>
        </div>

        <div ref={containerRef} className="relative">
          {/* Background track */}
          <div
            aria-hidden="true"
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2"
          />

          {/* Scroll-drawn luminous laser beam */}
          <motion.div
            aria-hidden="true"
            style={{ scaleY: spineScaleY, transformOrigin: 'top center' }}
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#2EE6D6] via-[#8B7CFF] to-[#F5B971] shadow-[0_0_20px_rgba(46,230,214,0.65)]"
          />

          <div className="space-y-12">
            {PROFILE.timeline.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div
                  key={item.id}
                  className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center"
                >
                  {/* Glowing Milestone Node */}
                  <div
                    aria-hidden="true"
                    className="absolute left-4 md:left-1/2 top-7 md:top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
                  >
                    <span className="h-4 w-4 rounded-full bg-[#050608] border-2 border-[#2EE6D6] shadow-[0_0_16px_rgba(46,230,214,0.85)]" />
                  </div>

                  {/* Spacer on desktop for alternating layout */}
                  <div className={isLeft ? 'hidden md:block md:order-2' : 'hidden md:block md:order-1'} />

                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? -28 : 28, y: 12 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className={`pl-12 md:pl-0 ${
                      isLeft ? 'md:order-1 md:pr-6' : 'md:order-2 md:pl-6'
                    }`}
                  >
                    <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-4 border border-white/10 hover:border-[#8B7CFF]/40 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-xs tracking-[0.18em] text-[#2EE6D6]">
                          {item.period}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] px-2.5 py-0.5 rounded-full bg-[#8B7CFF]/15 text-[#8B7CFF] border border-[#8B7CFF]/30">
                          {item.kind}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-[#F4F1EA]">
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
