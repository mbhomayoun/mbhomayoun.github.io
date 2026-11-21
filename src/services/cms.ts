import { CmsPayload, LinkedInTimelineEntry, SyncedPublication } from '../types/cms';
import { PublicationItem, TimelineItem } from '../data/profile';

const LOCAL_CMS_KEY = 'observatory-cms-local-v1';
const LOCAL_DISMISSED_ALERTS_KEY = 'observatory-dismissed-alerts';

function getRawCmsUrls(): string[] {
  const urls: string[] = [];
  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    if (host.endsWith('.github.io')) {
      const owner = host.replace(/\.github\.io$/, '');
      if (owner) {
        urls.push(
          `https://raw.githubusercontent.com/${owner}/${owner}.github.io/main/public/data/cms-content.json`
        );
      }
    }
  }
  const defaults = [
    'https://raw.githubusercontent.com/mbhomayoun/mbhomayoun.github.io/main/public/data/cms-content.json',
    'https://raw.githubusercontent.com/homayounmb/homayounmb.github.io/main/public/data/cms-content.json',
  ];
  for (const u of defaults) {
    if (!urls.includes(u)) urls.push(u);
  }
  return urls;
}

export const DEFAULT_CMS: CmsPayload = {
  version: 1,
  lastSyncedAt: new Date().toISOString(),
  openAlexAuthorId: 'A5120058838',
  scholarAuthorId: '',
  posts: [],
  syncedPublications: [],
  timelineOverrides: [],
};

export function loadLocalCmsOverride(): CmsPayload | null {
  try {
    const raw = window.localStorage.getItem(LOCAL_CMS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CmsPayload;
  } catch {
    return null;
  }
}

export function saveLocalCmsOverride(payload: CmsPayload): void {
  try {
    window.localStorage.setItem(LOCAL_CMS_KEY, JSON.stringify(payload));
  } catch {
    // Ignore quota overflow for large binary previews
  }
}

export function clearLocalCmsOverride(): void {
  window.localStorage.removeItem(LOCAL_CMS_KEY);
}

export async function fetchInitialCms(): Promise<CmsPayload> {
  const local = loadLocalCmsOverride();

  let base: CmsPayload = DEFAULT_CMS;
  try {
    const res = await fetch(`./data/cms-content.json?t=${Date.now()}`);
    if (res.ok) {
      base = (await res.json()) as CmsPayload;
    }
  } catch {
    // Fall back to default
  }

  // Also check live GitHub raw file when running online so newly committed posts show immediately
  try {
    if (
      typeof window !== 'undefined' &&
      !window.location.hostname.includes('localhost') &&
      !window.location.hostname.includes('127.0.0.1')
    ) {
      for (const rawUrl of getRawCmsUrls()) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 2400);
        try {
          const rawRes = await fetch(`${rawUrl}?t=${Date.now()}`, {
            signal: controller.signal,
          });
          clearTimeout(timer);
          if (rawRes.ok) {
            const remote = (await rawRes.json()) as CmsPayload;
            if (remote && Array.isArray(remote.posts)) {
              base = remote;
              break;
            }
          }
        } catch {
          clearTimeout(timer);
        }
      }
    }
  } catch {
    // Silent fallback to bundled ./data/cms-content.json
  }

  if (local) {
    return {
      ...base,
      ...local,
      posts: local.posts ?? base.posts,
      syncedPublications:
        local.syncedPublications?.length > 0
          ? local.syncedPublications
          : base.syncedPublications,
      timelineOverrides:
        local.timelineOverrides?.length > 0
          ? local.timelineOverrides
          : base.timelineOverrides,
    };
  }

  return base;
}

export function loadDismissedAlerts(): string[] {
  try {
    const raw = window.localStorage.getItem(LOCAL_DISMISSED_ALERTS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveDismissedAlerts(ids: string[]): void {
  try {
    window.localStorage.setItem(LOCAL_DISMISSED_ALERTS_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export function mergePublications(
  curated: PublicationItem[],
  synced: SyncedPublication[]
): PublicationItem[] {
  if (!synced?.length) return curated;

  const norm = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9\u0600-\u06ff]+/g, '');
  const byDoi = new Map<string, SyncedPublication>();
  const byTitle = new Map<string, SyncedPublication>();

  for (const s of synced) {
    if (s.doi && !s.doi.includes('OpenAlex') && !s.doi.includes('Indexed')) {
      byDoi.set(norm(s.doi), s);
    }
    byTitle.set(norm(s.title), s);
  }

  // Update citation counts on curated entries if OpenAlex synced newer counts
  const merged = curated.map((item) => {
    const match =
      byDoi.get(norm(item.doi)) || byTitle.get(norm(item.title));
    if (match && match.citations > item.citations) {
      return { ...item, citations: match.citations };
    }
    return item;
  });

  const existingTitles = new Set(curated.map((c) => norm(c.title)));
  const existingDois = new Set(
    curated
      .map((c) => norm(c.doi))
      .filter((d) => d.length > 5)
  );

  for (const s of synced) {
    const nt = norm(s.title);
    const nd = norm(s.doi);
    if (existingTitles.has(nt) || (nd.length > 5 && existingDois.has(nd))) {
      continue;
    }
    merged.push({
      ...s,
      typeLabel: s.type,
    });
  }

  return merged.sort((a, b) => b.year - a.year);
}

export function mergeTimeline(
  curated: TimelineItem[],
  overrides: LinkedInTimelineEntry[],
  lang: 'en' | 'fa'
): TimelineItem[] {
  if (!overrides?.length) return curated;
  const converted: TimelineItem[] = overrides.map((o) => ({
    id: o.id,
    period: lang === 'fa' ? o.periodFa || o.periodEn : o.periodEn,
    role: lang === 'fa' ? o.roleFa || o.roleEn : o.roleEn,
    institution:
      lang === 'fa' ? o.institutionFa || o.institutionEn : o.institutionEn,
    location: lang === 'fa' ? o.locationFa || o.locationEn : o.locationEn,
    kind: lang === 'fa' ? o.kindFa || o.kindEn : o.kindEn,
    summary: lang === 'fa' ? o.summaryFa || o.summaryEn : o.summaryEn,
    highlights:
      lang === 'fa'
        ? o.highlightsFa?.length
          ? o.highlightsFa
          : o.highlightsEn
        : o.highlightsEn,
  }));
  return [...converted, ...curated];
}
