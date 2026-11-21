import { ContentPlacement, LinkedInTimelineEntry } from '../types/cms';

const GEMINI_MODEL = 'gemini-4-hydrogen';

function extractJsonObject<T>(raw: string): T {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : trimmed;
  const fb = candidate.indexOf('{');
  const sb = candidate.indexOf('[');
  const start = fb !== -1 && (sb === -1 || fb < sb) ? fb : sb;
  const sliced = start > 0 ? candidate.slice(start) : candidate;
  return JSON.parse(sliced) as T;
}

async function tryGeminiRest(params: {
  apiKey: string;
  systemInstruction: string;
  input: string;
}): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1/interactions',
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': params.apiKey.trim(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: GEMINI_MODEL,
          store: false,
          system_instruction: params.systemInstruction,
          input: params.input,
        }),
        signal: controller.signal,
      }
    );
    if (!res.ok) {
      throw new Error(`Gemini HTTP ${res.status}`);
    }
    const data = (await res.json()) as {
      output_text?: string;
      steps?: { type?: string; content?: { type?: string; text?: string }[] }[];
    };
    if (data.output_text) return data.output_text;
    const modelSteps = (data.steps ?? []).filter((s) => s.type === 'model_output');
    const lastStep = modelSteps[modelSteps.length - 1];
    return (lastStep?.content ?? [])
      .filter((c) => c.type === 'text' && c.text)
      .map((c) => c.text)
      .join('\n');
  } finally {
    clearTimeout(timer);
  }
}

const DOMAIN_GLOSSARY: Record<string, { en: string; fa: string }> = {
  alert: { en: 'Urgent Notice', fa: 'اطلاعیه فوری' },
  blog: { en: 'Research Dispatch', fa: 'گزارش پژوهشی' },
  video: { en: 'Course Video', fa: 'ویدئو آموزشی' },
  note: { en: 'Lecture Note', fa: 'جزوه درسی' },
  pdf: { en: 'Protected Slides', fa: 'فایل آموزشی' },
};

function chunkText(text: string, maxLen = 420): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (trimmed.length <= maxLen) return [trimmed];

  const paragraphs = trimmed.split(/\n+/);
  const chunks: string[] = [];
  let current = '';

  for (const p of paragraphs) {
    if ((current + '\n' + p).trim().length <= maxLen) {
      current = current ? `${current}\n${p}` : p;
    } else if (p.length <= maxLen) {
      if (current) chunks.push(current);
      current = p;
    } else {
      if (current) {
        chunks.push(current);
        current = '';
      }
      const sentences = p.split(/(?<=[.!?؟])\s+/);
      for (const s of sentences) {
        if ((current + ' ' + s).trim().length <= maxLen) {
          current = current ? `${current} ${s}` : s;
        } else {
          if (current) chunks.push(current);
          current = s.slice(0, maxLen);
        }
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

export async function translateTextFree(
  text: string,
  from: 'en' | 'fa',
  to: 'en' | 'fa'
): Promise<string> {
  const cleaned = text.trim();
  if (!cleaned || from === to) return cleaned;

  const chunks = chunkText(cleaned, 420);
  const translatedChunks: string[] = [];

  for (const chunk of chunks) {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        chunk
      )}&langpair=${from}|${to}`;
      const res = await fetch(url);
      if (!res.ok) {
        translatedChunks.push(chunk);
        continue;
      }
      const json = (await res.json()) as {
        responseStatus?: number;
        responseData?: { translatedText?: string };
      };
      const out = json.responseData?.translatedText?.trim();
      if (out && !out.toUpperCase().includes('MYMEMORY WARNING')) {
        translatedChunks.push(out);
      } else {
        translatedChunks.push(chunk);
      }
    } catch {
      translatedChunks.push(chunk);
    }
  }

  return translatedChunks.join('\n\n');
}

export async function smartAutoTranslatePost(params: {
  geminiKey?: string;
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
  engine: 'gemini' | 'builtin';
}> {
  if (params.geminiKey?.trim()) {
    try {
      const targetLang =
        params.fromLang === 'en'
          ? 'natural, fluent academic Persian (فارسی دانشگاهی روان و دقیق)'
          : 'crisp, natural academic English';
      const raw = await tryGeminiRest({
        apiKey: params.geminiKey,
        systemInstruction: `You are an expert bilingual English-Persian academic translator in petroleum engineering, geomechanics, CFD, and energy policy. Translate into ${targetLang}. Return ONLY valid JSON with keys: "translatedTag", "translatedTitle", "translatedSummary", "translatedBody".`,
        input: JSON.stringify({
          tag: params.tag,
          title: params.title,
          summary: params.summary,
          body: params.body,
        }),
      });
      const parsed = extractJsonObject<{
        translatedTag: string;
        translatedTitle: string;
        translatedSummary: string;
        translatedBody: string;
      }>(raw);
      return { ...parsed, engine: 'gemini' };
    } catch {
      // Automatic seamless fallback to unblocked free translator below
    }
  }

  const toLang = params.fromLang === 'en' ? 'fa' : 'en';
  const [translatedTag, translatedTitle, translatedSummary, translatedBody] =
    await Promise.all([
      translateTextFree(params.tag, params.fromLang, toLang),
      translateTextFree(params.title, params.fromLang, toLang),
      translateTextFree(params.summary, params.fromLang, toLang),
      translateTextFree(params.body, params.fromLang, toLang),
    ]);

  return {
    translatedTag,
    translatedTitle,
    translatedSummary,
    translatedBody,
    engine: 'builtin',
  };
}

export async function smartDraftPost(params: {
  geminiKey?: string;
  sourceLang: 'en' | 'fa';
  placement: ContentPlacement;
  promptOrDraft: string;
}): Promise<{
  tag: string;
  title: string;
  summary: string;
  body: string;
  engine: 'gemini' | 'builtin';
}> {
  if (params.geminiKey?.trim()) {
    try {
      const langLabel =
        params.sourceLang === 'fa'
          ? 'fluent academic Persian (فارسی رسمی و علمی)'
          : 'concise academic English';
      const raw = await tryGeminiRest({
        apiKey: params.geminiKey,
        systemInstruction: `You are the academic writing assistant for Mohammad Bagher Homayoun (Amirkabir University of Technology, Petroleum Engineering & Energy Governance). Write in ${langLabel}. Return ONLY valid JSON with keys: "tag", "title", "summary", "body".`,
        input: `Create or polish a "${params.placement}" item from:\n\n${params.promptOrDraft}`,
      });
      const parsed = extractJsonObject<{
        tag: string;
        title: string;
        summary: string;
        body: string;
      }>(raw);
      return { ...parsed, engine: 'gemini' };
    } catch {
      // Fall back to deterministic academic structuring
    }
  }

  const lines = params.promptOrDraft
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const firstLine = lines[0] || params.promptOrDraft.trim();
  const restText = lines.slice(1).join('\n\n') || firstLine;
  const tag = DOMAIN_GLOSSARY[params.placement][params.sourceLang];

  if (params.sourceLang === 'fa') {
    const title = firstLine.length > 90 ? `${firstLine.slice(0, 86)}...` : firstLine;
    const summary =
      lines.length > 1
        ? lines[1].slice(0, 160)
        : `جزئیات تکمیلی درباره: ${title}`;
    const body =
      params.placement === 'alert'
        ? `اطلاعیه مهم برای دانشجویان و همکاران گرامی:\n\n${restText}\n\nلطفاً جهت هماهنگی بیشتر از بخش تماس با بنده در ارتباط باشید.`
        : `خلاصه و چارچوب مطلب:\n\n${restText}\n\nاین محتوا توسط محمدباقر همایون (دانشکده مهندسی نفت دانشگاه صنعتی امیرکبیر) منتشر شده است.`;
    return { tag, title, summary, body, engine: 'builtin' };
  }

  const title = firstLine.length > 90 ? `${firstLine.slice(0, 86)}...` : firstLine;
  const summary =
    lines.length > 1
      ? lines[1].slice(0, 160)
      : `Academic update regarding ${title}`;
  const body =
    params.placement === 'alert'
      ? `Important notice for students and research collaborators:\n\n${restText}\n\nPlease reach out via the contact section if you have questions.`
      : `Overview & Key Points:\n\n${restText}\n\nPublished by Mohammad Bagher Homayoun (Department of Petroleum Engineering, Amirkabir University of Technology).`;

  return { tag, title, summary, body, engine: 'builtin' };
}

export async function smartParseLinkedIn(params: {
  geminiKey?: string;
  rawText: string;
}): Promise<LinkedInTimelineEntry[]> {
  if (params.geminiKey?.trim()) {
    try {
      const raw = await tryGeminiRest({
        apiKey: params.geminiKey,
        systemInstruction:
          'Extract career and education milestones from LinkedIn text into bilingual English & Persian timeline entries. Return ONLY JSON {"entries": [...]} where each entry has id, periodEn, periodFa, roleEn, roleFa, institutionEn, institutionFa, locationEn, locationFa, kindEn, kindFa, summaryEn, summaryFa, highlightsEn (string[]), highlightsFa (string[]).',
        input: params.rawText,
      });
      const parsed = extractJsonObject<{ entries: LinkedInTimelineEntry[] }>(raw);
      if (parsed.entries?.length) return parsed.entries;
    } catch {
      // Fallback to structured parser + free translator
    }
  }

  const lines = params.rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const roleEn = lines[0] || 'Research & Engineering Appointment';
  const institutionEn = lines[1] || 'Academic / Industry Organization';
  const periodEn = lines[2] || '2026 — PRESENT';
  const summaryEn =
    lines.slice(3).join(' ') || params.rawText.trim();

  const [roleFa, institutionFa, summaryFa] = await Promise.all([
    translateTextFree(roleEn, 'en', 'fa'),
    translateTextFree(institutionEn, 'en', 'fa'),
    translateTextFree(summaryEn, 'en', 'fa'),
  ]);

  return [
    {
      id: `li-${Date.now()}`,
      periodEn,
      periodFa: periodEn,
      roleEn,
      roleFa,
      institutionEn,
      institutionFa,
      locationEn: 'LinkedIn Import',
      locationFa: 'به‌روزرسانی لینکدین',
      kindEn: 'Experience',
      kindFa: 'سوابق حرفه‌ای',
      summaryEn,
      summaryFa,
      highlightsEn: lines.slice(3, 5),
      highlightsFa: [summaryFa],
    },
  ];
}
