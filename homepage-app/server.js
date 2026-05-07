// Minimal Node static server.
// Serves dist/, falls back to index.html for SPA routes, exposes /health.
// No npm dependencies — uses only the Node stdlib so the image stays tiny.

const http = require('http');
const fs   = require('fs');
const path = require('path');
const { promisify } = require('util');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const DIST = path.join(__dirname, 'dist');

const MIME = {
  '.html':  'text/html; charset=utf-8',
  '.js':    'application/javascript; charset=utf-8',
  '.css':   'text/css; charset=utf-8',
  '.svg':   'image/svg+xml',
  '.png':   'image/png',
  '.jpg':   'image/jpeg',
  '.jpeg':  'image/jpeg',
  '.webp':  'image/webp',
  '.json':  'application/json',
  '.ico':   'image/x-icon',
  '.woff':  'font/woff',
  '.woff2': 'font/woff2',
};

const stat     = promisify(fs.stat);
const readFile = promisify(fs.readFile);

async function send(res, filePath, statusCode = 200) {
  const ext = path.extname(filePath).toLowerCase();
  const body = await readFile(filePath);
  res.writeHead(statusCode, {
    'Content-Type':  MIME[ext] || 'application/octet-stream',
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400',
  });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  try {
    // ── Health probe (Docker / Portainer) ────────────────────────────────
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('ok\n');
      return;
    }

    // ── Static + SPA fallback ────────────────────────────────────────────
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath === '/') urlPath = '/index.html';

    const filePath = path.join(DIST, urlPath);

    // Path-traversal guard: resolved path must stay inside DIST
    if (!filePath.startsWith(DIST + path.sep) && filePath !== DIST) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    try {
      const s = await stat(filePath);
      if (s.isFile()) {
        await send(res, filePath);
        return;
      }
    } catch {
      // fall through to SPA index
    }

    await send(res, path.join(DIST, 'index.html'));
  } catch (err) {
    console.error('[server]', err);
    res.writeHead(500);
    res.end('Server error');
  }
});

server.listen(PORT, () => {
  console.log(`Homepage listening on :${PORT}`);
});
