export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-zuck-signature',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const body = JSON.parse(event.body || '{}');
    const secret = process.env.ZUCK_WEBHOOK_SECRET || '';

    if (secret) {
      const sig = (event.headers['x-zuck-signature'] || event.headers['X-Zuck-Signature'] || '');
      if (!sig) return { statusCode: 401, body: JSON.stringify({ error: 'Missing signature' }) };
      const crypto = require('crypto');
      const expected = crypto.createHmac('sha256', secret).update(event.body || '').digest('hex');
      if (sig !== expected) return { statusCode: 401, body: JSON.stringify({ error: 'Invalid signature' }) };
    }

    const { transactionId, status } = body || {};
    if (!transactionId) return { statusCode: 400, body: JSON.stringify({ error: 'transactionId required' }) };

    const SUPABASE_URL = process.env.SUPABASE_URL || '';
    const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
    const updateBody = { status: status || 'PAID', updatedAt: new Date().toISOString() };
    if (SUPABASE_URL && SUPABASE_KEY) {
      const url = `${SUPABASE_URL}/rest/v1/transactions?transactionId=eq.${encodeURIComponent(transactionId)}`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify(updateBody),
      });
      const text = await res.text().catch(() => '');
      return { statusCode: res.status, headers: { 'Content-Type': 'application/json' }, body: text };
    }

    // fallback: update local file
    try {
      const fs = require('fs');
      const fsp = fs.promises;
      const dataDir = new URL('./data', import.meta.url).pathname;
      await fsp.mkdir(dataDir, { recursive: true }).catch(() => null);
      const filePath = dataDir + '/transactions.json';
      let arr = [];
      try { const txt = await fsp.readFile(filePath, 'utf8'); arr = JSON.parse(txt || '[]'); } catch(e) { arr = []; }
      const idx = arr.findIndex((x) => x.transactionId === transactionId);
      if (idx !== -1) { arr[idx] = { ...arr[idx], ...updateBody }; }
      else { arr.push({ transactionId, status: updateBody.status, createdAt: new Date().toISOString(), updatedAt: updateBody.updatedAt }); }
      await fsp.writeFile(filePath, JSON.stringify(arr, null, 2), 'utf8');
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };
    } catch (e) {
      return { statusCode: 500, body: JSON.stringify({ error: 'file persistence error' }) };
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err?.message || 'Webhook error' }) };
  }
}
