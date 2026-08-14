import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function zuckPayPlugin(): Plugin {
  return {
    name: 'zuck-pay-plugin',
    configureServer(server) {
      server.middlewares.use('/api/create-pix', async (req, res) => {
        if (req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk: Buffer) => {
            bodyStr += chunk.toString('utf8');
          });
          req.on('end', async () => {
            try {
              console.log('[ZuckPay Plugin] Body recebido:', bodyStr);

              let data: any = {};
              try {
                data = JSON.parse(bodyStr || '{}');
              } catch {
                throw new Error('Body JSON inválido: ' + bodyStr);
              }

              // Sanitiza telefone — remove tudo que não é dígito, garante 10-11 dígitos
              const sanitizePhone = (raw: string) => {
                const digits = String(raw || '').replace(/\D/g, '');
                if (digits.length >= 10 && digits.length <= 11) return digits;
                return '11999998888'; // fallback válido
              };

              // Extrai valor numérico do preço. Ex: "R$ 118,69" -> 118.69
              let numericAmount = 10.00;
              if (data.price) {
                // Remove tudo que não é dígito ou vírgula/ponto
                const clean = String(data.price)
                  .replace(/[^\d,\.]/g, '')   // mantém apenas dígitos, vírgula e ponto
                  .replace(',', '.');           // troca vírgula por ponto
                const parsed = parseFloat(clean);
                if (!isNaN(parsed) && parsed > 0) {
                  numericAmount = parsed;
                }
              }

              console.log('[ZuckPay Plugin] Valor numérico:', numericAmount);

              const clientId = 'foilonge7_6853925449';
              const clientSecret = '3fcfdadd82ede5462ca4672aa2c0695e164101209d7e303890278dbc0fbf7855';
              const authHeader = 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

              const zuckPayload = {
                valor: numericAmount,
                nome: data.customerName || 'Cliente',
                cpf: '12345678909',
                email: 'cliente@sitegas.com',
                telefone: sanitizePhone(data.phone),
              };

              console.log('[ZuckPay Plugin] Enviando para ZuckPay:', JSON.stringify(zuckPayload));

              const zuckRes = await fetch('https://zuckpay.com.br/conta/v3/pix/qrcode', {
                method: 'POST',
                headers: {
                  'Authorization': authHeader,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(zuckPayload)
              });

              const zuckText = await zuckRes.text();
              console.log('[ZuckPay Plugin] Resposta raw ZuckPay (status', zuckRes.status, '):', zuckText);

              let zuckData: any = {};
              try {
                zuckData = JSON.parse(zuckText);
              } catch {
                throw new Error('Resposta inválida da ZuckPay: ' + zuckText);
              }

              // Garante que os campos principais estejam presentes
              const response = {
                transactionId: zuckData.transactionId || '',
                status: zuckData.status || '',
                amount: zuckData.amount || numericAmount,
                pix_code: zuckData.pix_code || zuckData.qrcode || '',
                qrcode: zuckData.qrcode || zuckData.pix_code || '',
                qrcode_image: zuckData.qrcode_image || '',
                checkout_url: zuckData.checkout_url || '',
              };

              console.log('[ZuckPay Plugin] Respondendo ao frontend:', JSON.stringify(response));

              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify(response));

            } catch (err: any) {
              console.error('[ZuckPay Plugin] ERRO:', err?.message);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err?.message || 'Erro ao gerar PIX' }));
            }
          });
        } else if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.statusCode = 204;
          res.end();
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), zuckPayPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
