import { GoogleGenAI } from '@google/genai';
import { ContentPlacement, LinkedInTimelineEntry } from '../types/cms';

const MODEL_ID = 'gemini-4-hydrogen';

function extractJsonObject<T>(raw: string): T {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : trimmed;
  const firstBrace = candidate.indexOf('{');
  const firstBracket = candidate.indexOf('[');
  let start = -1;
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    start = firstBrace;
  } else {
    start = firstBracket;
  }
  const sliced = start > 0 ? candidate.slice(start) : candidate;
  return JSON.parse(sliced) as T;
}

export async function aiDraftPost(params: {
  apiKey: string;
  sourceLang: 'en' | 'fa';
  placement: ContentPlacement;
  promptOrDraft: string;
}): Promise<{ tag: string; title: string; summary: string; body: string }> {
  const ai = new GoogleGenAI({ apiKey: params.apiKey.trim() });

  const langLabel =
    params.sourceLang === 'fa'
      ? 'fluent academic Persian (فارسی رسمی و علمی)'
      : 'concise academic English';

  const contextMap: Record<ContentPlacement, string> = {
    alert: 'an urgent short academic/course announcement (e.g., class schedule change, deadline, cancellation)',
    blog: 'an academic research blog post / update for Mohammad Bagher Homayoun (Petroleum Geomechanics, CFD & Energy Policy)',
    video: 'a short lesson overview accompanying a course lecture video',
    note: 'a structured university lecture note / study handout',
    pdf: 'a concise overview accompanying a protected PDF slide deck or handout',
  };

  const response = await ai.interactions.create({
    model: MODEL_ID,
    store: false,
    system_instruction: `You are the academic writing assistant for Dr./Ph.D. Candidate Mohammad Bagher Homayoun (Amirkabir University of Technology, Petroleum Engineering & Energy Governance). Write in ${langLabel}. Return ONLY valid JSON with keys: "tag", "title", "summary", "body".`,
    input: `Create or polish ${contextMap[params.placement]} from the following notes/idea:\n\n${params.promptOrDraft}`,
  });

  const text = response.output_text ?? '';
  return extractJsonObject<{
    tag: string;
    title: string;
    summary: string;
    body: string;
  }>(text);
}

export async function aiAutoTranslatePost(params: {
  apiKey: string;
  fromLang: 'en' | 'fa';
  tag: string;
  title: string;
  summary: string;
  body: string;
}): Promise<{
  translatedTag: string;
  translatedTitle: string;
  translatedSummary: string;
  translatedBody: string;
}> {
  const ai = new GoogleGenAI({ apiKey: params.apiKey.trim() });
  const targetLang =
    params.fromLang === 'en'
      ? 'natural, fluent academic Persian (فارسی دانشگاهی روان و دقیق)'
      : 'crisp, natural academic English';

  const response = await ai.interactions.create({
    model: MODEL_ID,
    store: false,
    system_instruction: `You are an expert bilingual English-Persian academic translator specializing in petroleum engineering, geomechanics, CFD, and energy policy. Translate the provided JSON fields into ${targetLang}. Preserve technical accuracy and mathematical symbols. Return ONLY valid JSON with keys: "translatedTag", "translatedTitle", "translatedSummary", "translatedBody".`,
    input: JSON.stringify({
      tag: params.tag,
      title: params.title,
      summary: params.summary,
      body: params.body,
    }),
  });

  const text = response.output_text ?? '';
  return extractJsonObject<{
    translatedTag: string;
    translatedTitle: string;
    translatedSummary: string;
    translatedBody: string;
  }>(text);
}

export async function aiParseLinkedInProfile(params: {
  apiKey: string;
  rawText: string;
}): Promise<LinkedInTimelineEntry[]> {
  const ai = new GoogleGenAI({ apiKey: params.apiKey.trim() });

  const response = await ai.interactions.create({
    model: MODEL_ID,
    store: false,
    system_instruction:
      'Extract career and education milestones from pasted LinkedIn text into bilingual English & Persian timeline items. Return ONLY a JSON object {"entries": [...]} where each entry has: id, periodEn, periodFa, roleEn, roleFa, institutionEn, institutionFa, locationEn, locationFa, kindEn, kindFa, summaryEn, summaryFa, highlightsEn (string[]), highlightsFa (string[]).',
    input: params.rawText,
  });

  const text = response.output_text ?? '';
  const parsed = extractJsonObject<{ entries: LinkedInTimelineEntry[] }>(text);
  return parsed.entries ?? [];
}
