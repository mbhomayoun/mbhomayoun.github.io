import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Quote,
  Search,
} from 'lucide-react';
import { PROFILE, PublicationItem } from '../data/profile';

const PUB_TYPES = ['All', 'Journal', 'Preprint', 'Book'] as const;

export function PublicationsSection() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<(typeof PUB_TYPES)[number]>('All');
  const [topicFilter, setTopicFilter] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(
    PROFILE.publications[0]?.id ?? null
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const allTopics = useMemo(() => {
    const map = new Map<string, number>();
    PROFILE.publications.forEach((p) =>
      p.topics.forEach((t) => map.set(t, (map.get(t) ?? 0) + 1))
    );
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, []);

  const filtered = useMemo(() => {
    return PROFILE.publications.filter((p) => {
      if (typeFilter !== 'All' && p.type !== typeFilter) return false;
      if (topicFilter && !p.topics.includes(topicFilter)) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.authors.toLowerCase().includes(q) ||
          p.venue.toLowerCase().includes(q) ||
          p.topics.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [query, typeFilter, topicFilter]);

  const uniqueVenues = useMemo(
    () => new Set(PROFILE.publications.map((p) => p.venue)).size,
    []
  );

  const copyBibtex = (pub: PublicationItem) => {
    navigator.clipboard.writeText(pub.bibtex);
    setCopiedId(pub.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <section id="publications" className="relative py-20 px-5 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#F5B971] mb-2">
              03 // ACADEMIC ARCHIVE &amp; CITATION MATRIX
            </div>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#F4F1EA]">
              Publications &amp;{' '}
              <span className="font-serif italic font-normal text-[#F5B971]">
                Monographs
              </span>
            </h2>
          </div>

          <div className="glass-panel rounded-2xl px-5 py-3.5 flex items-center gap-6 w-fit">
            <div>
              <div className="font-serif italic text-2xl text-[#F4F1EA]">
                {PROFILE.publications.length}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#98A2B3]">
                Featured Works
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <div className="font-serif italic text-2xl text-[#2EE6D6]">
                {uniqueVenues}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#98A2B3]">
                Journals &amp; Press
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Topic Constellation & Search Controls */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#98A2B3] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, co-author, venue, or method..."
                className="w-full rounded-full bg-black/45 border border-white/10 pl-10 pr-4 py-2 text-sm text-[#F4F1EA] placeholder:text-[#98A2B3]/60 focus:outline-none focus:border-[#2EE6D6]/60"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {PUB_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`rounded-full px-3.5 py-1.5 font-mono text-xs transition-colors cursor-pointer border ${
                    typeFilter === t
                      ? 'bg-[#F5B971] text-[#050608] border-[#F5B971] font-semibold'
                      : 'bg-white/[0.04] text-[#98A2B3] border-white/10 hover:text-[#F4F1EA]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Research Topic Constellation Pills */}
          <div className="pt-3 border-t border-white/8 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#98A2B3] mr-1">
              TOPIC NODES:
            </span>
            <button
              onClick={() => setTopicFilter(null)}
              className={`rounded-full px-3 py-1 font-mono text-[11px] transition-all cursor-pointer border ${
                topicFilter === null
                  ? 'border-[#2EE6D6] bg-[#2EE6D6]/15 text-[#2EE6D6]'
                  : 'border-white/10 text-[#98A2B3] hover:text-[#F4F1EA]'
              }`}
            >
              All Clusters
            </button>
            {allTopics.map((topic) => {
              const active = topicFilter === topic.name;
              return (
                <button
                  key={topic.name}
                  onClick={() => setTopicFilter(active ? null : topic.name)}
                  className={`rounded-full px-3 py-1 font-mono text-[11px] transition-all cursor-pointer border flex items-center gap-1.5 ${
                    active
                      ? 'border-[#2EE6D6] bg-[#2EE6D6]/15 text-[#2EE6D6]'
                      : 'border-white/10 bg-white/[0.02] text-[#98A2B3] hover:border-white/25 hover:text-[#F4F1EA]'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      active ? 'bg-[#2EE6D6]' : 'bg-[#8B7CFF]'
                    }`}
                  />
                  {topic.name}
                  <span className="opacity-60">({topic.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Publication List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((pub) => {
              const isOpen = expandedId === pub.id;
              const isCopied = copiedId === pub.id;

              return (
                <motion.article
                  key={pub.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.05 }}
                  exit={{ opacity: 0 }}
                  className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px]">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#F5B971]/12 text-[#F5B971] border border-[#F5B971]/30">
                          {pub.year} · {pub.type}
                        </span>
                        <span className="text-[#2EE6D6]">{pub.venue}</span>
                        {pub.citations > 0 ? (
                          <span className="text-[#98A2B3]">
                            · {pub.citations} citations
                          </span>
                        ) : (
                          <span className="text-[#98A2B3]">· {pub.doi}</span>
                        )}
                      </div>

                      <h3
                        onClick={() => setExpandedId(isOpen ? null : pub.id)}
                        className="text-lg sm:text-xl font-semibold text-[#F4F1EA] hover:text-[#2EE6D6] transition-colors cursor-pointer leading-snug"
                      >
                        {pub.title}
                      </h3>

                      <p className="text-sm text-[#98A2B3]">{pub.authors}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => copyBibtex(pub)}
                        data-cursor="BIBTEX"
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/5 hover:bg-white/12 border border-white/10 px-3.5 py-1.5 font-mono text-[11px] text-[#F4F1EA] transition-colors cursor-pointer"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#2EE6D6]" />
                            <span className="text-[#2EE6D6]">Copied BibTeX</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#98A2B3]" />
                            <span>BibTeX</span>
                          </>
                        )}
                      </button>

                      <a
                        href={pub.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/5 hover:bg-[#2EE6D6]/15 border border-white/10 hover:border-[#2EE6D6]/40 px-3.5 py-1.5 font-mono text-[11px] text-[#F4F1EA] transition-colors"
                      >
                        <span>PDF</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        onClick={() => setExpandedId(isOpen ? null : pub.id)}
                        aria-label="Toggle abstract"
                        className="rounded-full p-2 bg-white/5 hover:bg-white/10 text-[#98A2B3] hover:text-[#F4F1EA] transition-colors cursor-pointer"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Abstract & Key Finding */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 pt-5 border-t border-white/10 space-y-4">
                          <div className="rounded-xl bg-[#2EE6D6]/[0.07] border border-[#2EE6D6]/25 p-4 flex items-start gap-3">
                            <Quote className="w-4 h-4 text-[#2EE6D6] shrink-0 mt-0.5" />
                            <p className="text-sm text-[#F4F1EA] leading-relaxed">
                              <span className="font-mono text-[11px] uppercase tracking-wider text-[#2EE6D6] mr-2">
                                Key Finding:
                              </span>
                              {pub.keyFinding}
                            </p>
                          </div>

                          <p className="text-sm text-[#98A2B3] leading-relaxed">
                            {pub.abstract}
                          </p>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                            <div className="flex flex-wrap gap-1.5">
                              {pub.topics.map((t) => (
                                <span
                                  key={t}
                                  className="font-mono text-[10px] px-2.5 py-1 rounded bg-white/[0.04] border border-white/8 text-[#98A2B3]"
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                            <span className="font-mono text-[11px] text-[#98A2B3]">
                              DOI: {pub.doi}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="glass-panel rounded-2xl p-10 text-center text-sm text-[#98A2B3]">
              No publications match your current filter. Try clearing the search or topic node.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
