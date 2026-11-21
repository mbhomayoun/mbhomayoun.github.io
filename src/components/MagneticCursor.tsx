import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function MagneticCursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [isPressed, setIsPressed] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const smoothX = useSpring(mouseX, { damping: 28, stiffness: 380, mass: 0.35 });
  const smoothY = useSpring(mouseY, { damping: 28, stiffness: 380, mass: 0.35 });

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reduced) return;
    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = (e.target as HTMLElement | null)?.closest('[data-cursor]');
      if (target) {
        setLabel(target.getAttribute('data-cursor'));
      } else {
        setLabel(null);
      }
    };

    const onDown = () => setIsPressed(true);
    const onUp = () => setIsPressed(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[90] pointer-events-none hidden lg:flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
        style={{ x: smoothX, y: smoothY }}
      >
        <motion.div
          animate={{
            width: label ? 76 : isPressed ? 24 : 34,
            height: label ? 32 : isPressed ? 24 : 34,
            borderColor: label
              ? 'rgba(46, 230, 214, 0.85)'
              : 'rgba(244, 241, 234, 0.35)',
            backgroundColor: label
              ? 'rgba(46, 230, 214, 0.14)'
              : 'rgba(255, 255, 255, 0.02)',
          }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          className="rounded-full border backdrop-blur-xs flex items-center justify-center"
        >
          {label ? (
            <span className="font-mono text-[9px] font-semibold tracking-[0.18em] text-[#2EE6D6] uppercase">
              {label}
            </span>
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-[#2EE6D6]" />
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
