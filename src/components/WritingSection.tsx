import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { ArrowUpRight, BookOpenText, Clock, X } from 'lucide-react';
import { Lang, PROFILE_BY_LANG, UI_COPY, WritingItem } from '../data/profile';

function ArticleReaderDrawer({
  article,
  onClose,
  isRtl,
  closeAria,
}: {
  article: WritingItem;
  onClose: () => void;
  isRtl: boolean;
  closeAria: string;
}) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ container: scrollContainerRef });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={article.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className={`fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex ${
        isRtl ? 'justify-start' : 'justify-end'
      }`}
    >
      <motion.div
        initial={{ x: isRtl ? '-100%' : '100%' }}
        animate={{ x: 0 }}
        exit={{ x: isRtl ? '-100%' : '100%' }}
        transition={{ type: 'spring', stiffness: 310, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-2xl h-full bg-[#090C12] flex flex-col ${
          isRtl ? 'border-e border-white/12' : 'border-s border-white/12'
        }`}
      >
        <div className="h-[3px] w-full bg-white/8 shrink-0">
          <motion.div
            className={`h-full bg-gradient-to-r from-[#2EE6D6] to-[#F5B971] ${
              isRtl ? 'origin-right' : 'origin-left'
            }`}
            style={{ scaleX: scrollYProgress }}
          />
        </div>

        <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 text-[11px] tracking-wider text-[#2EE6D6]">
            <BookOpenText className="w-4 h-4 shrink-0" />
            <span>{article.category}</span>
            <span className="text-[#98A2B3]">· {article.readTime}</span>
          </div>
          <button
            onClick={onClose}
            aria-label={closeAria}
            className="rounded-full p-2 bg-white/5 hover:bg-white/15 text-[#98A2B3] hover:text-[#F4F1EA] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          ref={scrollContainerRef}
          data-lenis-prevent
          className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-10 py-7 sm:py-8 space-y-6"
        >
          <div className="space-y-3">
            <span className="font-mono text-xs text-[#98A2B3]">{article.date}</span>
            <h3 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#F4F1EA] leading-snug">
              {article.title}
            </h3>
            <p
              className={`text-lg sm:text-xl text-[#98A2B3] ${
                isRtl ? '' : 'font-serif italic'
              }`}
            >
              {article.subtitle}
            </p>
          </div>

          {article.equationCallout && (
            <div
              dir="ltr"
              className="rounded-2xl bg-black/60 border border-[#2EE6D6]/30 p-4 font-mono text-xs sm:text-sm text-[#2EE6D6] overflow-x-auto"
            >
              {article.equationCallout}
            </div>
          )}

          <div className="space-y-6 pt-2">
            {article.sections.map((sec) => (
              <div key={sec.heading} className="space-y-2">
                <h4 className="text-lg font-semibold text-[#F4F1EA]">
                  {sec.heading}
                </h4>
                <p className="text-sm sm:text-base text-[#98A2B3] leading-relaxed">
                  {sec.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function WritingSection({ lang }: { lang: Lang }) {
  const [activeArticle, setActiveArticle] = useState<WritingItem | null>(null);
  const profile = PROFILE_BY_LANG[lang];
  const copy = UI_COPY[lang];
  const isRtl = lang === 'fa';

  useEffect(() => {
    setActiveArticle(null);
  }, [lang]);

  return (
    <section id="writing" className="relative py-16 sm:py-20 px-4 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <div className="text-[11px] tracking-[0.18em] text-[#2EE6D6] mb-2">
              {copy.writing.eyebrow}
            </div>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#F4F1EA]">
              {copy.writing.headingLead}{' '}
              <span
                className={
                  isRtl
                    ? 'text-[#2EE6D6] font-bold'
                    : 'font-serif italic font-normal text-[#2EE6D6]'
                }
              >
                {copy.writing.headingAccent}
              </span>
            </h2>
          </div>
          <p className="text-sm text-[#98A2B3] max-w-sm">
            {copy.writing.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {profile.writings.map((item, idx) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              onClick={() => setActiveArticle(item)}
              data-cursor="READ"
              className={`group ${
                isRtl ? 'text-right' : 'text-left'
              } glass-panel rounded-3xl p-5 sm:p-7 flex flex-col justify-between border border-white/10 hover:border-[#2EE6D6]/45 transition-all cursor-pointer`}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-[10px] tracking-wider text-[#98A2B3]">
                  <span className="text-[#2EE6D6] font-medium">{item.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.readTime}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-semibold text-[#F4F1EA] group-hover:text-[#2EE6D6] transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#98A2B3] leading-relaxed">
                  {item.excerpt}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#F4F1EA]">
                <span className="font-mono">{item.date}</span>
                <span className="inline-flex items-center gap-1 text-[#2EE6D6] group-hover:translate-x-0.5 transition-transform">
                  {copy.writing.readNote} <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {activeArticle && (
              <ArticleReaderDrawer
                article={activeArticle}
                onClose={() => setActiveArticle(null)}
                isRtl={isRtl}
                closeAria={copy.writing.closeAria}
              />
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
