export interface AdminVaultFile {
  version: 1;
  emailHash: string;
  salt: string;
  iv: string;
  iterations: number;
  ciphertext: string;
}

export interface UnlockedVaultSession {
  email: string;
  githubToken: string;
  geminiKey?: string;
}

const SESSION_KEY = 'observatory-unlocked-vault';
const RAW_VAULT_URL =
  'https://raw.githubusercontent.com/homayounmb/homayounmb.github.io/main/public/data/admin-vault.json';

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    out[i] = bin.charCodeAt(i);
  }
  return out;
}

async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(text)
  );
  return bytesToHex(new Uint8Array(buf));
}

async function fetchAdminVaultFile(): Promise<AdminVaultFile> {
  let vault: AdminVaultFile | null = null;

  try {
    const res = await fetch(`./data/admin-vault.json?t=${Date.now()}`);
    if (res.ok) {
      vault = (await res.json()) as AdminVaultFile;
    }
  } catch {
    // Fallback to raw GitHub below
  }

  if (
    typeof window !== 'undefined' &&
    !window.location.hostname.includes('localhost') &&
    !window.location.hostname.includes('127.0.0.1')
  ) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);
      const rawRes = await fetch(`${RAW_VAULT_URL}?t=${Date.now()}`, {
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (rawRes.ok) {
        vault = (await rawRes.json()) as AdminVaultFile;
      }
    } catch {
      // Keep bundled ./data/admin-vault.json
    }
  }

  if (!vault || !vault.ciphertext) {
    throw new Error('Admin vault not initialized yet.');
  }
  return vault;
}

export async function unlockAdminVault(
  email: string,
  password: string
): Promise<UnlockedVaultSession> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) {
    throw new Error('Invalid email or password.');
  }

  const vault = await fetchAdminVaultFile();
  const actualEmailHash = await sha256Hex(normalizedEmail);
  if (actualEmailHash !== vault.emailHash) {
    throw new Error('Invalid email or password.');
  }

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(`${normalizedEmail}:${password}`),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const aesKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: hexToBytes(vault.salt) as unknown as BufferSource,
      iterations: vault.iterations || 210000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  let plaintextBytes: ArrayBuffer;
  try {
    plaintextBytes = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: hexToBytes(vault.iv) as unknown as BufferSource,
      },
      aesKey,
      base64ToBytes(vault.ciphertext) as unknown as BufferSource
    );
  } catch {
    throw new Error('Invalid email or password.');
  }

  const decoded = new TextDecoder().decode(plaintextBytes);
  const session = JSON.parse(decoded) as UnlockedVaultSession;

  if (!session.githubToken) {
    throw new Error('Vault payload missing GitHub publishing token.');
  }

  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  return session;
}

export function getUnlockedVaultSession(): UnlockedVaultSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UnlockedVaultSession;
    return parsed?.githubToken ? parsed : null;
  } catch {
    return null;
  }
}

export function clearUnlockedVaultSession(): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(SESSION_KEY);
}
