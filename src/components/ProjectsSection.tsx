import { forwardRef, MouseEvent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Code2, Layers, Sparkles, X } from 'lucide-react';
import { PROFILE, ProjectItem } from '../data/profile';

const CATEGORIES = [
  'All',
  'Geomechanics',
  'Stimulation',
  'Drilling & CFD',
  'Energy Policy',
] as const;

function Sparkline({ data, accent }: { data: number[]; accent: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(max - min, 1);
  const pts = data
    .map((v, i) => {
      const x = (i / Math.max(data.length - 1, 1)) * 120;
      const y = 28 - ((v - min) / range) * 22;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 120 32" className="w-28 h-8 overflow-visible">
      <polyline
        fill="none"
        stroke={accent}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  );
}

const TiltProjectCard = forwardRef<
  HTMLButtonElement,
  {
    project: ProjectItem;
    onSelect: (p: ProjectItem) => void;
  }
>(function TiltProjectCard({ project, onSelect }, ref) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });

  const handleMove = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 9,
      ry: (px - 0.5) * 9,
      mx: px * 100,
      my: py * 100,
    });
  };

  const resetTilt = () => setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });

  const accent =
    project.category === 'Geomechanics'
      ? '#2EE6D6'
      : project.category === 'Stimulation'
        ? '#F5B971'
        : project.category === 'Drilling & CFD'
          ? '#8B7CFF'
          : '#38BDF8';

  return (
    <motion.button
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMove}
      onMouseLeave={resetTilt}
      onClick={() => onSelect(project)}
      data-cursor="INSPECT"
      style={{
        transform: `perspective(950px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: 'transform 0.18s ease-out',
      }}
      className={`group relative text-left glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden cursor-pointer border hover:border-white/20 ${
        project.featured ? 'md:col-span-2 lg:col-span-1' : ''
      }`}
    >
      {/* Dynamic cursor spotlight sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(380px circle at ${tilt.mx}% ${tilt.my}%, ${accent}1a, transparent 65%)`,
        }}
      />

      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border"
            style={{
              color: accent,
              borderColor: `${accent}40`,
              backgroundColor: `${accent}12`,
            }}
          >
            {project.category}
          </span>
          <span className="font-mono text-xs text-[#98A2B3]">{project.year}</span>
        </div>

        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xl sm:text-2xl font-semibold text-[#F4F1EA] group-hover:text-[#2EE6D6] transition-colors">
              {project.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-[#98A2B3] group-hover:text-[#2EE6D6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
          </div>
          <p className="mt-2 text-sm text-[#98A2B3] leading-relaxed">
            {project.tagline}
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-6 pt-5 border-t border-white/10 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[11px] text-[#F4F1EA]/90 leading-snug">
            {project.metrics}
          </p>
          <Sparkline data={project.sparkline} accent={accent} />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/8 text-[#98A2B3]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
});

export function ProjectsSection() {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>('All');
  const [selected, setSelected] = useState<ProjectItem | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  const visible =
    filter === 'All'
      ? PROFILE.projects
      : PROFILE.projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative pt-24 pb-20 px-5 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        {/* Header + Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#2EE6D6] mb-2">
              02 // COMPUTATIONAL ARTIFACTS &amp; CASE STUDIES
            </div>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#F4F1EA]">
              Selected Systems &amp;{' '}
              <span className="font-serif italic font-normal text-[#2EE6D6]">
                Solvers
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5 p-1.5 rounded-full glass-panel w-fit">
            {CATEGORIES.map((cat) => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? 'text-[#050608]'
                      : 'text-[#98A2B3] hover:text-[#F4F1EA]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="project-filter-pill"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-[#F4F1EA]"
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {visible.map((proj) => (
              <TiltProjectCard
                key={proj.id}
                project={proj}
                onSelect={setSelected}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Case Study Deep-Dive Modal Drawer rendered via Portal above Navbar */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selected && (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={`${selected.title} case study`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelected(null)}
                className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 28, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  onClick={(e) => e.stopPropagation()}
                  className="glass-panel w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl p-6 sm:p-8 space-y-6 border border-white/15"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#2EE6D6]">
                        {selected.category} · {selected.year} · {selected.role}
                      </span>
                      <h3 className="mt-1.5 text-2xl sm:text-3xl font-semibold text-[#F4F1EA]">
                        {selected.title}
                      </h3>
                      <p className="mt-1 font-serif italic text-lg text-[#98A2B3]">
                        {selected.tagline}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      aria-label="Close case study"
                      className="rounded-full p-2 bg-white/5 hover:bg-white/15 text-[#98A2B3] hover:text-[#F4F1EA] transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="rounded-2xl bg-black/45 border border-white/10 p-4 font-mono text-xs text-[#F5B971]">
                    BENCHMARK // {selected.metrics}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#98A2B3]">
                      Overview
                    </h4>
                    <p className="text-sm sm:text-base text-[#F4F1EA]/90 leading-relaxed">
                      {selected.summary}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#2EE6D6]">
                      <Layers className="w-3.5 h-3.5" />
                      Architectural Highlights
                    </h4>
                    <ul className="space-y-2">
                      {selected.architecture.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-sm text-[#98A2B3]"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2EE6D6] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#F5B971]">
                      <Sparkles className="w-3.5 h-3.5" />
                      Scientific &amp; Engineering Impact
                    </h4>
                    <ul className="space-y-2">
                      {selected.outcomes.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-sm text-[#F4F1EA]/85"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#F5B971] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-1.5">
                      {selected.tags.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[10px] px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[#98A2B3]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <a
                        href={selected.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[#F4F1EA] px-4 py-2 text-xs font-semibold text-[#050608] hover:bg-[#2EE6D6] transition-colors"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        Publication / Record
                      </a>
                      {selected.liveUrl && (
                        <a
                          href={selected.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-[#F4F1EA] hover:border-[#2EE6D6]/50 transition-colors"
                        >
                          Paper / Demo
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
