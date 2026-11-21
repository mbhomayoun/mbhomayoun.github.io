#!/usr/bin/env node
/**
 * Local Masked Credential Setup Helper for Admin Backend (Vercel or Cloudflare Workers).
 * Runs interactively in your terminal with hidden password/API-key entry so secrets
 * are NEVER typed into chat or committed to Git.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import readline from 'node:readline';

function askHidden(prompt) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const stdin = process.stdin;
    process.stdout.write(prompt);
    let val = '';
    const onData = (ch) => {
      const s = ch.toString('utf8');
      if (s === '\r' || s === '\n' || s === '\u0004') {
        stdin.removeListener('data', onData);
        if (stdin.isTTY) stdin.setRawMode(false);
        process.stdout.write('\n');
        rl.close();
        resolve(val);
      } else if (s === '\u0003') {
        process.exit(1);
      } else if (s === '\u007f' || s === '\b') {
        val = val.slice(0, -1);
      } else {
        val += s;
      }
    };
    if (stdin.isTTY) stdin.setRawMode(true);
    stdin.resume();
    stdin.on('data', onData);
  });
}

function askVisible(prompt) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(prompt, (ans) => {
      rl.close();
      resolve(ans.trim());
    });
  });
}

async function main() {
  console.log('\n=== Observatory Private Admin Secret Generator ===\n');
  const email = await askVisible('Admin Login Email (e.g. mb.homayoun@aut.ac.ir): ');
  const password = await askHidden('Choose Admin Password (typing hidden): ');
  const geminiKey = await askHidden('Paste Gemini API Key (typing hidden, Enter to skip): ');

  let ghToken = '';
  try {
    ghToken = execSync('gh auth token', { encoding: 'utf8' }).trim();
    console.log('Detected authenticated GitHub CLI token automatically.');
  } catch {
    ghToken = await askHidden('Paste GitHub Token with repo write scope (typing hidden): ');
  }

  const salt = crypto.randomBytes(16);
  const derived = crypto.pbkdf2Sync(password, salt, 210000, 32, 'sha256');
  const passwordHash = `pbkdf2$210000$${salt.toString('hex')}$${derived.toString('hex')}`;
  const jwtSecret = crypto.randomBytes(32).toString('hex');

  const envFile = [
    `ADMIN_EMAIL=${email}`,
    `ADMIN_PASSWORD_HASH=${passwordHash}`,
    `JWT_SECRET=${jwtSecret}`,
    `GEMINI_API_KEY=${geminiKey}`,
    `GITHUB_TOKEN=${ghToken}`,
    `GITHUB_REPO=homayounmb/homayounmb.github.io`,
    `ALLOWED_ORIGIN=https://homayounmb.github.io`,
  ].join('\n') + '\n';

  fs.writeFileSync('.env.admin.local', envFile, { mode: 0o600 });
  console.log('\nSaved secrets safely to .env.admin.local (gitignored).');
  console.log('Next step: deploy api/admin.ts on Vercel or worker/ on Cloudflare Workers and upload these env vars as server secrets.\n');
}

main();
