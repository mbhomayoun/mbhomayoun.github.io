import { CmsPayload, ContentPlacement, LinkedInTimelineEntry } from '../types/cms';

const SESSION_JWT_KEY = 'observatory-admin-jwt';
const ENDPOINT_STORAGE_KEY = 'observatory-admin-endpoint';

export function getAdminEndpoint(): string {
  const baked = (import.meta.env.VITE_ADMIN_API_URL as string | undefined) || '';
  if (baked.trim()) return baked.trim().replace(/\/$/, '');
  if (typeof window !== 'undefined') {
    const saved = window.localStorage.getItem(ENDPOINT_STORAGE_KEY) || '';
    if (saved.trim()) return saved.trim().replace(/\/$/, '');
  }
  return '';
}

export function setAdminEndpoint(url: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ENDPOINT_STORAGE_KEY, url.trim().replace(/\/$/, ''));
}

export function getStoredJwt(): string {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(SESSION_JWT_KEY) || '';
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(SESSION_JWT_KEY);
}

async function callBackend<T>(
  endpoint: string,
  action: string,
  method: 'GET' | 'POST',
  body?: unknown,
  jwt?: string
): Promise<T> {
  if (!endpoint) {
    throw new Error(
      'Admin backend URL is not configured yet. Deploy api/admin.ts on Vercel or worker/ on Cloudflare and enter its URL.'
    );
  }
  const sep = endpoint.includes('?') ? '&' : '?';
  const url = `${endpoint}${sep}action=${encodeURIComponent(action)}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`;
  }
  const res = await fetch(url, {
    method,
    headers,
    body: method === 'POST' ? JSON.stringify(body ?? {}) : undefined,
  });
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export async function loginToAdminBackend(params: {
  endpoint: string;
  email: string;
  password: string;
}): Promise<{
  token: string;
  email: string;
  hasGemini: boolean;
  hasGitHub: boolean;
}> {
  const res = await callBackend<{
    token: string;
    email: string;
    hasGemini: boolean;
    hasGitHub: boolean;
  }>(params.endpoint, 'login', 'POST', {
    email: params.email,
    password: params.password,
  });
  window.localStorage.setItem(SESSION_JWT_KEY, res.token);
  return res;
}

export async function verifyAdminSession(endpoint: string): Promise<{
  authenticated: boolean;
  email?: string;
  hasGemini?: boolean;
  hasGitHub?: boolean;
}> {
  const jwt = getStoredJwt();
  if (!jwt || !endpoint) return { authenticated: false };
  try {
    return await callBackend<{
      authenticated: boolean;
      email: string;
      hasGemini: boolean;
      hasGitHub: boolean;
    }>(endpoint, 'session', 'GET', undefined, jwt);
  } catch {
    clearAdminSession();
    return { authenticated: false };
  }
}

export async function backendAiDraft(params: {
  endpoint: string;
  sourceLang: 'en' | 'fa';
  placement: ContentPlacement;
  promptOrDraft: string;
}): Promise<{ tag: string; title: string; summary: string; body: string }> {
  return callBackend(
    params.endpoint,
    'ai-draft',
    'POST',
    {
      sourceLang: params.sourceLang,
      placement: params.placement,
      promptOrDraft: params.promptOrDraft,
    },
    getStoredJwt()
  );
}

export async function backendAiTranslate(params: {
  endpoint: string;
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
  return callBackend(
    params.endpoint,
    'ai-translate',
    'POST',
    {
      fromLang: params.fromLang,
      tag: params.tag,
      title: params.title,
      summary: params.summary,
      body: params.body,
    },
    getStoredJwt()
  );
}

export async function backendAiLinkedIn(params: {
  endpoint: string;
  rawText: string;
}): Promise<{ entries: LinkedInTimelineEntry[] }> {
  return callBackend(
    params.endpoint,
    'ai-linkedin',
    'POST',
    { rawText: params.rawText },
    getStoredJwt()
  );
}

export async function backendUploadFile(params: {
  endpoint: string;
  file: File;
}): Promise<{ mediaUrl: string }> {
  const buf = await params.file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  const base64Content = btoa(bin);
  return callBackend(
    params.endpoint,
    'upload',
    'POST',
    { fileName: params.file.name, base64Content },
    getStoredJwt()
  );
}

export async function backendPublishCms(params: {
  endpoint: string;
  payload: CmsPayload;
  commitMessage?: string;
}): Promise<{ ok: boolean }> {
  return callBackend(
    params.endpoint,
    'publish',
    'POST',
    {
      payload: params.payload,
      commitMessage: params.commitMessage,
    },
    getStoredJwt()
  );
}
