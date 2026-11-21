import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Compass,
  Copy,
  FlaskConical,
  Globe,
  Search,
  Settings2,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react';
import { Lang, PROFILE_BY_LANG, UI_COPY } from '../data/profile';

interface CommandPaletteProps {
  lang: Lang;
  onToggleLang: () => void;
  open: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

interface CommandAction {
  id: string;
  group: string;
  kind: 'nav' | 'lang' | 'motion' | 'copy' | 'proj' | 'pub' | 'admin';
  label: string;
  hint: string;
  run: () => void;
}

export function CommandPalette({
  lang,
  onToggleLang,
  open,
  onClose,
  onNavigate,
  onOpenAdmin,
  reducedMotion,
  onToggleReducedMotion,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const profile = PROFILE_BY_LANG[lang];
  const copy = UI_COPY[lang];

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) onClose();
      } else if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const actions = useMemo<CommandAction[]>(() => {
    const navActions: CommandAction[] = copy.command.navLabels.map((n) => ({
      id: `nav-${n.id}`,
      group: copy.command.groups.navigate,
      kind: 'nav',
      label: n.label,
      hint: n.hint,
      run: () => onNavigate(n.id),
    }));

    const utilityActions: CommandAction[] = [
      {
        id: 'open-admin',
        group: copy.command.groups.utilities,
        kind: 'admin',
        label:
          lang === 'fa'
            ? 'پنل مدیریت، آپلود و دستیار هوش مصنوعی'
            : 'Open Admin Studio, Uploads & AI Translator',
        hint: 'Admin',
        run: () => onOpenAdmin(),
      },
      {
        id: 'switch-lang',
        group: copy.command.groups.utilities,
        kind: 'lang',
        label: copy.langSwitchLabel,
        hint: copy.langSwitchShort,
        run: () => onToggleLang(),
      },
      {
        id: 'toggle-motion',
        group: copy.command.groups.visual,
        kind: 'motion',
        label: reducedMotion
          ? copy.command.motionEnableFull
          : copy.command.motionEnableLow,
        hint: reducedMotion ? copy.command.motionActive : copy.command.motionFull,
        run: () => onToggleReducedMotion(),
      },
      {
        id: 'copy-email',
        group: copy.command.groups.utilities,
        kind: 'copy',
        label: `${copy.command.copyEmailPrefix} (${profile.email})`,
        hint: copy.contact.copy,
        run: () => {
          navigator.clipboard.writeText(profile.email);
          setToast(copy.command.copiedEmail);
          setTimeout(() => setToast(null), 1600);
        },
      },
      ...profile.projects.map((p) => ({
        id: `proj-${p.id}`,
        group: copy.command.groups.projects,
        kind: 'proj' as const,
        label: `${p.title} — ${p.categoryLabel}`,
        hint: p.year,
        run: () => onNavigate('projects'),
      })),
      ...profile.publications.map((pub) => ({
        id: `pub-${pub.id}`,
        group: copy.command.groups.citations,
        kind: 'pub' as const,
        label: `${copy.command.bibtexPrefix} ${pub.title}`,
        hint: `${pub.year}`,
        run: () => {
          navigator.clipboard.writeText(pub.bibtex);
          setToast(copy.command.copiedBibtex);
          setTimeout(() => setToast(null), 1600);
        },
      })),
    ];

    return [...navActions, ...utilityActions];
  }, [
    copy,
    lang,
    onNavigate,
    onOpenAdmin,
    onToggleLang,
    onToggleReducedMotion,
    profile,
    reducedMotion,
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions.slice(0, 14);
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(q) || a.group.toLowerCase().includes(q)
    );
  }, [actions, query]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={copy.indexLabel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-md flex items-start justify-center pt-[10vh] px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel w-full max-w-xl rounded-2xl overflow-hidden border border-white/15 shadow-2xl"
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
              <Search className="w-4 h-4 text-[#2EE6D6] shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={copy.command.placeholder}
                className="w-full bg-transparent text-sm text-[#F4F1EA] placeholder:text-[#98A2B3]/70 focus:outline-none"
              />
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="rounded-md p-1 hover:bg-white/10 text-[#98A2B3] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {toast && (
              <div className="px-4 py-2 bg-[#2EE6D6]/15 text-[#2EE6D6] text-xs border-b border-[#2EE6D6]/25">
                ✓ {toast}
              </div>
            )}

            {/* data-lenis-prevent + overscroll-contain stops wheel scrolling from leaking to webpage behind */}
            <div
              data-lenis-prevent
              className="max-h-[58vh] overflow-y-auto overscroll-contain p-2 space-y-1"
            >
              {filtered.map((item) => {
                const Icon =
                  item.kind === 'nav'
                    ? Compass
                    : item.kind === 'admin'
                      ? Settings2
                      : item.kind === 'lang'
                        ? Globe
                        : item.kind === 'motion'
                          ? Sparkles
                          : item.kind === 'pub'
                            ? BookOpen
                            : item.kind === 'proj'
                              ? FlaskConical
                              : item.kind === 'copy'
                                ? Copy
                                : Terminal;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      item.run();
                      if (item.kind !== 'copy' && item.kind !== 'pub') {
                        onClose();
                      }
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl ${
                      lang === 'fa' ? 'text-right' : 'text-left'
                    } hover:bg-white/[0.07] transition-colors cursor-pointer group`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className="w-4 h-4 text-[#98A2B3] group-hover:text-[#2EE6D6] shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm text-[#F4F1EA] truncate">
                          {item.label}
                        </div>
                        <div className="text-[10px] tracking-wider text-[#98A2B3]">
                          {item.group}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/8 text-[#98A2B3] shrink-0">
                      {item.hint}
                    </span>
                  </button>
                );
              })}

              {filtered.length === 0 && (
                <div className="py-8 text-center text-xs text-[#98A2B3]">
                  {copy.command.empty}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
