import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Compass,
  Copy,
  FlaskConical,
  Search,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react';
import { PROFILE, ShaderMode } from '../data/profile';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  shaderMode: ShaderMode;
  onSetShaderMode: (mode: ShaderMode) => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

interface CommandAction {
  id: string;
  group: string;
  label: string;
  hint: string;
  run: () => void;
}

export function CommandPalette({
  open,
  onClose,
  onNavigate,
  shaderMode,
  onSetShaderMode,
  reducedMotion,
  onToggleReducedMotion,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);

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
    const navActions: CommandAction[] = [
      {
        id: 'nav-hero',
        group: 'Navigate',
        label: 'Observatory Home',
        hint: 'Section 00',
        run: () => onNavigate('hero'),
      },
      {
        id: 'nav-lab',
        group: 'Navigate',
        label: 'Scroll-Driven Research Laboratory',
        hint: 'Section 01',
        run: () => onNavigate('laboratory'),
      },
      {
        id: 'nav-projects',
        group: 'Navigate',
        label: 'Selected Systems & Solvers',
        hint: 'Section 02',
        run: () => onNavigate('projects'),
      },
      {
        id: 'nav-papers',
        group: 'Navigate',
        label: 'Academic Publications & Citations',
        hint: 'Section 03',
        run: () => onNavigate('publications'),
      },
      {
        id: 'nav-chronicle',
        group: 'Navigate',
        label: 'Career & Academic Chronicle',
        hint: 'Section 04',
        run: () => onNavigate('chronicle'),
      },
      {
        id: 'nav-writing',
        group: 'Navigate',
        label: 'Technical Notes & Dispatches',
        hint: 'Section 05',
        run: () => onNavigate('writing'),
      },
      {
        id: 'nav-contact',
        group: 'Navigate',
        label: 'Contact & Collaborations',
        hint: 'Section 06',
        run: () => onNavigate('contact'),
      },
    ];

    const shaderActions: CommandAction[] = [
      {
        id: 'shader-interference',
        group: 'Visual Field',
        label: 'Shader Mode: Topographic Interference',
        hint: shaderMode === 'interference' ? 'Active' : 'Switch',
        run: () => onSetShaderMode('interference'),
      },
      {
        id: 'shader-lattice',
        group: 'Visual Field',
        label: 'Shader Mode: Quantum Harmonic Lattice',
        hint: shaderMode === 'lattice' ? 'Active' : 'Switch',
        run: () => onSetShaderMode('lattice'),
      },
      {
        id: 'shader-aurora',
        group: 'Visual Field',
        label: 'Shader Mode: Bioluminescent Aurora',
        hint: shaderMode === 'aurora' ? 'Active' : 'Switch',
        run: () => onSetShaderMode('aurora'),
      },
      {
        id: 'toggle-motion',
        group: 'Visual Field',
        label: reducedMotion
          ? 'Enable Full Shader & Scroll Motion'
          : 'Enable Low-Motion Accessibility Mode',
        hint: reducedMotion ? 'Reduced' : 'Full',
        run: () => onToggleReducedMotion(),
      },
    ];

    const utilityActions: CommandAction[] = [
      {
        id: 'copy-email',
        group: 'Quick Utilities',
        label: `Copy Email (${PROFILE.email})`,
        hint: 'Clipboard',
        run: () => {
          navigator.clipboard.writeText(PROFILE.email);
          setToast('Email copied to clipboard');
          setTimeout(() => setToast(null), 1600);
        },
      },
      ...PROFILE.projects.map((p) => ({
        id: `proj-${p.id}`,
        group: 'Jump to Project',
        label: `${p.title} — ${p.category}`,
        hint: p.year,
        run: () => onNavigate('projects'),
      })),
      ...PROFILE.publications.map((pub) => ({
        id: `pub-${pub.id}`,
        group: 'Copy Citation',
        label: `BibTeX: ${pub.title}`,
        hint: `${pub.year}`,
        run: () => {
          navigator.clipboard.writeText(pub.bibtex);
          setToast('BibTeX citation copied');
          setTimeout(() => setToast(null), 1600);
        },
      })),
    ];

    return [...navActions, ...shaderActions, ...utilityActions];
  }, [onNavigate, onSetShaderMode, onToggleReducedMotion, reducedMotion, shaderMode]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions.slice(0, 12);
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(q) || a.group.toLowerCase().includes(q)
    );
  }, [actions, query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[95] bg-black/75 backdrop-blur-md flex items-start justify-center pt-[12vh] px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel w-full max-w-xl rounded-2xl overflow-hidden border border-white/15 shadow-2xl"
          >
            {/* Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
              <Search className="w-4 h-4 text-[#2EE6D6] shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to section, switch WebGL shader, or copy BibTeX..."
                className="w-full bg-transparent text-sm text-[#F4F1EA] placeholder:text-[#98A2B3]/70 focus:outline-none"
              />
              <button
                onClick={onClose}
                className="rounded-md p-1 hover:bg-white/10 text-[#98A2B3] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {toast && (
              <div className="px-4 py-2 bg-[#2EE6D6]/15 text-[#2EE6D6] font-mono text-xs border-b border-[#2EE6D6]/25">
                ✓ {toast}
              </div>
            )}

            {/* Action List */}
            <div className="max-h-[54vh] overflow-y-auto p-2 space-y-1">
              {filtered.map((item) => {
                const Icon =
                  item.group === 'Navigate'
                    ? Compass
                    : item.group === 'Visual Field'
                      ? Sparkles
                      : item.group === 'Copy Citation'
                        ? BookOpen
                        : item.group === 'Jump to Project'
                          ? FlaskConical
                          : item.id === 'copy-email'
                            ? Copy
                            : Terminal;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      item.run();
                      if (!item.id.startsWith('copy-') && !item.id.startsWith('pub-')) {
                        onClose();
                      }
                    }}
                    className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-white/[0.07] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className="w-4 h-4 text-[#98A2B3] group-hover:text-[#2EE6D6] shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm text-[#F4F1EA] truncate">
                          {item.label}
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-[#98A2B3]">
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
                <div className="py-8 text-center text-xs font-mono text-[#98A2B3]">
                  No matching commands.
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
