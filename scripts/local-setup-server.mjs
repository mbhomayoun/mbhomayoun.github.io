import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const PORT = 5179;
const REPO_DIR = 'd:\\1- Homayoun\\website';
const ENV_PATH = `${process.env.PATH};C:\\Program Files\\GitHub CLI;C:\\Program Files\\Git\\cmd;C:\\Program Files\\nodejs`;

const HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MB Homayoun — Private Admin Vault Setup</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: radial-gradient(circle at top, #0f172a, #050608 70%);
      color: #f4f1ea;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .card {
      width: 100%;
      max-width: 460px;
      background: rgba(17, 22, 33, 0.88);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 24px;
      padding: 32px;
      box-shadow: 0 24px 60px rgba(0,0,0,0.6);
    }
    h1 {
      margin: 0 0 8px;
      font-size: 22px;
      color: #2ee6d6;
    }
    p.sub {
      margin: 0 0 22px;
      font-size: 13px;
      line-height: 1.5;
      color: #98a2b3;
    }
    label {
      display: block;
      font-size: 12px;
      color: #cbd5e1;
      margin: 14px 0 6px;
    }
    input {
      width: 100%;
      padding: 11px 14px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(5,6,8,0.65);
      color: #fff;
      font-size: 14px;
      outline: none;
    }
    input:focus { border-color: #2ee6d6; }
    button {
      margin-top: 22px;
      width: 100%;
      padding: 13px;
      border: 0;
      border-radius: 999px;
      background: #2ee6d6;
      color: #050608;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
    }
    button:disabled { opacity: 0.55; cursor: wait; }
    .msg {
      margin-top: 16px;
      padding: 12px 14px;
      border-radius: 12px;
      font-size: 13px;
      line-height: 1.5;
      display: none;
    }
    .msg.ok { display: block; background: rgba(46,230,214,0.14); border: 1px solid rgba(46,230,214,0.4); color: #2ee6d6; }
    .msg.err { display: block; background: rgba(245,185,113,0.14); border: 1px solid rgba(245,185,113,0.4); color: #f5b971; }
    a { color: #2ee6d6; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Private Admin Login Setup</h1>
    <p class="sub">
      Choose the Email &amp; Password you want to use to log into your website's Admin Dashboard.
      Your GitHub publishing access will be encrypted locally (AES-256-GCM) and deployed automatically.
    </p>
    <form id="f">
      <label for="email">Admin Login Email</label>
      <input id="email" type="email" required value="mb.homayoun@aut.ac.ir" />

      <label for="password">Choose Admin Password (min 8 characters)</label>
      <input id="password" type="password" required minlength="8" placeholder="Enter your chosen password" />

      <label for="gemini">Gemini API Key (Optional — leave blank to use built-in free AI)</label>
      <input id="gemini" type="password" placeholder="Optional: AIzaSy..." />

      <button id="btn" type="submit">Save, Encrypt &amp; Publish Live</button>
    </form>
    <div id="msg" class="msg"></div>
  </div>

  <script>
    const form = document.getElementById('f');
    const btn = document.getElementById('btn');
    const msg = document.getElementById('msg');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      btn.disabled = true;
      btn.textContent = 'Encrypting & pushing to GitHub...';
      msg.className = 'msg';
      msg.textContent = '';

      try {
        const res = await fetch('/setup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            geminiKey: document.getElementById('gemini').value
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Setup failed');
        msg.className = 'msg ok';
        msg.innerHTML = data.message + ' <br><br><a href="https://homayounmb.github.io/#admin" target="_blank">Open your Admin Login &rarr;</a>';
        btn.textContent = 'Done!';
      } catch (err) {
        msg.className = 'msg err';
        msg.textContent = err.message || 'Error';
        btn.disabled = false;
        btn.textContent = 'Save, Encrypt & Publish Live';
      }
    });
  </script>
</body>
</html>`;

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(HTML);
    return;
  }

  if (req.method === 'POST' && req.url === '/setup') {
    let raw = '';
    for await (const chunk of req) raw += chunk;
    try {
      const { email: rawEmail, password, geminiKey: rawGemini } = JSON.parse(raw);
      const email = String(rawEmail || '').trim().toLowerCase();
      const pass = String(password || '');
      const geminiKey = String(rawGemini || '').trim();

      if (!email || pass.length < 8) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Email and a password of at least 8 characters are required.' }));
        return;
      }

      const ghToken = execSync('gh auth token', {
        cwd: REPO_DIR,
        env: { ...process.env, PATH: ENV_PATH },
        encoding: 'utf8',
      }).trim();

      if (!ghToken) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'GitHub CLI token unavailable.' }));
        return;
      }

      const iterations = 210000;
      const salt = crypto.randomBytes(16);
      const iv = crypto.randomBytes(12);
      const emailHash = crypto.createHash('sha256').update(email).digest('hex');
      const derivedKey = crypto.pbkdf2Sync(`${email}:${pass}`, salt, iterations, 32, 'sha256');
      const payload = JSON.stringify({
        email,
        githubToken: ghToken,
        ...(geminiKey ? { geminiKey } : {}),
      });

      const cipher = crypto.createCipheriv('aes-256-gcm', derivedKey, iv);
      const encrypted = Buffer.concat([cipher.update(payload, 'utf8'), cipher.final()]);
      const combined = Buffer.concat([encrypted, cipher.getAuthTag()]);

      const vaultJson = {
        version: 1,
        emailHash,
        salt: salt.toString('hex'),
        iv: iv.toString('hex'),
        iterations,
        ciphertext: combined.toString('base64'),
      };

      const outPath = path.join(REPO_DIR, 'public/data/admin-vault.json');
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, JSON.stringify(vaultJson, null, 2) + '\n', 'utf8');

      execSync('git add public/data/admin-vault.json', {
        cwd: REPO_DIR,
        env: { ...process.env, PATH: ENV_PATH },
      });
      execSync('git commit -m "chore(vault): initialize encrypted admin vault"', {
        cwd: REPO_DIR,
        env: { ...process.env, PATH: ENV_PATH },
      });
      execSync('git push origin main', {
        cwd: REPO_DIR,
        env: { ...process.env, PATH: ENV_PATH },
      });

      console.log('Vault encrypted and saved to public/data/admin-vault.json (0 plaintext secrets).');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          ok: true,
          message:
            'Your Admin Login is encrypted and deployed! Wait ~30 seconds for GitHub Pages to refresh, then sign in at https://homayounmb.github.io/#admin.',
        })
      );

      setTimeout(() => {
        server.close(() => process.exit(0));
      }, 3000);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Setup failed' }));
    }
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Setup page listening at http://127.0.0.1:${PORT}`);
});
