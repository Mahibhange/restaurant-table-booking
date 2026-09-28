const { createHmac, timingSafeEqual } = require('crypto');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');

async function db(path, options = {}) {
  const r = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const text = await r.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!r.ok) throw new Error(typeof data === 'string' ? data : JSON.stringify(data));
  return data;
}

function sign(value) {
  return createHmac('sha256', process.env.ADMIN_PASSWORD || '').update(value).digest('hex');
}
function makeSession() {
  const value = `${Date.now()}.${Math.random().toString(36).slice(2)}`;
  return `${value}.${sign(value)}`;
}
function validSession(req) {
  const raw = (req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith('elan_admin='));
  if (!raw) return false;
  const token = decodeURIComponent(raw.slice('elan_admin='.length));
  const parts = token.split('.');
  if (parts.length < 3) return false;
  const value = parts.slice(0, -1).join('.');
  const sig = parts.at(-1);
  const expected = sign(value);
  try { return timingSafeEqual(Buffer.from(sig), Buffer.from(expected)); } catch { return false; }
}
function cookie(session) {
  return `elan_admin=${encodeURIComponent(session)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`;
}
module.exports = { db, validSession, makeSession, cookie };
