import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Store created transactions in memory for testing/webhook simulation
const transactions = new Map();

// ─── ROTA PROMISSEPAY (substitui Zuck Pay) ────────────────────────────────────
app.post('/api/create-pix', async (req, res) => {
  try {
    const data = req.body || {};

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
    if (!clientId || !clientSecret) {
      console.error('Missing ZUCK_CLIENT_ID or ZUCK_CLIENT_SECRET in environment');
      return res.status(500).json({ error: 'Payment provider credentials not configured on server' });
    }
    const authHeader   = 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    // Sanitiza telefone — remove tudo que não é dígito, garante 10-11 dígitos
    const digits = String(data.phone || '').replace(/\D/g, '');
    const telefone = (digits.length >= 10 && digits.length <= 11) ? digits : '11999998888';

    let promisseRes;
    try {
      promisseRes = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valor: numericAmount,
          nome: data.customerName || 'Cliente',
          cpf: '12345678909',
          email: 'cliente@sitegas.com',
          telefone,
        }),
      });
    } catch (networkErr) {
      console.error('[PromissePay] Network error when calling API:', networkErr?.message || networkErr);
      return res.status(502).json({ error: 'Network error contacting PromissePay' });
    }

    const respText = await promisseRes.text().catch(() => '');
    let promisseData = {};
    try {
      promisseData = JSON.parse(respText || '{}');
    } catch (parseErr) {
      console.error('[PromissePay] Invalid JSON response:', respText);
      return res.status(502).json({ error: 'Invalid response from PromissePay', raw: respText });
    }

    console.log('[ZuckPay] API status:', promisseRes.status);

    const tx = {
      transactionId: promisseData.transactionId || '',
      status:        promisseData.status || '',
      amount:        promisseData.amount || numericAmount,
      pix_code:      promisseData.pix_code  || promisseData.qrcode || '',
      qrcode:        promisseData.qrcode    || promisseData.pix_code || '',
      qrcode_image:  promisseData.qrcode_image  || '',
      checkout_url:  promisseData.checkout_url  || '',
      createdAt: Date.now(),
    };

    if (tx.transactionId) transactions.set(tx.transactionId, tx);

    res.json(tx);

  } catch (err) {
    console.error('[PromissePay] Erro:', err?.message);
    res.status(500).json({ error: err?.message || 'Erro ao gerar PIX' });
  }
});

// Endpoint para receber webhooks da PromissePay (ex.: notificações de pagamento)
app.post('/api/promissepay-webhook', express.json(), (req, res) => {
  try {
    const event = req.body || {};
    console.log('[PromissePay][Webhook] Recebido evento:', JSON.stringify(event));
    // Aqui você deve validar assinatura/secreto conforme a documentação da PromissePay
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('[PromissePay][Webhook] Erro ao processar webhook:', err?.message || err);
    res.status(500).json({ error: 'Webhook processing error' });
  }
});

// Simple webhook for Zuck/Promisse simulation: update transaction status
app.post('/api/zuck-webhook', express.json(), (req, res) => {
  try {
    const secret = process.env.ZUCK_WEBHOOK_SECRET || '';
    // If secret is configured, require HMAC-SHA256 signature in header 'x-zuck-signature'
    if (secret) {
      const sig = req.get('x-zuck-signature') || req.get('x-signature') || '';
      if (!sig) {
        console.warn('[Webhook] Missing signature header');
        return res.status(401).json({ error: 'Missing signature' });
      }
      const crypto = await import('crypto');
      const body = JSON.stringify(req.body || {});
      const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
      if (sig !== expected) {
        console.warn('[Webhook] Invalid signature', sig, expected);
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const { transactionId, status } = req.body || {};
    if (!transactionId) return res.status(400).json({ error: 'transactionId required' });
    const tx = transactions.get(transactionId);
    if (!tx) return res.status(404).json({ error: 'transaction not found' });
    tx.status = status || tx.status;
    tx.updatedAt = Date.now();
    transactions.set(transactionId, tx);
    console.log('[Webhook] Transaction updated:', transactionId, tx.status);
    return res.status(200).json({ ok: true, transaction: tx });
  } catch (err) {
    console.error('[Webhook] Error processing:', err?.message || err);
    return res.status(500).json({ error: 'webhook processing error' });
  }
});

// Query transaction by id (for tests)
app.get('/api/tx/:id', (req, res) => {
  const id = req.params.id;
  const tx = transactions.get(id);
  if (!tx) return res.status(404).json({ error: 'transaction not found' });
  return res.status(200).json(tx);
});

// ─── ARQUIVOS ESTÁTICOS DO BUILD ──────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback — qualquer rota desconhecida retorna o index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
