const amounts = [5.0, 10.0, 19.9, 29.99, 100.0];
const fetch = global.fetch || (await import('node-fetch')).default;

async function runTests() {
  const url = process.env.TEST_API_URL || 'http://localhost:3001/api/create-pix';
  console.log('Usando endpoint:', url);

  for (const amount of amounts) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: `R$ ${amount.toFixed(2)}`, customerName: 'Teste', phone: '11999998888' }),
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { raw: text }; }

      console.log('\n== Teste R$ ' + amount.toFixed(2) + ' ==');
      console.log('Status:', res.status);
      console.log('Resposta:', data);
    } catch (err) {
      console.error('Erro no teste R$ ' + amount.toFixed(2) + ':', err.message);
    }
  }
}

runTests();
