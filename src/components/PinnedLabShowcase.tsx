import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Lang, PROFILE_BY_LANG, ResearchPillar, UI_COPY } from '../data/profile';

type SimMode = ResearchPillar['simulationMode'];

function InteractivePhysicsCanvas({
  mode,
  accent,
  liveSimLabel,
  interactHint,
}: {
  mode: SimMode;
  accent: string;
  liveSimLabel: string;
  interactHint: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modeRef = useRef<SimMode>(mode);
  const accentRef = useRef<string>(accent);

  useEffect(() => {
    modeRef.current = mode;
    accentRef.current = accent;
  }, [mode, accent]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    let w = 0;
    let h = 0;
    const pointer = { x: 0.5, y: 0.5, active: false };

    const particles = Array.from({ length: isMobile ? 55 : 120 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      phase: i * 0.23,
    }));

    const nodes = Array.from({ length: isMobile ? 16 : 26 }, (_, i) => ({
      x: 0.15 + ((i * 37) % 70) / 100,
      y: 0.15 + ((i * 53) % 70) / 100,
      vx: (Math.random() - 0.5) * 0.0014,
      vy: (Math.random() - 0.5) * 0.0014,
      r: 2.4 + (i % 4),
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(rect.width, 260);
      h = Math.max(rect.height, 220);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - rect.left) / Math.max(rect.width, 1);
      pointer.y = (e.clientY - rect.top) / Math.max(rect.height, 1);
      pointer.active = true;
    };

    const onLeave = () => {
      pointer.active = false;
    };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);

    let raf = 0;
    const start = performance.now();

    const draw = (now: number) => {
      const t = (now - start) * 0.001;
      const curMode = modeRef.current;
      const curAccent = accentRef.current;

      ctx.fillStyle =
        curMode === 'curl' ? 'rgba(6, 9, 14, 0.15)' : 'rgba(6, 9, 14, 0.35)';
      ctx.fillRect(0, 0, w, h);

      if (curMode === 'curl') {
        for (const p of particles) {
          const angle =
            Math.sin(p.x * 6.2 + t * 0.8) * Math.cos(p.y * 6.2 - t * 0.6) * Math.PI * 2;
          let vx = Math.cos(angle) * 0.0032;
          let vy = Math.sin(angle) * 0.0032;

          if (pointer.active) {
            const dx = pointer.x - p.x;
            const dy = pointer.y - p.y;
            const dist = Math.hypot(dx, dy) + 0.02;
            if (dist < 0.35) {
              vx += (-dy / dist) * 0.0045;
              vy += (dx / dist) * 0.0045;
            }
          }

          const nx = p.x + vx;
          const ny = p.y + vy;

          ctx.strokeStyle = curAccent;
          ctx.globalAlpha = 0.65;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(p.x * w, p.y * h);
          ctx.lineTo(nx * w, ny * h);
          ctx.stroke();

          p.x = (nx + 1) % 1;
          p.y = (ny + 1) % 1;
        }
        ctx.globalAlpha = 1;
      } else if (curMode === 'lattice') {
        const cols = isMobile ? 10 : 14;
        const rows = isMobile ? 7 : 10;
        const pts: { x: number; y: number }[][] = [];
        for (let r = 0; r <= rows; r++) {
          pts[r] = [];
          for (let c = 0; c <= cols; c++) {
            const u = c / cols;
            const v = r / rows;
            let px = (0.08 + u * 0.84) * w;
            let py = (0.1 + v * 0.8) * h;

            const wave = Math.sin(u * 5 + t * 1.6) * Math.cos(v * 5 - t * 1.2) * 10;
            px += wave;
            py += Math.cos(u * 4 - t * 1.4) * 8;

            if (pointer.active) {
              const dx = px - pointer.x * w;
              const dy = py - pointer.y * h;
              const d = Math.hypot(dx, dy);
              if (d < 130 && d > 1) {
                const push = ((130 - d) / 130) * 24;
                px += (dx / d) * push;
                py += (dy / d) * push;
              }
            }
            pts[r][c] = { x: px, y: py };
          }
        }

        ctx.strokeStyle = 'rgba(245, 185, 113, 0.38)';
        ctx.lineWidth = 1;
        for (let r = 0; r <= rows; r++) {
          ctx.beginPath();
          for (let c = 0; c <= cols; c++) {
            const pt = pts[r][c];
            if (c === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();
        }
        for (let c = 0; c <= cols; c++) {
          ctx.beginPath();
          for (let r = 0; r <= rows; r++) {
            const pt = pts[r][c];
            if (r === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();
        }

        ctx.fillStyle = curAccent;
        for (let r = 0; r <= rows; r += 2) {
          for (let c = 0; c <= cols; c += 2) {
            const pt = pts[r][c];
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (curMode === 'wave') {
        const s1 = {
          x: (0.35 + Math.sin(t * 0.7) * 0.08) * w,
          y: (0.5 + Math.cos(t * 0.5) * 0.08) * h,
        };
        const s2 = {
          x: (pointer.active ? pointer.x : 0.66 + Math.cos(t * 0.6) * 0.08) * w,
          y: (pointer.active ? pointer.y : 0.5 + Math.sin(t * 0.8) * 0.08) * h,
        };

        const rings = isMobile ? 9 : 14;
        for (let i = 1; i <= rings; i++) {
          const rad = ((i * 22 + t * 34) % 310) + 6;
          const alpha = Math.max(0, 1 - rad / 315) * 0.55;
          ctx.strokeStyle = `rgba(139, 124, 255, ${alpha})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(s1.x, s1.y, rad, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = `rgba(46, 230, 214, ${alpha * 0.85})`;
          ctx.beginPath();
          ctx.arc(s2.x, s2.y, rad * 0.9, 0, Math.PI * 2);
          ctx.stroke();
        }

        [s1, s2].forEach((s) => {
          ctx.fillStyle = '#F4F1EA';
          ctx.beginPath();
          ctx.arc(s.x, s.y, 3.8, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0.08 || n.x > 0.92) n.vx *= -1;
          if (n.y < 0.1 || n.y > 0.9) n.vy *= -1;

          if (pointer.active) {
            const dx = pointer.x - n.x;
            const dy = pointer.y - n.y;
            const d = Math.hypot(dx, dy);
            if (d < 0.25 && d > 0.01) {
              n.x += dx * 0.015;
              n.y += dy * 0.015;
            }
          }
        }

        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
            if (d < 0.26) {
              const alpha = (1 - d / 0.26) * 0.5;
              ctx.strokeStyle = `rgba(46, 230, 214, ${alpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x * w, nodes[i].y * h);
              ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
              ctx.stroke();
            }
          }
        }

        for (const n of nodes) {
          ctx.fillStyle = '#F4F1EA';
          ctx.beginPath();
          ctx.arc(n.x * w, n.y * h, n.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div className="relative h-full w-full min-h-[220px] sm:min-h-[260px] lg:min-h-[320px] rounded-2xl overflow-hidden border border-white/10 bg-[#06090e]">
      <canvas
        ref={canvasRef}
        data-cursor="INTERACT"
        className="w-full h-full block cursor-crosshair"
      />
      <div className="pointer-events-none absolute top-3 left-3 right-3 flex items-center justify-between gap-2 text-[10px] tracking-wider text-[#98A2B3]">
        <span className="rounded-full bg-black/55 backdrop-blur-md px-2.5 py-1 border border-white/10 font-mono">
          {liveSimLabel} {mode.toUpperCase()}
        </span>
        <span className="hidden sm:inline rounded-full bg-black/55 backdrop-blur-md px-2.5 py-1 border border-white/10 text-[#2EE6D6]">
          {interactHint}
        </span>
      </div>
    </div>
  );
}

export function PinnedLabShowcase({ lang }: { lang: Lang }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const profile = PROFILE_BY_LANG[lang];
  const copy = UI_COPY[lang];
  const isRtl = lang === 'fa';

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;
    const count = profile.pillars.length;
    const idx = Math.min(count - 1, Math.max(0, Math.floor(latest * count * 0.999)));
    setActiveIndex(idx);
  });

  const jumpToPillar = (idx: number) => {
    setActiveIndex(idx);
    if (window.innerWidth < 1024) return;
    const el = sectionRef.current;
    if (!el) return;
    const top = el.offsetTop;
    const scrollable = el.offsetHeight - window.innerHeight;
    const targetY = top + ((idx + 0.18) / profile.pillars.length) * scrollable;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const active = profile.pillars[activeIndex];

  return (
    <section
      id="laboratory"
      ref={sectionRef}
      className="relative h-auto lg:h-[300vh] px-4 sm:px-8 lg:px-12 mt-4 sm:mt-8"
    >
      <div className="relative lg:sticky lg:top-0 lg:h-screen flex flex-col justify-start lg:justify-center pt-16 pb-10 lg:pt-20 lg:pb-6 lg:overflow-hidden">
        <div className="mx-auto w-full max-w-6xl">
          {/* Header & Stepper */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4">
            <div>
              <div className="text-[11px] tracking-[0.16em] uppercase text-[#2EE6D6] mb-1">
                {copy.lab.eyebrow}
              </div>
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#F4F1EA]">
                {copy.lab.headingLead}{' '}
                <span
                  className={
                    isRtl
                      ? 'text-[#F5B971] font-bold'
                      : 'font-serif italic font-normal text-[#F5B971]'
                  }
                >
                  {copy.lab.headingAccent}
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {profile.pillars.map((pillar, i) => {
                const selected = i === activeIndex;
                return (
                  <button
                    key={pillar.id}
                    onClick={() => jumpToPillar(i)}
                    className={`rounded-full px-3.5 py-1 font-mono text-xs transition-all cursor-pointer border ${
                      selected
                        ? 'bg-[#F4F1EA] text-[#050608] border-[#F4F1EA] font-semibold'
                        : 'bg-white/5 text-[#98A2B3] border-white/10 hover:border-white/30 hover:text-[#F4F1EA]'
                    }`}
                  >
                    {pillar.index}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Stage */}
          <div className="glass-panel rounded-3xl p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3 gap-2">
                  <span
                    className="text-xs tracking-wider px-3 py-1 rounded-full border font-medium"
                    style={{
                      color: active.accent,
                      borderColor: `${active.accent}44`,
                      backgroundColor: `${active.accent}14`,
                    }}
                  >
                    {copy.lab.pillarLabel} {active.index} {copy.lab.ofLabel}{' '}
                    {isRtl ? '۰۴' : '04'}
                  </span>
                  <span className="hidden lg:inline text-[11px] text-[#98A2B3]">
                    {copy.lab.scrollMorph}
                  </span>
                </div>

                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-2.5"
                >
                  <h3 className="text-xl sm:text-3xl font-semibold text-[#F4F1EA] leading-snug">
                    {active.title}
                  </h3>
                  <p
                    className={`text-base sm:text-xl text-[#98A2B3] ${
                      isRtl ? '' : 'font-serif italic'
                    }`}
                  >
                    {active.subtitle}
                  </p>
                  <p className="text-sm sm:text-base text-[#98A2B3] leading-relaxed pt-1">
                    {active.description}
                  </p>
                </motion.div>
              </div>

              <div className="space-y-3.5">
                <div
                  dir="ltr"
                  className="rounded-xl bg-black/50 border border-white/10 px-3.5 py-2.5 font-mono text-[11px] sm:text-[13px] text-[#2EE6D6] overflow-x-auto whitespace-nowrap"
                >
                  {active.equation}
                </div>

                <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                  {active.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl bg-white/[0.03] border border-white/8 p-2.5 sm:p-3"
                    >
                      <div className="text-xs sm:text-base font-semibold text-[#F4F1EA]">
                        {m.value}
                      </div>
                      <div className="text-[10px] text-[#98A2B3] mt-0.5">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 flex">
              <InteractivePhysicsCanvas
                mode={active.simulationMode}
                accent={active.accent}
                liveSimLabel={copy.lab.liveSim}
                interactHint={copy.lab.interactHint}
              />
            </div>
          </div>

          <div className="hidden lg:flex mt-4 items-center gap-4">
            <div className="flex-1 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r from-[#2EE6D6] via-[#F5B971] to-[#8B7CFF] ${
                  isRtl ? 'origin-right' : 'origin-left'
                }`}
                style={{ scaleX: scrollYProgress }}
              />
            </div>
            <span className="text-[11px] tracking-wider text-[#98A2B3]">
              {copy.lab.stageLabel} {active.index} {copy.lab.ofLabel}{' '}
              {isRtl ? '۰۴' : '04'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
