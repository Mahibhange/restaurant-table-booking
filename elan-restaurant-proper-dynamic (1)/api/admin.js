const { db, validSession, makeSession, cookie } = require('./_db');

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'POST' && req.url.split('?')[0] === '/api/admin') {
      const { action, password } = req.body || {};
      if (action === 'login') {
        if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Incorrect password.' });
        res.setHeader('Set-Cookie', cookie(makeSession()));
        return res.status(200).json({ ok: true });
      }
      if (action === 'logout') {
        res.setHeader('Set-Cookie', 'elan_admin=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
        return res.status(200).json({ ok: true });
      }
    }
    if (!validSession(req)) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'GET') {
      const [menu, requests] = await Promise.all([
        db('menu_items?select=*&order=category.asc,sort_order.asc,name.asc'),
        db('requests?select=*&order=created_at.desc')
      ]);
      return res.status(200).json({ menu, requests });
    }
    if (req.method === 'PUT') {
      const body = req.body || {};
      if (body.kind === 'menu') {
        await db('menu_items?id=eq.' + encodeURIComponent(body.id), { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ category: body.category, name: body.name, description: body.description, price: Number(body.price), sort_order: Number(body.sort_order || 0) }) });
        return res.status(200).json({ ok: true });
      }
      if (body.kind === 'request') {
        await db('requests?id=eq.' + encodeURIComponent(body.id), { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ status: body.status }) });
        return res.status(200).json({ ok: true });
      }
    }
    if (req.method === 'POST' && req.body?.kind === 'menu') {
      const body = req.body;
      const rows = await db('menu_items', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ category: body.category || 'Mains', name: body.name || 'New dish', description: body.description || '', price: Number(body.price || 0), sort_order: Number(body.sort_order || 999) }) });
      return res.status(201).json(rows[0]);
    }
    if (req.method === 'DELETE') {
      const id = encodeURIComponent(req.body?.id || '');
      await db('menu_items?id=eq.' + id, { method: 'DELETE' });
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) { return res.status(500).json({ error: e.message || 'Server error' }); }
};
