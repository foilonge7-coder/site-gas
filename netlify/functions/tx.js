export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const id = (event.queryStringParameters && event.queryStringParameters.id) || '';
    if (!id) return { statusCode: 400, body: JSON.stringify({ error: 'id query param required' }) };

    const SUPABASE_URL = process.env.SUPABASE_URL || '';
    const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
    if (SUPABASE_URL && SUPABASE_KEY) {
      const url = `${SUPABASE_URL}/rest/v1/transactions?transactionId=eq.${encodeURIComponent(id)}`;
      const res = await fetch(url, { method: 'GET', headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
      const text = await res.text().catch(() => '');
      return { statusCode: res.status, headers: { 'Content-Type': 'application/json' }, body: text };
    }

    // fallback: read local file
    try {
      const fs = require('fs');
      const fsp = fs.promises;
      const dataDir = new URL('./data', import.meta.url).pathname;
      const filePath = dataDir + '/transactions.json';
      let arr = [];
      try { const txt = await fsp.readFile(filePath, 'utf8'); arr = JSON.parse(txt || '[]'); } catch(e) { arr = []; }
      const found = arr.filter(x => x.transactionId === id);
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(found) };
    } catch (e) {
      return { statusCode: 500, body: JSON.stringify({ error: err?.message || 'file read error' }) };
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err?.message || 'Query error' }) };
  }
}
