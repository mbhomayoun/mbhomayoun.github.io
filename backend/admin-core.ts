// Pure Web-Standard Serverless Backend Core (works identically on Vercel & Cloudflare Workers)
// Keeps ADMIN_EMAIL, ADMIN_PASSWORD_HASH, JWT_SECRET, GEMINI_API_KEY, and GITHUB_TOKEN
// 100% server-side so zero secrets ever touch the public GitHub repository or browser bundle.

export interface BackendEnv {
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD_HASH?: string; // Format: pbkdf2$210000$<hexSalt>$<hexHash>
  JWT_SECRET?: string;
  GEMINI_API_KEY?: string;
  GITHUB_TOKEN?: string;
  GITHUB_REPO?: string; // Default: homayounmb/homayounmb.github.io
  ALLOWED_ORIGIN?: string;
}

const GEMINI_MODEL = 'gemini-4-hydrogen';
const DEFAULT_REPO = 'homayounmb/homayounmb.github.io';

function corsHeaders(req: Request, env: BackendEnv): Record<string, string> {
  const origin = req.headers.get('Origin') || '*';
  const allowed = env.ALLOWED_ORIGIN || origin;
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json; charset=utf-8',
  };
}

function jsonResp(
  req: Request,
  env: BackendEnv,
  status: number,
  body: unknown
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders(req, env),
  });
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function base64UrlEncode(data: Uint8Array | string): string {
  const bytes =
    typeof data === 'string' ? new TextEncoder().encode(data) : data;
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  const pad = str.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(pad + '='.repeat((4 - (pad.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
  const iterations = Number(parts[1]);
  const salt = hexToBytes(parts[2]);
  const expectedHex = parts[3];
  if (!iterations || !salt.length) return false;

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const derived = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );
  return constantTimeEqual(bytesToHex(new Uint8Array(derived)), expectedHex);
}

async function signJwt(
  payload: Record<string, unknown>,
  secret: string
): Promise<string> {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const msg = `${header}.${body}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(msg)
  );
  return `${msg}.${base64UrlEncode(new Uint8Array(sig))}`;
}

async function verifyJwt(
  token: string,
  secret: string
): Promise<{ email: string; exp: number } | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, sigStr] = parts;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  const sig = base64UrlDecode(sigStr);
  const ok = await crypto.subtle.verify(
    'HMAC',
    key,
    sig as unknown as BufferSource,
    new TextEncoder().encode(`${header}.${body}`)
  );
  if (!ok) return null;
  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(body))) as {
    email?: string;
    exp?: number;
  };
  if (!payload.email || !payload.exp || Date.now() > payload.exp) return null;
  return { email: payload.email, exp: payload.exp };
}

async function requireAuth(
  req: Request,
  env: BackendEnv
): Promise<{ email: string } | null> {
  const auth = req.headers.get('Authorization') || '';
  if (!auth.startsWith('Bearer ') || !env.JWT_SECRET) return null;
  const token = auth.slice(7).trim();
  const verified = await verifyJwt(token, env.JWT_SECRET);
  if (!verified) return null;
  if (
    env.ADMIN_EMAIL &&
    verified.email.toLowerCase() !== env.ADMIN_EMAIL.trim().toLowerCase()
  ) {
    return null;
  }
  return { email: verified.email };
}

function extractJsonObject(raw: string): unknown {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : trimmed;
  const fb = candidate.indexOf('{');
  const sb = candidate.indexOf('[');
  const start =
    fb !== -1 && (sb === -1 || fb < sb) ? fb : sb;
  const sliced = start > 0 ? candidate.slice(start) : candidate;
  return JSON.parse(sliced);
}

async function callGemini(params: {
  apiKey: string;
  systemInstruction: string;
  input: string;
}): Promise<string> {
  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1/interactions',
    {
      method: 'POST',
      headers: {
        'x-goog-api-key': params.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        store: false,
        system_instruction: params.systemInstruction,
        input: params.input,
      }),
    }
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API ${res.status}: ${errText}`);
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
}

function toBase64Utf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

async function githubPutFile(params: {
  token: string;
  repo: string;
  path: string;
  base64Content: string;
  message: string;
}): Promise<void> {
  const url = `https://api.github.com/repos/${params.repo}/contents/${params.path}`;
  let sha: string | undefined;
  const existing = await fetch(url, {
    headers: {
      Authorization: `Bearer ${params.token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'Observatory-Admin-Backend',
    },
  });
  if (existing.ok) {
    const info = (await existing.json()) as { sha?: string };
    sha = info.sha;
  }

  const putRes = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${params.token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'Observatory-Admin-Backend',
    },
    body: JSON.stringify({
      message: params.message,
      content: params.base64Content,
      sha,
      branch: 'main',
    }),
  });
  if (!putRes.ok) {
    const err = await putRes.text();
    throw new Error(`GitHub PUT ${putRes.status}: ${err}`);
  }
}

export async function handleAdminRequest(
  req: Request,
  env: BackendEnv
): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(req, env) });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get('action') || '';

  if (action === 'health') {
    return jsonResp(req, env, 200, {
      ok: true,
      configured: Boolean(env.ADMIN_EMAIL && env.ADMIN_PASSWORD_HASH && env.JWT_SECRET),
      hasGemini: Boolean(env.GEMINI_API_KEY),
      hasGitHub: Boolean(env.GITHUB_TOKEN),
    });
  }

  if (action === 'session') {
    const session = await requireAuth(req, env);
    if (!session) return jsonResp(req, env, 401, { error: 'Unauthorized' });
    return jsonResp(req, env, 200, {
      authenticated: true,
      email: session.email,
      hasGemini: Boolean(env.GEMINI_API_KEY),
      hasGitHub: Boolean(env.GITHUB_TOKEN),
    });
  }

  if (req.method !== 'POST') {
    return jsonResp(req, env, 405, { error: 'Method not allowed' });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return jsonResp(req, env, 400, { error: 'Invalid JSON body' });
  }

  if (action === 'login') {
    if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD_HASH || !env.JWT_SECRET) {
      return jsonResp(req, env, 503, {
        error: 'Admin backend secrets not yet provisioned.',
      });
    }
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const emailMatch = constantTimeEqual(
      email,
      env.ADMIN_EMAIL.trim().toLowerCase()
    );
    const passMatch = await verifyPassword(password, env.ADMIN_PASSWORD_HASH);
    if (!emailMatch || !passMatch) {
      return jsonResp(req, env, 401, { error: 'Invalid email or password.' });
    }
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const token = await signJwt({ email, exp: expiresAt }, env.JWT_SECRET);
    return jsonResp(req, env, 200, {
      token,
      email,
      expiresAt,
      hasGemini: Boolean(env.GEMINI_API_KEY),
      hasGitHub: Boolean(env.GITHUB_TOKEN),
    });
  }

  // All remaining routes strictly require valid admin JWT
  const session = await requireAuth(req, env);
  if (!session) {
    return jsonResp(req, env, 401, { error: 'Authentication required.' });
  }

  if (action === 'ai-draft') {
    if (!env.GEMINI_API_KEY) {
      return jsonResp(req, env, 503, { error: 'GEMINI_API_KEY not configured on server.' });
    }
    const sourceLang = body.sourceLang === 'fa' ? 'fa' : 'en';
    const placement = String(body.placement || 'blog');
    const promptOrDraft = String(body.promptOrDraft || '');
    const langLabel =
      sourceLang === 'fa'
        ? 'fluent academic Persian (فارسی رسمی و علمی)'
        : 'concise academic English';
    const raw = await callGemini({
      apiKey: env.GEMINI_API_KEY,
      systemInstruction: `You are the academic writing assistant for Mohammad Bagher Homayoun (Amirkabir University of Technology, Petroleum Engineering & Energy Governance). Write in ${langLabel}. Return ONLY valid JSON with keys: "tag", "title", "summary", "body".`,
      input: `Create or polish a "${placement}" item from:\n\n${promptOrDraft}`,
    });
    return jsonResp(req, env, 200, extractJsonObject(raw));
  }

  if (action === 'ai-translate') {
    if (!env.GEMINI_API_KEY) {
      return jsonResp(req, env, 503, { error: 'GEMINI_API_KEY not configured on server.' });
    }
    const fromLang = body.fromLang === 'fa' ? 'fa' : 'en';
    const targetLang =
      fromLang === 'en'
        ? 'natural, fluent academic Persian (فارسی دانشگاهی روان و دقیق)'
        : 'crisp, natural academic English';
    const raw = await callGemini({
      apiKey: env.GEMINI_API_KEY,
      systemInstruction: `You are an expert bilingual English-Persian academic translator in petroleum engineering, geomechanics, CFD, and energy policy. Translate into ${targetLang}. Return ONLY valid JSON with keys: "translatedTag", "translatedTitle", "translatedSummary", "translatedBody".`,
      input: JSON.stringify({
        tag: body.tag,
        title: body.title,
        summary: body.summary,
        body: body.body,
      }),
    });
    return jsonResp(req, env, 200, extractJsonObject(raw));
  }

  if (action === 'ai-linkedin') {
    if (!env.GEMINI_API_KEY) {
      return jsonResp(req, env, 503, { error: 'GEMINI_API_KEY not configured on server.' });
    }
    const raw = await callGemini({
      apiKey: env.GEMINI_API_KEY,
      systemInstruction:
        'Extract career and education milestones from LinkedIn text into bilingual English & Persian timeline entries. Return ONLY JSON {"entries": [...]} where each entry has id, periodEn, periodFa, roleEn, roleFa, institutionEn, institutionFa, locationEn, locationFa, kindEn, kindFa, summaryEn, summaryFa, highlightsEn (string[]), highlightsFa (string[]).',
      input: String(body.rawText || ''),
    });
    return jsonResp(req, env, 200, extractJsonObject(raw));
  }

  if (action === 'upload') {
    if (!env.GITHUB_TOKEN) {
      return jsonResp(req, env, 503, { error: 'GITHUB_TOKEN not configured on server.' });
    }
    const fileName = String(body.fileName || 'material.bin')
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, '-');
    const base64Content = String(body.base64Content || '');
    if (!base64Content) {
      return jsonResp(req, env, 400, { error: 'Missing file content' });
    }
    const stamped = `${Date.now()}-${fileName}`;
    await githubPutFile({
      token: env.GITHUB_TOKEN,
      repo: env.GITHUB_REPO || DEFAULT_REPO,
      path: `public/materials/${stamped}`,
      base64Content,
      message: `chore(materials): upload ${fileName}`,
    });
    return jsonResp(req, env, 200, { mediaUrl: `./materials/${stamped}` });
  }

  if (action === 'publish') {
    if (!env.GITHUB_TOKEN) {
      return jsonResp(req, env, 503, { error: 'GITHUB_TOKEN not configured on server.' });
    }
    const payload = body.payload;
    const message = String(body.commitMessage || 'chore(cms): update site content');
    await githubPutFile({
      token: env.GITHUB_TOKEN,
      repo: env.GITHUB_REPO || DEFAULT_REPO,
      path: 'public/data/cms-content.json',
      base64Content: toBase64Utf8(JSON.stringify(payload, null, 2) + '\n'),
      message,
    });
    return jsonResp(req, env, 200, { ok: true });
  }

  return jsonResp(req, env, 400, { error: `Unknown action: ${action}` });
}
