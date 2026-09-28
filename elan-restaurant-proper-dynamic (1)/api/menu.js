const { db } = require('./_db');
module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const menu = await db('menu_items?select=*&order=category.asc,sort_order.asc,name.asc');
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=120');
    return res.status(200).json(menu);
  } catch (e) { return res.status(500).json({ error: e.message || 'Unable to load menu' }); }
};
