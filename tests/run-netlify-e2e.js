const fetchImport = async () => { try { return global.fetch || (await import('node-fetch')).default; } catch(e){ return global.fetch; } };

(async () => {
  const fetch = await fetchImport();
  const base = 'https://distribuidora-gas-agua.netlify.app';
  try {
    const res = await fetch(base + '/api/create-pix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: 'R$ 86,90', customerName: 'Teste Netlify', phone: '11999998888' }),
    });
    const txt = await res.text();
    let data;
    try { data = JSON.parse(txt); } catch (e) { console.log('CREATE RAW:', txt); return; }
    console.log('CREATE', res.status, JSON.stringify(data));
    if (!data.transactionId) { console.log('No transactionId returned'); return; }
    const txid = data.transactionId;

    const wb = await fetch(base + '/api/zuck-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId: txid, status: 'PAID' }),
    });
    const wbtxt = await wb.text();
    console.log('WEBHOOK', wb.status, wbtxt);

    const q = await fetch(base + '/api/tx/' + txid);
    const qtxt = await q.text();
    console.log('QUERY', q.status, qtxt);

  } catch (err) {
    console.error('ERR', err.message || err);
  }
})();
