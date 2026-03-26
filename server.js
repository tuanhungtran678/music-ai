const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 8080;
const ROOT = __dirname;

const users = new Map();
const tokens = new Map();
const generatedTracks = new Map();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function sendJson(res, code, payload) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) reject(new Error('Payload too large'));
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function authUser(req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return null;
  const username = tokens.get(token);
  if (!username) return null;
  return users.get(username) || null;
}

function writeWavHeader(view, sampleCount, sampleRate) {
  const byteRate = sampleRate * 2;
  const blockAlign = 2;

  function writeStr(offset, str) {
    for (let i = 0; i < str.length; i += 1) view.writeUInt8(str.charCodeAt(i), offset + i);
  }

  writeStr(0, 'RIFF');
  view.writeUInt32LE(36 + sampleCount * 2, 4);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.writeUInt32LE(16, 16);
  view.writeUInt16LE(1, 20);
  view.writeUInt16LE(1, 22);
  view.writeUInt32LE(sampleRate, 24);
  view.writeUInt32LE(byteRate, 28);
  view.writeUInt16LE(blockAlign, 32);
  view.writeUInt16LE(16, 34);
  writeStr(36, 'data');
  view.writeUInt32LE(sampleCount * 2, 40);
}

function synthesizeTrack(seedText) {
  const hash = crypto.createHash('sha256').update(seedText).digest();
  const sampleRate = 22050;
  const seconds = 7;
  const sampleCount = sampleRate * seconds;

  const buffer = Buffer.alloc(44 + sampleCount * 2);
  writeWavHeader(buffer, sampleCount, sampleRate);

  const baseFreq = 180 + (hash[0] % 120);
  const bassFreq = 60 + (hash[1] % 50);
  const leadFactor = 1.5 + (hash[2] % 4) * 0.25;

  for (let i = 0; i < sampleCount; i += 1) {
    const t = i / sampleRate;
    const section = Math.floor(t / 1.75) % 4;
    const chordShift = [0, 3, 7, 10][section];
    const freq = baseFreq * Math.pow(2, chordShift / 12);

    const kick = Math.sin(2 * Math.PI * bassFreq * t) * Math.exp(-(t * 4) % 1.2);
    const lead = Math.sin(2 * Math.PI * freq * t) * 0.5;
    const pad = Math.sin(2 * Math.PI * freq * leadFactor * t) * 0.25;

    const envelope = Math.min(1, t * 2) * Math.max(0, 1 - t / seconds);
    const sample = Math.max(-1, Math.min(1, (kick * 0.35 + lead + pad) * envelope));
    buffer.writeInt16LE(Math.floor(sample * 32767), 44 + i * 2);
  }

  return buffer;
}

function serveStatic(req, res) {
  const reqPath = req.url === '/' ? '/index.html' : decodeURIComponent(req.url.split('?')[0]);
  const filePath = path.resolve(ROOT, `.${reqPath}`);

  if (!(filePath === ROOT || filePath.startsWith(`${ROOT}${path.sep}`))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath);
    const types = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8'
    };

    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url.startsWith('/api/audio/')) {
      const id = req.url.split('/api/audio/')[1]?.split('?')[0];
      const track = generatedTracks.get(id);
      if (!track) return sendJson(res, 404, { error: 'Track not found.' });

      res.writeHead(200, {
        'Content-Type': 'audio/wav',
        'Cache-Control': 'no-store'
      });
      res.end(track.buffer);
      return;
    }

    if (req.method === 'POST' && req.url === '/api/register') {
      const body = await parseBody(req);
      const username = String(body.username || '').trim().toLowerCase();
      const password = String(body.password || '').trim();
      if (!username || !password) return sendJson(res, 400, { error: 'Username and password are required.' });
      if (users.has(username)) return sendJson(res, 409, { error: 'Username already exists.' });

      users.set(username, { username, passwordHash: hashPassword(password), published: [] });
      return sendJson(res, 201, { message: 'Registered successfully.' });
    }

    if (req.method === 'POST' && req.url === '/api/login') {
      const body = await parseBody(req);
      const username = String(body.username || '').trim().toLowerCase();
      const password = String(body.password || '').trim();
      const user = users.get(username);
      if (!user || user.passwordHash !== hashPassword(password)) {
        return sendJson(res, 401, { error: 'Invalid username or password.' });
      }

      const token = crypto.randomBytes(24).toString('hex');
      tokens.set(token, username);
      return sendJson(res, 200, { token, username });
    }

    if (req.method === 'GET' && req.url === '/api/me') {
      const user = authUser(req);
      if (!user) return sendJson(res, 401, { error: 'Unauthorized.' });
      return sendJson(res, 200, { username: user.username });
    }

    if (req.method === 'POST' && req.url === '/api/generate') {
      const user = authUser(req);
      if (!user) return sendJson(res, 401, { error: 'Please login first.' });

      const body = await parseBody(req);
      if (body.model === 'v1.0 Pro') return sendJson(res, 403, { error: 'Upgrade to Pro to use this model.' });

      const title = `AI Track ${Math.floor(Math.random() * 9999)}`;
      const id = crypto.randomBytes(10).toString('hex');
      const seedText = `${body.prompt || ''}|${body.genre || ''}|${body.mood || ''}|${body.duration || ''}|${Date.now()}`;
      const audioBuffer = synthesizeTrack(seedText);

      generatedTracks.set(id, { id, title, buffer: audioBuffer, createdAt: Date.now() });

      if (generatedTracks.size > 100) {
        const oldestKey = [...generatedTracks.entries()].sort((a, b) => a[1].createdAt - b[1].createdAt)[0][0];
        generatedTracks.delete(oldestKey);
      }

      return sendJson(res, 200, {
        track: {
          title,
          url: `/api/audio/${id}`,
          genre: body.genre || 'Lo-fi',
          mood: body.mood || 'Relaxed',
          duration: body.duration || '60 seconds',
          model: body.model || 'v1.0',
          description: body.prompt || ''
        }
      });
    }

    if (req.method === 'POST' && req.url === '/api/publish') {
      const user = authUser(req);
      if (!user) return sendJson(res, 401, { error: 'Please login first.' });

      const body = await parseBody(req);
      if (!body.title || !body.url) return sendJson(res, 400, { error: 'Missing track data.' });

      const item = { title: body.title, url: body.url, publishedAt: new Date().toISOString() };
      user.published.unshift(item);
      return sendJson(res, 201, { message: 'Published successfully.', item });
    }

    if (req.method === 'GET' && req.url === '/api/published') {
      const user = authUser(req);
      if (!user) return sendJson(res, 401, { error: 'Please login first.' });
      return sendJson(res, 200, { items: user.published });
    }

    serveStatic(req, res);
  } catch (error) {
    sendJson(res, 500, { error: error.message || 'Server error.' });
  }
});

server.listen(PORT, () => {
  console.log(`AI Music Studio server running at http://localhost:${PORT}`);
});
