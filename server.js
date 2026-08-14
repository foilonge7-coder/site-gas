import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ─── ROTA ZUCK PAY ────────────────────────────────────────────────────────────
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

    const clientId     = 'foilonge7_6853925449';
    const clientSecret = '3fcfdadd82ede5462ca4672aa2c0695e164101209d7e303890278dbc0fbf7855';
    const authHeader   = 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    // Sanitiza telefone — remove tudo que não é dígito, garante 10-11 dígitos
    const digits = String(data.phone || '').replace(/\D/g, '');
    const telefone = (digits.length >= 10 && digits.length <= 11) ? digits : '11999998888';

    const zuckRes = await fetch('https://zuckpay.com.br/conta/v3/pix/qrcode', {
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

    const zuckData = await zuckRes.json();

    res.json({
      transactionId: zuckData.transactionId || '',
      status:        zuckData.status || '',
      amount:        zuckData.amount || numericAmount,
      pix_code:      zuckData.pix_code  || zuckData.qrcode || '',
      qrcode:        zuckData.qrcode    || zuckData.pix_code || '',
      qrcode_image:  zuckData.qrcode_image  || '',
      checkout_url:  zuckData.checkout_url  || '',
    });

  } catch (err) {
    console.error('[ZuckPay] Erro:', err?.message);
    res.status(500).json({ error: err?.message || 'Erro ao gerar PIX' });
  }
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
