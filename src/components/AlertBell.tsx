import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCheck, ExternalLink, ShieldAlert } from 'lucide-react';
import { Lang } from '../data/profile';
import { CmsPost } from '../types/cms';
import { formatDateForLang, formatNum } from '../utils/format';

interface AlertBellProps {
  lang: Lang;
  alerts: CmsPost[];
  dismissedIds: string[];
  onDismissAll: () => void;
  onOpenAlert: (post: CmsPost) => void;
  onNavigateAcademy: () => void;
}

export function AlertBell({
  lang,
  alerts,
  dismissedIds,
  onDismissAll,
  onOpenAlert,
  onNavigateAcademy,
}: AlertBellProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const isRtl = lang === 'fa';

  const unreadCount = alerts.filter((a) => !dismissedIds.includes(a.id)).length;

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative pointer-events-auto">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={isRtl ? 'اعلان‌ها و اطلاعیه‌های فوری' : 'Urgent Announcements'}
        data-cursor="ALERTS"
        className="relative glass-panel rounded-full p-2 sm:p-2.5 flex items-center justify-center text-[#F4F1EA] hover:text-[#F5B971] hover:border-[#F5B971]/45 transition-colors cursor-pointer"
      >
        <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -end-1 min-w-[16px] h-4 px-1 rounded-full bg-[#F5B971] text-[#050608] font-mono text-[10px] font-bold flex items-center justify-center shadow-[0_0_12px_rgba(245,185,113,0.85)]">
            {formatNum(unreadCount, lang)}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full mt-2.5 w-[min(90vw,360px)] glass-panel rounded-2xl border border-white/15 shadow-2xl overflow-hidden z-[90] ${
              isRtl ? 'left-0' : 'right-0'
            }`}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F4F1EA]">
                <ShieldAlert className="w-4 h-4 text-[#F5B971]" />
                <span>
                  {isRtl ? 'اطلاعیه‌های فوری و کلاس‌ها' : 'Urgent Notices & Alerts'}
                </span>
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={onDismissAll}
                  className="inline-flex items-center gap-1 text-[11px] text-[#2EE6D6] hover:underline cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'خوانده شد' : 'Mark read'}</span>
                </button>
              )}
            </div>

            <div
              data-lenis-prevent
              className="max-h-72 overflow-y-auto overscroll-contain divide-y divide-white/8"
            >
              {alerts.length === 0 ? (
                <div className="p-5 text-center text-xs text-[#98A2B3]">
                  {isRtl
                    ? 'در حال حاضر اطلاعیه فوری فعالی ثبت نشده است.'
                    : 'No urgent announcements at this moment.'}
                </div>
              ) : (
                alerts.map((alert) => {
                  const unread = !dismissedIds.includes(alert.id);
                  return (
                    <button
                      key={alert.id}
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        onOpenAlert(alert);
                      }}
                      className={`w-full p-4 ${
                        isRtl ? 'text-right' : 'text-left'
                      } hover:bg-white/[0.05] transition-colors cursor-pointer space-y-1.5`}
                    >
                      <div className="flex items-center justify-between gap-2 text-[10px]">
                        <span className="inline-flex items-center gap-1.5 text-[#F5B971] font-medium">
                          {unread && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#F5B971]" />
                          )}
                          {isRtl ? alert.tagFa : alert.tagEn}
                        </span>
                        <span dir={isRtl ? 'rtl' : 'ltr'} className="font-mono text-[#98A2B3]">
                          {formatDateForLang(alert.date, lang)}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-[#F4F1EA]">
                        {isRtl ? alert.titleFa || alert.titleEn : alert.titleEn || alert.titleFa}
                      </div>
                      <p className="text-xs text-[#98A2B3] line-clamp-2">
                        {isRtl
                          ? alert.summaryFa || alert.summaryEn
                          : alert.summaryEn || alert.summaryFa}
                      </p>
                    </button>
                  );
                })
              )}
            </div>

            <div className="px-4 py-2.5 border-t border-white/10 bg-black/30">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onNavigateAcademy();
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-[#2EE6D6] hover:underline cursor-pointer"
              >
                <span>
                  {isRtl
                    ? 'مشاهده همه اطلاعیه‌ها و منابع آموزشی'
                    : 'View all announcements & materials'}
                </span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
