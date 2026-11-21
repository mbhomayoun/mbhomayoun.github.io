import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const email = (process.env.VAULT_EMAIL || '').trim().toLowerCase();
const password = process.env.VAULT_PASS || '';
const githubToken = (process.env.VAULT_GH_TOKEN || '').trim();
const geminiKey = (process.env.VAULT_GEMINI_KEY || '').trim();

if (!email || !password || !githubToken) {
  console.error('Missing required vault parameters.');
  process.exit(1);
}

const iterations = 210000;
const salt = crypto.randomBytes(16);
const iv = crypto.randomBytes(12);
const emailHash = crypto.createHash('sha256').update(email).digest('hex');

const derivedKey = crypto.pbkdf2Sync(
  `${email}:${password}`,
  salt,
  iterations,
  32,
  'sha256'
);

const payload = JSON.stringify({
  email,
  githubToken,
  ...(geminiKey ? { geminiKey } : {}),
});

const cipher = crypto.createCipheriv('aes-256-gcm', derivedKey, iv);
const encrypted = Buffer.concat([
  cipher.update(payload, 'utf8'),
  cipher.final(),
]);
const authTag = cipher.getAuthTag();
// WebCrypto AES-GCM expects ciphertext || 16-byte tag concatenated
const combined = Buffer.concat([encrypted, authTag]);

const vaultJson = {
  version: 1,
  emailHash,
  salt: salt.toString('hex'),
  iv: iv.toString('hex'),
  iterations,
  ciphertext: combined.toString('base64'),
};

const outPath = path.resolve('public/data/admin-vault.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(vaultJson, null, 2) + '\n', 'utf8');
console.log('Vault encrypted and saved to public/data/admin-vault.json (0 plaintext secrets).');
