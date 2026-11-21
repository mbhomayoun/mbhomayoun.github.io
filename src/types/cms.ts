export type ContentPlacement = 'alert' | 'blog' | 'video' | 'note' | 'pdf';

export interface CmsPost {
  id: string;
  placement: ContentPlacement;
  urgent: boolean;
  date: string;
  tagEn: string;
  tagFa: string;
  titleEn: string;
  titleFa: string;
  summaryEn: string;
  summaryFa: string;
  bodyEn: string;
  bodyFa: string;
  equation?: string;
  mediaUrl?: string;
  mediaType?: 'none' | 'pdf' | 'video-file' | 'video-embed';
  durationOrPages?: string;
}

export interface SyncedPublication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  type: 'Journal' | 'Preprint' | 'Book';
  citations: number;
  doi: string;
  topics: string[];
  abstract: string;
  keyFinding: string;
  bibtex: string;
  pdfUrl: string;
}

export interface LinkedInTimelineEntry {
  id: string;
  periodEn: string;
  periodFa: string;
  roleEn: string;
  roleFa: string;
  institutionEn: string;
  institutionFa: string;
  locationEn: string;
  locationFa: string;
  kindEn: string;
  kindFa: string;
  summaryEn: string;
  summaryFa: string;
  highlightsEn: string[];
  highlightsFa: string[];
}

export interface CmsPayload {
  version: number;
  lastSyncedAt: string;
  scholarAuthorId?: string;
  openAlexAuthorId: string;
  posts: CmsPost[];
  syncedPublications: SyncedPublication[];
  timelineOverrides: LinkedInTimelineEntry[];
}
