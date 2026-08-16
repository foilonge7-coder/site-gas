const fetchImport = async () => { try { return global.fetch || (await import('node-fetch')).default; } catch(e){ return global.fetch; } };

(async () => {
  const fetch = await fetchImport();
  const url = process.env.TEST_API_URL || 'http://localhost:3001/api/create-pix';
  const body = { price: 'R$ 86,90', customerName: 'Validador', phone: '11999998888' };
  try {
    const res = await fetch(url, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { console.error('Invalid JSON from create-pix:', text); return; }
    console.log('Received:', data.transactionId, 'status', data.status);
    const q = data.qrcode || data.pix_code || '';
    const checkout = data.checkout_url || '';
    console.log('checkout_url:', checkout);
    console.log('qrcode raw:', q);
    if (!q) { console.error('No qrcode present'); return; }

    // Validate EMV CRC16: find trailing '63' tag (CRC) — typically '6304' + 4 hex chars
    const idx = q.indexOf('6304');
    if (idx === -1) { console.error('CRC tag (6304) not found in qrcode'); return; }
    const payload = q.substring(0, idx + 4); // include '6304'
    const givenCrc = q.substring(idx + 4).toUpperCase();
    console.log('Given CRC:', givenCrc);

    // compute CRC16/CCITT-FALSE
    function crc16ccitt(str) {
      let crc = 0xFFFF;
      for (let i = 0; i < str.length; i++) {
        crc ^= str.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
          if ((crc & 0x8000) !== 0) crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
          else crc = (crc << 1) & 0xFFFF;
        }
      }
      return crc.toString(16).toUpperCase().padStart(4, '0');
    }

    const computed = crc16ccitt(payload);
    console.log('Computed CRC:', computed);
    if (computed === givenCrc) console.log('CRC VALID'); else console.log('CRC MISMATCH');

  } catch (err) {
    console.error('Error validating qrcode:', err.message || err);
  }
})();
