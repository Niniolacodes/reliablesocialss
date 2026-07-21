const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const mysql = require('mysql2/promise');

const rootDir = __dirname;
const dataDir = path.join(rootDir, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

function loadEnvFile() {
  const envPath = path.join(rootDir, '.env');
  if (!fs.existsSync(envPath)) return;
  fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return;
    const index = trimmed.indexOf('=');
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (key && process.env[key] === undefined) process.env[key] = value;
  });
}

loadEnvFile();

const defaultContent = {
  hero: {
    title: 'Reliable Socials',
    subtitle: 'Grow faster, spend less, and manage your digital boost from one sharp dashboard.',
    cta: 'Create Account',
  },
  sections: [
    {
      id: 'benefits',
      intro: 'Join over 200,000 satisfied customers who enjoy our service!',
      heading: 'Exclusive Benefits of<br />Using Reliable Socials',
      items: [
        { title: 'Instant Transactions', description: 'Buy with ease, deposit instantly. Get what you need in seconds - fast.' },
        { title: 'Most Affordable in the Market', description: 'Affordable prices guaranteed - no one can match us.' },
        { title: 'Guaranteed Security', description: 'Your security, our priority - guaranteed protection for every transaction.' },
      ],
    },
  ],
};

function sendJson(res, code, payload) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function serveStatic(req, res) {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  let requestPath = reqUrl.pathname;
  if (requestPath === '/' || requestPath === '') requestPath = '/index.html';
  const safePath = path.normalize(decodeURIComponent(requestPath)).replace(/^(|\/)/, '');
  const filePath = path.join(rootDir, safePath);
  if (!filePath.startsWith(rootDir)) {
    sendJson(res, 403, { success: false, error: 'Forbidden' });
    return;
  }
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
    };
    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
    res.end(fs.readFileSync(filePath));
    return;
  }
  sendJson(res, 404, { success: false, error: 'Not found' });
}

async function callVtuGate(endpoint, payload) {
  const apiKey = process.env.VTUGATE_API_KEY;
  const baseUrl = (process.env.VTUGATE_API_BASE_URL || 'https://api.vtugate.com').replace(/\/+$/, '');
  if (!apiKey) {
    return {
      ok: false,
      status: 500,
      data: { success: false, error: 'VTUGATE_API_KEY is not configured.' },
    };
  }

  const body = new URLSearchParams();
  body.set('api_key', apiKey);
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') body.set(key, String(value));
  });

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${apiKey}`,
        'X-API-Key': apiKey,
      },
      body,
    });
    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }
    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    return {
      ok: false,
      status: 502,
      data: { success: false, error: 'Unable to reach VTUGATE right now.' },
    };
  }
}

function isProviderSuccess(data) {
  const text = JSON.stringify(data || {}).toLowerCase();
  return text.includes('success') && !text.includes('insufficient') && !text.includes('invalid') && !text.includes('fail');
}

function normalizePhone(value) {
  const cleaned = String(value || '').replace(/[\s-]/g, '');
  if (cleaned.startsWith('+234')) return `0${cleaned.slice(4)}`;
  if (cleaned.startsWith('234')) return `0${cleaned.slice(3)}`;
  return cleaned;
}

let dbConnection = null;
let dbError = null;

async function ensureDb() {
  if (dbConnection) return dbConnection;

  const dbName = process.env.MYSQL_DATABASE || 'reliablesocials';
  const adminConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    connectTimeout: 10000,
  };

  try {
    const connection = await mysql.createConnection(adminConfig);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.end();

    const appConnection = await mysql.createConnection({
      ...adminConfig,
      database: dbName,
      connectTimeout: 10000,
    });
    await appConnection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        phone VARCHAR(50) DEFAULT '',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await appConnection.query(`
      CREATE TABLE IF NOT EXISTS content_blocks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(100) NOT NULL UNIQUE,
        payload JSON NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    dbConnection = appConnection;
    return appConnection;
  } catch (error) {
    dbError = error;
    throw error;
  }
}

function normalizeContent(payload) {
  const content = payload && typeof payload === 'object' ? payload : {};
  const hero = content.hero && typeof content.hero === 'object' ? content.hero : {};
  const sections = Array.isArray(content.sections) ? content.sections : [];
  return {
    hero: {
      title: String(hero.title || defaultContent.hero.title),
      subtitle: String(hero.subtitle || defaultContent.hero.subtitle),
      cta: String(hero.cta || defaultContent.hero.cta),
    },
    sections: sections.map((section) => ({
      id: String(section.id || 'benefits'),
      intro: String(section.intro || ''),
      heading: String(section.heading || ''),
      items: Array.isArray(section.items)
        ? section.items.map((item) => ({
            title: String(item.title || ''),
            description: String(item.description || ''),
          }))
        : [],
    })),
  };
}

async function getContentPayload() {
  try {
    const connection = await ensureDb();
    const [rows] = await connection.query('SELECT payload FROM content_blocks WHERE slug = ? LIMIT 1', ['home_content']);
    if (rows.length) {
      return normalizeContent(JSON.parse(rows[0].payload));
    }
  } catch (error) {
    console.error('MySQL content error:', error.message);
  }
  return normalizeContent(defaultContent);
}

async function saveContentPayload(payload) {
  const normalized = normalizeContent(payload);
  try {
    const connection = await ensureDb();
    await connection.query(
      'INSERT INTO content_blocks (slug, payload) VALUES (?, ?) ON DUPLICATE KEY UPDATE payload = VALUES(payload), updatedAt = CURRENT_TIMESTAMP',
      ['home_content', JSON.stringify(normalized)]
    );
    return normalized;
  } catch (error) {
    console.error('MySQL content save error:', error.message);
    throw error;
  }
}

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  const { pathname } = reqUrl;

  if (pathname === '/api/auth/register') {
    try {
      const payload = await readBody(req);
      const email = String(payload.email || '').trim().toLowerCase();
      const password = String(payload.password || '');
      const firstName = String(payload.firstName || '').trim();
      const lastName = String(payload.lastName || '').trim();
      const phone = String(payload.phone || '').trim();
      if (!email || !password || !firstName || !lastName) {
        return sendJson(res, 400, { success: false, error: 'Please complete all required fields.' });
      }
      const connection = await ensureDb();
      const [existing] = await connection.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
      if (existing.length) {
        return sendJson(res, 409, { success: false, error: 'An account with this email already exists.' });
      }
      const [result] = await connection.query(
        'INSERT INTO users (email, password, firstName, lastName, phone) VALUES (?, ?, ?, ?, ?)',
        [email, password, firstName, lastName, phone]
      );
      return sendJson(res, 201, {
        success: true,
        user: { id: result.insertId, email, firstName, lastName, phone },
      });
    } catch (error) {
      console.error('Register error:', error.message);
      return sendJson(res, 503, { success: false, error: 'MySQL database unavailable. Configure MYSQL_HOST / MYSQL_USER / MYSQL_PASSWORD.' });
    }
  }

  if (pathname === '/api/auth/login') {
    try {
      const payload = await readBody(req);
      const email = String(payload.email || '').trim().toLowerCase();
      const password = String(payload.password || '');
      const connection = await ensureDb();
      const [rows] = await connection.query('SELECT id, email, password, firstName, lastName, phone FROM users WHERE email = ? LIMIT 1', [email]);
      const user = rows[0];
      if (!user || user.password !== password) {
        return sendJson(res, 401, { success: false, error: 'Username or password is wrong.' });
      }
      return sendJson(res, 200, {
        success: true,
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, phone: user.phone },
      });
    } catch (error) {
      console.error('Login error:', error.message);
      return sendJson(res, 503, { success: false, error: 'MySQL database unavailable. Configure MYSQL_HOST / MYSQL_USER / MYSQL_PASSWORD.' });
    }
  }

  if (pathname === '/api/content') {
    if (req.method === 'PUT') {
      readBody(req)
        .then(async (payload) => {
          try {
            const content = await saveContentPayload(payload);
            return sendJson(res, 200, { success: true, content });
          } catch (error) {
            return sendJson(res, 503, { success: false, error: 'Unable to save content to MySQL.' });
          }
        })
        .catch(() => sendJson(res, 400, { success: false, error: 'Invalid request body.' }));
      return;
    }
    if (req.method === 'GET' || req.method === 'HEAD') {
      getContentPayload().then((content) => sendJson(res, 200, content)).catch(() => sendJson(res, 503, { success: false, error: 'Unable to load content from MySQL.' }));
      return;
    }
  }

  if (pathname === '/api/vtu/buy-data' && req.method === 'POST') {
    try {
      const payload = await readBody(req);
      const network = String(payload.network || '').trim();
      const dataType = String(payload.dataType || '').trim();
      const phone = normalizePhone(payload.phone);
      const productCode = String(payload.productCode || payload.planId || '').trim();
      const amount = Number(payload.amount || 0);

      if (!network || !dataType || !productCode || !amount) {
        return sendJson(res, 400, { success: false, error: 'Network, data type, plan, and amount are required.' });
      }
      if (!/^0[789][01]\d{8}$/.test(phone)) {
        return sendJson(res, 400, { success: false, error: 'Enter a valid Nigerian phone number.' });
      }

      const provider = await callVtuGate('/api/v1/buydata', {
        network,
        data_type: dataType,
        phone,
        product_code: productCode,
        amount,
      });
      const success = provider.ok && isProviderSuccess(provider.data);
      return sendJson(res, success ? 200 : provider.status, {
        success,
        error: success ? undefined : provider.data?.error || provider.data?.message || 'VTUGATE could not complete this data purchase.',
        provider: provider.data,
      });
    } catch (error) {
      return sendJson(res, 400, { success: false, error: 'Invalid request body.' });
    }
  }

  if (pathname === '/api/vtu/buy-airtime' && req.method === 'POST') {
    try {
      const payload = await readBody(req);
      const network = String(payload.network || '').trim();
      const phone = normalizePhone(payload.phone);
      const amount = Number(payload.amount || 0);

      if (!network || amount < 50) {
        return sendJson(res, 400, { success: false, error: 'Network and an airtime amount of at least ₦50 are required.' });
      }
      if (!/^0[789][01]\d{8}$/.test(phone)) {
        return sendJson(res, 400, { success: false, error: 'Enter a valid Nigerian phone number.' });
      }

      const provider = await callVtuGate('/api/v1/buyairtime', { network, phone, amount });
      const success = provider.ok && isProviderSuccess(provider.data);
      return sendJson(res, success ? 200 : provider.status, {
        success,
        error: success ? undefined : provider.data?.error || provider.data?.message || 'VTUGATE could not complete this airtime purchase.',
        provider: provider.data,
      });
    } catch (error) {
      return sendJson(res, 400, { success: false, error: 'Invalid request body.' });
    }
  }

  if (pathname === '/api/health') {
    return sendJson(res, 200, { success: true, status: 'ok', mysql: !!dbConnection });
  }

  if (req.method === 'GET' || req.method === 'HEAD') {
    return serveStatic(req, res);
  }

  return sendJson(res, 404, { success: false, error: 'Not found' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Reliable Socials server running on http://localhost:${PORT}`);
  console.log('MySQL config:', {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'root',
    database: process.env.MYSQL_DATABASE || 'reliablesocials',
  });
});
