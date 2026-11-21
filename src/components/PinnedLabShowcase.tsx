import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { PROFILE, ResearchPillar } from '../data/profile';

type SimMode = ResearchPillar['simulationMode'];

function InteractivePhysicsCanvas({
  mode,
  accent,
}: {
  mode: SimMode;
  accent: string;
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

    let w = 0;
    let h = 0;
    const pointer = { x: 0.5, y: 0.5, active: false };

    const particles = Array.from({ length: 130 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      vx: 0,
      vy: 0,
      phase: i * 0.23,
    }));

    const nodes = Array.from({ length: 28 }, (_, i) => ({
      x: 0.15 + ((i * 37) % 70) / 100,
      y: 0.15 + ((i * 53) % 70) / 100,
      vx: (Math.random() - 0.5) * 0.0014,
      vy: (Math.random() - 0.5) * 0.0014,
      r: 2.5 + (i % 4),
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(rect.width, 280);
      h = Math.max(rect.height, 260);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: PointerEvent) => {
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

      // Subtle motion trail clear
      ctx.fillStyle = curMode === 'curl' ? 'rgba(6, 9, 14, 0.14)' : 'rgba(6, 9, 14, 0.35)';
      ctx.fillRect(0, 0, w, h);

      if (curMode === 'curl') {
        // Turbulent PDE Streamline Field
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
        // Deforming Multiscale Lattice-Boltzmann Mesh
        const cols = 14;
        const rows = 10;
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
                const push = ((130 - d) / 130) * 26;
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
            ctx.arc(pt.x, pt.y, 2.1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (curMode === 'wave') {
        // Acoustic / Bayesian Interference Harmonics
        const s1 = {
          x: (0.35 + Math.sin(t * 0.7) * 0.08) * w,
          y: (0.5 + Math.cos(t * 0.5) * 0.08) * h,
        };
        const s2 = {
          x: (pointer.active ? pointer.x : 0.66 + Math.cos(t * 0.6) * 0.08) * w,
          y: (pointer.active ? pointer.y : 0.5 + Math.sin(t * 0.8) * 0.08) * h,
        };

        for (let i = 1; i <= 14; i++) {
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

        // Sensor focal markers
        [s1, s2].forEach((s) => {
          ctx.fillStyle = '#F4F1EA';
          ctx.beginPath();
          ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        // Coupled Scientific Network Graph
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
    <div className="relative h-full w-full min-h-[240px] lg:min-h-[320px] rounded-2xl overflow-hidden border border-white/10 bg-[#06090e]">
      <canvas
        ref={canvasRef}
        data-cursor="INTERACT"
        className="w-full h-full block cursor-crosshair"
      />
      <div className="pointer-events-none absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between font-mono text-[10px] tracking-[0.18em] uppercase text-[#98A2B3]">
        <span className="rounded-full bg-black/50 backdrop-blur-md px-2.5 py-1 border border-white/10">
          LIVE SIMULATION // {mode.toUpperCase()}
        </span>
        <span className="rounded-full bg-black/50 backdrop-blur-md px-2.5 py-1 border border-white/10 text-[#2EE6D6]">
          MOVE POINTER TO PERTURB
        </span>
      </div>
    </div>
  );
}

export function PinnedLabShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;
    const count = PROFILE.pillars.length;
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
    const targetY = top + ((idx + 0.18) / PROFILE.pillars.length) * scrollable;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const active = PROFILE.pillars[activeIndex];

  return (
    <section
      id="laboratory"
      ref={sectionRef}
      className="relative h-auto lg:h-[300vh] px-5 sm:px-8 lg:px-12 mt-8"
    >
      <div className="relative lg:sticky lg:top-0 lg:h-screen flex flex-col justify-start lg:justify-center pt-24 pb-10 lg:pt-22 lg:pb-6 lg:overflow-hidden">
        <div className="mx-auto w-full max-w-6xl">
          {/* Header & Pillar Stepper */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#2EE6D6] mb-1">
                01 // SCROLL-DRIVEN RESEARCH LABORATORY
              </div>
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#F4F1EA]">
                Four Pillars of{' '}
                <span className="font-serif italic font-normal text-[#F5B971]">
                  Inquiry
                </span>
              </h2>
            </div>

            {/* Interactive Stepper Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {PROFILE.pillars.map((pillar, i) => {
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

          {/* Main 3D Stage */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-stretch">
            {/* Left Narrative Panel */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="font-mono text-xs tracking-[0.22em] uppercase px-3 py-1 rounded-full border"
                    style={{
                      color: active.accent,
                      borderColor: `${active.accent}44`,
                      backgroundColor: `${active.accent}14`,
                    }}
                  >
                    PILLAR {active.index} / 0{PROFILE.pillars.length}
                  </span>
                  <span className="font-mono text-[11px] text-[#98A2B3]">
                    SCROLL TO MORPH ↓
                  </span>
                </div>

                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-3"
                >
                  <h3 className="text-2xl sm:text-3xl font-semibold text-[#F4F1EA] leading-tight">
                    {active.title}
                  </h3>
                  <p className="font-serif italic text-lg sm:text-xl text-[#98A2B3]">
                    {active.subtitle}
                  </p>
                  <p className="text-sm sm:text-base text-[#98A2B3] leading-relaxed pt-1">
                    {active.description}
                  </p>
                </motion.div>
              </div>

              <div className="space-y-4">
                {/* Equation Callout */}
                <div className="rounded-xl bg-black/50 border border-white/10 px-4 py-3 font-mono text-xs sm:text-[13px] text-[#2EE6D6] overflow-x-auto whitespace-nowrap">
                  {active.equation}
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-3">
                  {active.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl bg-white/[0.03] border border-white/8 p-3"
                    >
                      <div className="text-base sm:text-lg font-semibold text-[#F4F1EA] tabular-nums">
                        {m.value}
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-[#98A2B3] mt-0.5">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Interactive Simulation Canvas */}
            <div className="lg:col-span-6 flex">
              <InteractivePhysicsCanvas
                mode={active.simulationMode}
                accent={active.accent}
              />
            </div>
          </div>

          {/* Scroll Progress Rail */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#2EE6D6] via-[#F5B971] to-[#8B7CFF]"
                style={{ scaleX: scrollYProgress, transformOrigin: '0% 50%' }}
              />
            </div>
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#98A2B3] uppercase">
              Stage {active.index} of 0{PROFILE.pillars.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
