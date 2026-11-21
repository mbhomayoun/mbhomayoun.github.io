import { CmsPayload, SyncedPublication } from '../types/cms';

const DEFAULT_REPO_OWNER = 'homayounmb';
const DEFAULT_REPO_NAME = 'homayounmb.github.io';
const CMS_FILE_PATH = 'public/data/cms-content.json';

let cachedRepo: { owner: string; repo: string } | null = null;

function getHostRepoFallback(): { owner: string; repo: string } {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    if (host.endsWith('.github.io')) {
      const owner = host.replace(/\.github\.io$/, '');
      if (owner) return { owner, repo: `${owner}.github.io` };
    }
  }
  return { owner: DEFAULT_REPO_OWNER, repo: DEFAULT_REPO_NAME };
}

async function resolveTargetRepo(token?: string): Promise<{ owner: string; repo: string }> {
  if (cachedRepo) return cachedRepo;
  const hostRepo = getHostRepoFallback();
  if (!token) return hostRepo;

  try {
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/vnd.github+json',
      },
    });
    if (userRes.ok) {
      const user = (await userRes.json()) as { login?: string };
      if (user.login) {
        const candidateRepo = `${user.login}.github.io`;
        const repoRes = await fetch(
          `https://api.github.com/repos/${user.login}/${candidateRepo}`,
          {
            headers: {
              Authorization: `Bearer ${token.trim()}`,
              Accept: 'application/vnd.github+json',
            },
          }
        );
        if (repoRes.ok) {
          cachedRepo = { owner: user.login, repo: candidateRepo };
          return cachedRepo;
        }
      }
    }
  } catch {
    // Fall back to hostname inference
  }

  return hostRepo;
}

function toBase64Utf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function arrayBufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

export async function verifyGitHubToken(token: string): Promise<{
  ok: boolean;
  login?: string;
  error?: string;
}> {
  try {
    const target = await resolveTargetRepo(token);
    const res = await fetch(`https://api.github.com/repos/${target.owner}/${target.repo}`, {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/vnd.github+json',
      },
    });
    if (!res.ok) {
      return { ok: false, error: `GitHub API returned ${res.status}` };
    }
    const repo = (await res.json()) as { permissions?: { push?: boolean } };
    if (repo.permissions && !repo.permissions.push) {
      return {
        ok: false,
        error: 'Token lacks write (push) permission to this repository.',
      };
    }

    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/vnd.github+json',
      },
    });
    const user = userRes.ok ? ((await userRes.json()) as { login?: string }) : {};
    return { ok: true, login: user.login ?? target.owner };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Network error',
    };
  }
}

async function getFileSha(
  token: string,
  target: { owner: string; repo: string },
  path: string
): Promise<string | undefined> {
  const res = await fetch(
    `https://api.github.com/repos/${target.owner}/${target.repo}/contents/${path}`,
    {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/vnd.github+json',
      },
    }
  );
  if (!res.ok) return undefined;
  const data = (await res.json()) as { sha?: string };
  return data.sha;
}

export async function uploadMaterialFileToGitHub(params: {
  token: string;
  file: File;
}): Promise<string> {
  const target = await resolveTargetRepo(params.token);
  const cleanName = params.file.name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-');
  const repoPath = `public/materials/${Date.now()}-${cleanName}`;
  const buffer = await params.file.arrayBuffer();
  const base64 = arrayBufferToBase64(buffer);

  const res = await fetch(
    `https://api.github.com/repos/${target.owner}/${target.repo}/contents/${repoPath}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${params.token.trim()}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `chore(materials): upload ${cleanName}`,
        content: base64,
        branch: 'main',
      }),
    }
  );

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Upload failed (${res.status}): ${msg}`);
  }

  // Relative path inside built GitHub Pages site (public/ is served at root ./materials/...)
  return `./materials/${repoPath.split('/').pop()}`;
}

export async function publishCmsToGitHub(params: {
  token: string;
  payload: CmsPayload;
  commitMessage?: string;
}): Promise<void> {
  const target = await resolveTargetRepo(params.token);
  const sha = await getFileSha(params.token, target, CMS_FILE_PATH);
  const contentStr = JSON.stringify(params.payload, null, 2) + '\n';

  const res = await fetch(
    `https://api.github.com/repos/${target.owner}/${target.repo}/contents/${CMS_FILE_PATH}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${params.token.trim()}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: params.commitMessage ?? 'chore(cms): update website content',
        content: toBase64Utf8(contentStr),
        sha,
        branch: 'main',
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GitHub publish failed (${res.status}): ${errText}`);
  }
}

export async function syncOpenAlexPublications(
  authorId = 'A5120058838'
): Promise<SyncedPublication[]> {
  const url = `https://api.openalex.org/works?filter=author.id:${encodeURIComponent(
    authorId
  )}&sort=publication_year:desc&per-page=50`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`OpenAlex API returned ${res.status}`);
  }

  interface OpenAlexWork {
    id?: string;
    title?: string;
    publication_year?: number;
    type?: string;
    cited_by_count?: number;
    doi?: string;
    abstract_inverted_index?: Record<string, number[]>;
    primary_location?: {
      landing_page_url?: string;
      source?: { display_name?: string };
    };
    authorships?: { author: { display_name: string } }[];
    concepts?: { display_name?: string }[];
  }

  const data = (await res.json()) as { results?: OpenAlexWork[] };
  const results = data.results ?? [];

  return results
    .filter((w) => Boolean(w.title))
    .map((w) => {
      const title = w.title ?? '';
      const inv = w.abstract_inverted_index ?? {};
      const words: Record<number, string> = {};
      Object.entries(inv).forEach(([word, positions]) => {
        positions.forEach((p) => {
          words[p] = word;
        });
      });
      const keys = Object.keys(words)
        .map(Number)
        .sort((a, b) => a - b);
      const abstract =
        keys.length > 0
          ? keys.map((k) => words[k]).join(' ').slice(0, 900)
          : 'Indexed automatically via OpenAlex Scholarly Graph.';

      const src =
        w.primary_location?.source?.display_name ?? 'Indexed Repository';
      const doiRaw = w.doi ?? '';
      const doi = doiRaw
        ? doiRaw.replace('https://doi.org/', '')
        : 'OpenAlex';
      const authors = (w.authorships ?? [])
        .map((a) => a.author.display_name)
        .join(', ');
      const year = w.publication_year ?? 2026;
      const wtype: SyncedPublication['type'] =
        w.type === 'preprint'
          ? 'Preprint'
          : w.type === 'book'
            ? 'Book'
            : 'Journal';
      const topics =
        (w.concepts ?? [])
          .slice(0, 3)
          .map((c) => c.display_name ?? '')
          .filter(Boolean) || ['Petroleum Engineering'];
      const slug = (w.id ?? title).split('/').pop() ?? 'work';

      return {
        id: `oa-${slug}`,
        title,
        authors,
        venue: src,
        year,
        type: wtype,
        citations: w.cited_by_count ?? 0,
        doi,
        topics: topics.length ? topics : ['Petroleum Engineering'],
        abstract,
        keyFinding: `Automatically indexed via OpenAlex (${src}, ${year}).`,
        bibtex: `@article{${slug},\n  title={${title}},\n  author={${authors}},\n  journal={${src}},\n  year={${year}},\n  doi={${doi}}\n}`,
        pdfUrl:
          doiRaw ||
          w.primary_location?.landing_page_url ||
          `https://openalex.org/${slug}`,
      };
    });
}
