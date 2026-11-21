import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BellRing,
  BookMarked,
  Eye,
  FileText,
  Lock,
  Newspaper,
  Video,
} from 'lucide-react';
import { Lang } from '../data/profile';
import { CmsPost, ContentPlacement } from '../types/cms';
import { formatDateForLang, formatNum } from '../utils/format';

interface LearningHubSectionProps {
  lang: Lang;
  posts: CmsPost[];
  onPreview: (post: CmsPost) => void;
}

export function LearningHubSection({
  lang,
  posts,
  onPreview,
}: LearningHubSectionProps) {
  const [filter, setFilter] = useState<'all' | ContentPlacement>('all');
  const isRtl = lang === 'fa';

  const tabs: { key: 'all' | ContentPlacement; label: string }[] = isRtl
    ? [
        { key: 'all', label: 'همه مطالب' },
        { key: 'alert', label: 'اطلاعیه‌های فوری' },
        { key: 'blog', label: 'وبلاگ و اخبار' },
        { key: 'video', label: 'ویدئوهای آموزشی' },
        { key: 'note', label: 'جزوه‌ها و یادداشت‌ها' },
        { key: 'pdf', label: 'فایل‌های PDF' },
      ]
    : [
        { key: 'all', label: 'All' },
        { key: 'alert', label: 'Alerts' },
        { key: 'blog', label: 'Blog' },
        { key: 'video', label: 'Videos' },
        { key: 'note', label: 'Notes' },
        { key: 'pdf', label: 'Protected PDFs' },
      ];

  const visible = useMemo(() => {
    if (filter === 'all') return posts;
    return posts.filter((p) => p.placement === filter);
  }, [posts, filter]);

  return (
    <section id="academy" className="relative py-16 sm:py-20 px-4 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <div className="text-[11px] tracking-[0.18em] text-[#2EE6D6] mb-2">
            {isRtl
              ? '۰۵ // وبلاگ، اطلاعیه‌ها و مخزن امن آموزشی'
              : '05 // BLOG, ANNOUNCEMENTS & PROTECTED COURSE VAULT'}
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#F4F1EA]">
            {isRtl ? 'یادگیری، وبلاگ و ' : 'Teaching, Blog & '}
            <span
              className={
                isRtl
                  ? 'text-[#2EE6D6] font-bold'
                  : 'font-serif italic font-normal text-[#2EE6D6]'
              }
            >
              {isRtl ? 'منابع درسی' : 'Materials'}
            </span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#98A2B3] max-w-2xl">
            {isRtl
              ? 'تمامی ویدئوها، جزوات و فایل‌های PDF با رعایت کامل کپی‌رایت به صورت فقط‌خواندنی و بدون قابلیت دانلود مستقیم روی سایت پیش‌نمایش داده می‌شوند.'
              : 'All course videos, lecture notes, and slide decks are view-only protected in-browser (no direct download) to preserve academic copyright.'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1.5 rounded-full glass-panel w-fit">
          {tabs.map((tab) => {
            const active = filter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  active ? 'text-[#050608]' : 'text-[#98A2B3] hover:text-[#F4F1EA]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="academy-filter-pill"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-[#F4F1EA]"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {visible.map((post) => {
              const Icon =
                post.placement === 'alert'
                  ? BellRing
                  : post.placement === 'video'
                    ? Video
                    : post.placement === 'pdf'
                      ? FileText
                      : post.placement === 'note'
                        ? BookMarked
                        : Newspaper;

              const accent =
                post.urgent || post.placement === 'alert'
                  ? '#F5B971'
                  : post.placement === 'video'
                    ? '#8B7CFF'
                    : '#2EE6D6';

              return (
                <motion.button
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.32 }}
                  onClick={() => onPreview(post)}
                  data-cursor="PREVIEW"
                  className={`group ${
                    isRtl ? 'text-right' : 'text-left'
                  } glass-panel rounded-3xl p-5 sm:p-6 flex flex-col justify-between border border-white/10 hover:border-white/25 transition-all cursor-pointer`}
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full border"
                        style={{
                          color: accent,
                          borderColor: `${accent}44`,
                          backgroundColor: `${accent}14`,
                        }}
                      >
                        <Icon className="w-3 h-3" />
                        {isRtl ? post.tagFa || post.tagEn : post.tagEn || post.tagFa}
                      </span>
                      <span dir={isRtl ? 'rtl' : 'ltr'} className="font-mono text-[11px] text-[#98A2B3]">
                        {formatDateForLang(post.date, lang)}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-semibold text-[#F4F1EA] group-hover:text-[#2EE6D6] transition-colors leading-snug">
                      {isRtl ? post.titleFa || post.titleEn : post.titleEn || post.titleFa}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#98A2B3] leading-relaxed line-clamp-3">
                      {isRtl
                        ? post.summaryFa || post.summaryEn
                        : post.summaryEn || post.summaryFa}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-2 text-[11px]">
                    <span className="inline-flex items-center gap-1 text-[#98A2B3]">
                      <Lock className="w-3 h-3 text-[#2EE6D6]" />
                      {post.durationOrPages
                        ? formatNum(post.durationOrPages, lang)
                        : isRtl
                          ? 'فقط قابل مشاهده'
                          : 'View-Only'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[#2EE6D6] font-medium">
                      <Eye className="w-3.5 h-3.5" />
                      {isRtl ? 'پیش‌نمایش' : 'Preview'}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {visible.length === 0 && (
          <div className="glass-panel rounded-2xl p-10 text-center text-sm text-[#98A2B3]">
            {isRtl
              ? 'محتوایی در این دسته‌بندی ثبت نشده است.'
              : 'No items published in this category yet.'}
          </div>
        )}
      </div>
    </section>
  );
}
