import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lang, PROFILE_BY_LANG, UI_COPY } from '../data/profile';

interface PreloaderProps {
  onComplete: () => void;
  lang: Lang;
}

export function Preloader({ onComplete, lang }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const profile = PROFILE_BY_LANG[lang];
  const copy = UI_COPY[lang];

  useEffect(() => {
    const start = performance.now();
    const duration = 850;
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setVisible(false);
          onComplete();
        }, 160);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            y: '-100%',
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#050608] p-6 sm:p-10 border-b border-white/10"
        >
          <div className="flex items-center justify-between font-mono text-xs tracking-widest text-[#98A2B3] uppercase">
            <span>{copy.preloaderInit}</span>
            <span dir="ltr">{profile.coordinates}</span>
          </div>

          <div className="mx-auto flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
              className="font-serif text-6xl sm:text-8xl italic text-[#F4F1EA] tracking-tight"
            >
              {profile.monogram}
            </motion.div>
            <p className="mt-3 text-xs sm:text-[13px] tracking-[0.14em] text-[#2EE6D6]">
              {copy.preloaderCaption}
            </p>
          </div>

          <div className="w-full max-w-md mx-auto">
            <div className="flex items-center justify-between font-mono text-xs text-[#98A2B3] mb-2">
              <span>{copy.preloaderConvergence}</span>
              <span dir="ltr" className="text-[#F4F1EA] tabular-nums">
                {String(progress).padStart(3, '0')}%
              </span>
            </div>
            <div className="h-[2px] w-full bg-white/10 overflow-hidden rounded-full">
              <div
                className="h-full bg-gradient-to-r from-[#2EE6D6] via-[#8B7CFF] to-[#F5B971] transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
