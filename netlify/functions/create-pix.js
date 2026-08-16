export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body || '{}');

    // Extrai valor numérico. Ex: "R$ 118,69" -> 118.69
    let numericAmount = 10.00;
    if (data.price) {
      const clean = String(data.price).replace(/[^\d,.]/g, '').replace(',', '.');
      const parsed = parseFloat(clean);
      if (!isNaN(parsed) && parsed > 0) numericAmount = parsed;
    }

    const clientId     = process.env.ZUCK_CLIENT_ID || '';
    const clientSecret = process.env.ZUCK_CLIENT_SECRET || '';
    const apiUrl       = process.env.ZUCK_API_URL || 'https://zuckpay.com.br/conta/v3/pix/qrcode';
    if (!clientId || !clientSecret) return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Payment provider credentials not configured' }),
    };
    const authHeader   = 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    // Sanitiza telefone — remove tudo que não é dígito, garante 10-11 dígitos
    const digits = String(data.phone || '').replace(/\D/g, '');
    const telefone = (digits.length >= 10 && digits.length <= 11) ? digits : '11999998888';

    let promisseRes;
    try {
      promisseRes = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valor: numericAmount,
          nome: data.customerName || 'Cliente',
          cpf: '12345678909',
          email: 'cliente@sitegas.com',
          telefone,
        }),
      });
    } catch (networkErr) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Network error contacting ZuckPay' }),
      };
    }

    const text = await promisseRes.text().catch(() => '');
    let promisseData = {};
    try { promisseData = JSON.parse(text); } catch {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Invalid response from ZuckPay', raw: text }),
      };
    }

    const response = {
      transactionId: promisseData.transactionId || '',
      status:        promisseData.status || '',
      amount:        promisseData.amount || numericAmount,
      pix_code:      promisseData.pix_code     || promisseData.qrcode || '',
      qrcode:        promisseData.qrcode       || promisseData.pix_code || '',
      qrcode_image:  promisseData.qrcode_image || '',
      checkout_url:  promisseData.checkout_url || '',
    };

    // Persist transaction to Supabase if configured, otherwise fallback to local file (quick mode)
    try {
      const SUPABASE_URL = process.env.SUPABASE_URL || '';
      const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
      if (SUPABASE_URL && SUPABASE_KEY && response.transactionId) {
        const insertBody = {
          transactionId: response.transactionId,
          status: response.status || 'PENDING',
          amount: response.amount,
          pix_code: response.pix_code,
          qrcode: response.qrcode,
          qrcode_image: response.qrcode_image,
          checkout_url: response.checkout_url,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await fetch(`${SUPABASE_URL}/rest/v1/transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            Prefer: 'return=representation',
          },
          body: JSON.stringify(insertBody),
        }).catch(() => null);
      } else if (response.transactionId) {
        // fallback to local file storage (quick mode)
        try {
          const fs = await import('fs');
          const fsp = fs.promises;
          const dataDir = new URL('./data', import.meta.url).pathname;
          await fsp.mkdir(dataDir, { recursive: true }).catch(() => null);
          const filePath = dataDir + '/transactions.json';
          let arr = [];
          try {
            const txt = await fsp.readFile(filePath, 'utf8');
            arr = JSON.parse(txt || '[]');
          } catch (e) { arr = []; }
          arr.push({ ...response, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
          await fsp.writeFile(filePath, JSON.stringify(arr, null, 2), 'utf8');
        } catch (e) {
          // ignore file persistence errors
        }
      }
    } catch (e) {
      // ignore persistence errors
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(response),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err?.message || 'Erro ao gerar PIX' }),
    };
  }
}
