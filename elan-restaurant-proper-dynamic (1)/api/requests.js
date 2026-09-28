const { db } = require('./_db');
module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const b = req.body || {};
    if (!b.type || !b.name || !b.phone) return res.status(400).json({ error: 'Name, phone and request type are required.' });
    const row = { id: b.id, type: b.type, name: b.name, phone: b.phone, email: b.email || '', date: b.date || null, time: b.time || null, guests: b.guests ? Number(b.guests) : null, notes: b.notes || '', message: b.message || '', status: 'Pending' };
    const saved = await db('requests', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(row) });
    return res.status(201).json({ saved: true, item: saved[0] });
  } catch (e) { return res.status(500).json({ error: e.message || 'Unable to save request' }); }
};
