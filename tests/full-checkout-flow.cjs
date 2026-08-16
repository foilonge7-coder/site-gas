const fs = require('fs').promises;
const path = require('path');
const fetchImport = async () => { try { return global.fetch || (await import('node-fetch')).default; } catch(e){ return global.fetch; } };

(async () => {
  const client = await fetchImport();
  const url = process.env.TEST_API_URL || 'http://localhost:3001/api/create-pix';
  const webhookUrl = 'http://localhost:3001/api/zuck-webhook';
  const webhookSecret = process.env.ZUCK_WEBHOOK_SECRET || '';
  const txQuery = (id) => `http://localhost:3001/api/tx/${id}`;

  const tests = [86.9, 5.0, 19.9];
  console.log('Running full checkout flow tests for values:', tests);

  for (const amount of tests) {
    try {
      const body = { price: `R$ ${amount.toFixed(2)}`, customerName: 'Cliente Teste', phone: '11999998888' };
      const res = await client(url, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { raw: text }; }
      console.log('\n== Created checkout R$' + amount + ' ==');
      console.log('Status:', res.status);
      console.log('Response:', data);

      if (res.status !== 200) continue;
      const txId = data.transactionId || data.transaction_id || null;
      if (!txId) continue;

      // download qrcode_image if exists
      if (data.qrcode_image) {
        try {
          const imgRes = await client(data.qrcode_image);
          const arrayBuffer = await imgRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const outDir = path.join(__dirname, '..', 'tmp_qr');
          await fs.mkdir(outDir, { recursive: true });
          const filePath = path.join(outDir, `qr_${txId}.png`);
          await fs.writeFile(filePath, buffer);
          console.log('Saved QR image to', filePath);
        } catch (err) {
          console.error('Failed to download QR image:', err.message);
        }
      }

      // simulate webhook to mark as PAID
      try {
        const webhookBody = JSON.stringify({ transactionId: txId, status: 'PAID' });
        const headers = { 'Content-Type': 'application/json' };
        if (webhookSecret) {
          const crypto = require('crypto');
          headers['x-zuck-signature'] = crypto.createHmac('sha256', webhookSecret).update(webhookBody).digest('hex');
        }
        const wb = await client(webhookUrl, { method: 'POST', headers, body: webhookBody });
        const wbText = await wb.text();
        console.log('Webhook simulated, status:', wb.status, 'response:', wbText);
      } catch (err) {
        console.error('Webhook POST failed:', err.message);
      }

      // query transaction
      try {
        const q = await client(txQuery(txId));
        const qText = await q.text();
        console.log('Queried transaction:', q.status, qText);
      } catch (err) {
        console.error('Query tx failed:', err.message);
      }

    } catch (err) {
      console.error('Error in test flow:', err.message);
    }
  }
})();
