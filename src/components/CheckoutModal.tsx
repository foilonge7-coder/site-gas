import React, { useState, useEffect, useRef } from 'react';
import { ComboProduct } from '../types';
import { GAS_BRANDS, WATER_BRANDS } from '../data/products';

interface CheckoutModalProps {
  product: ComboProduct;
  onClose: () => void;
  userCity: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ product, onClose, userCity }) => {
  const [selectedGas, setSelectedGas] = useState<string>('');
  const [selectedWater, setSelectedWater] = useState<string>('');
  const [selectedWater2, setSelectedWater2] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [neighborhood, setNeighborhood] = useState<string>('');
  const [observations, setObservations] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro'>('pix');

  const [gasError, setGasError] = useState<boolean>(false);
  const [waterError, setWaterError] = useState<boolean>(false);
  const [water2Error, setWater2Error] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>('');

  const [isOrderComplete, setIsOrderComplete] = useState<boolean>(false);
  const [isCheckoutCreated, setIsCheckoutCreated] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [txStatus, setTxStatus] = useState<string>('');
  const pollingRef = useRef<number | null>(null);
  const [pixCopied, setPixCopied] = useState<boolean>(false);
  const [dynamicPixCode, setDynamicPixCode] = useState<string>('');
  const [dynamicQrImage, setDynamicQrImage] = useState<string>('');
  const [dynamicCheckoutUrl, setDynamicCheckoutUrl] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    let hasError = false;
    if (product.hasGas && !selectedGas) { setGasError(true); hasError = true; } else { setGasError(false); }
    if (product.hasWater && !selectedWater) { setWaterError(true); hasError = true; } else { setWaterError(false); }
    if (product.hasWater && product.waterQuantity && product.waterQuantity > 1 && !selectedWater2) {
      setWater2Error(true); hasError = true;
    } else { setWater2Error(false); }

    if (hasError) {
      alert('Por favor, selecione as marcas obrigatórias para continuar.');
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch('/api/create-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: product.currentPrice,
          customerName: customerName.trim() || 'Cliente',
          phone: phone.trim() || '11999998888',
          address: address.trim(),
          neighborhood: neighborhood.trim(),
          paymentMethod,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || `Erro HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log('[ZuckPay] Resposta:', data);

      const checkoutUrl: string = data.checkout_url || '';
      const pixCode: string = data.pix_code || data.qrcode || '';
      const qrImg: string = data.qrcode_image || '';
      const txId: string = data.transactionId || data.id || '';

      if (!checkoutUrl && !pixCode) {
        throw new Error('A Zuck Pay não retornou um link de pagamento. Verifique suas credenciais.');
      }

      setDynamicCheckoutUrl(checkoutUrl);
      setDynamicPixCode(pixCode);
      setDynamicQrImage(qrImg);
      if (txId) {
        setTransactionId(txId);
        setTxStatus('PENDING');
        setIsCheckoutCreated(true);
      } else {
        // fallback: mark as created so UI shows QR/checkout
        setIsCheckoutCreated(true);
      }

      // Abra o checkout em nova aba (não redireciona), assim o modal pode aguardar confirmação
      if (checkoutUrl) {
        try { window.open(checkoutUrl, '_blank'); } catch (e) { /* ignore */ }
      }
    } catch (err: any) {
      console.error('[ZuckPay] Erro:', err);
      setApiError(err?.message || 'Erro ao conectar com a Zuck Pay. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyPix = () => {
    navigator.clipboard.writeText(dynamicPixCode);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  };

  const paymentLabel = {
    pix: 'PIX',
    cartao_credito: 'Cartão de Crédito',
    cartao_debito: 'Cartão de Débito',
    dinheiro: 'Dinheiro',
  }[paymentMethod];

  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-xs overflow-y-auto flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-auto relative">

        {/* BOTÃO FECHAR */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 bg-slate-100 hover:bg-slate-200 text-slate-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Voltar"
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        {!isCheckoutCreated && !isOrderComplete ? (
          <div>
            {/* HEADER DO PRODUTO */}
            <div className="relative bg-slate-50 p-6 pt-12 border-b border-slate-100 text-center">
              <div className="w-28 h-28 mx-auto mb-2 relative">
                <img src={product.img} alt={product.title} className="w-full h-full object-contain" />
              </div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900">{product.title}</h1>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-[#006437] font-bold text-lg">Entrega Rápida • {product.currentPrice}</span>
                <span className="text-xs text-slate-400 line-through">{product.originalPrice}</span>
              </div>
              <p className="text-slate-500 text-xs mt-2 font-medium">
                Selecione as opções do seu pedido abaixo para entrega em {userCity}
              </p>
            </div>

            {/* FORMULÁRIO */}
            <form onSubmit={handleSubmit} className="p-5 md:p-7 space-y-6 max-h-[65vh] overflow-y-auto">

              {/* GÁS */}
              {product.hasGas && (
                <section className={`rounded-2xl border transition-all ${gasError ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200'}`}>
                  <div className="bg-slate-100 p-3.5 rounded-t-2xl flex justify-between items-center border-b border-slate-200">
                    <div>
                      <h2 className="font-bold text-slate-800 uppercase text-xs tracking-wider">
                        1. Escolha seu Gás {product.gasQuantity && product.gasQuantity > 1 ? '(1ª Unidade)' : ''}
                      </h2>
                      <p className="text-[11px] text-slate-500">Botijão de Gás 13kg Lacrado</p>
                    </div>
                    <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider">Obrigatório</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {GAS_BRANDS.map((item) => (
                      <label key={item.nome} className={`flex items-center justify-between p-3.5 cursor-pointer hover:bg-slate-50 transition-colors ${selectedGas === item.nome ? 'bg-blue-50/60' : ''}`}>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{item.nome}</p>
                          <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                        <input type="radio" name="gasBrand" value={item.nome} checked={selectedGas === item.nome}
                          onChange={() => { setSelectedGas(item.nome); setGasError(false); }}
                          className="w-5 h-5 accent-blue-600 cursor-pointer" />
                      </label>
                    ))}
                  </div>
                </section>
              )}

              {/* ÁGUA 1 */}
              {product.hasWater && (
                <section className={`rounded-2xl border transition-all ${waterError ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200'}`}>
                  <div className="bg-slate-100 p-3.5 rounded-t-2xl flex justify-between items-center border-b border-slate-200">
                    <div>
                      <h2 className="font-bold text-slate-800 uppercase text-xs tracking-wider">
                        {product.hasGas ? '2. Escolha sua Água 20L' : '1. Escolha sua Água 20L'}
                      </h2>
                      <p className="text-[11px] text-slate-500">Garrafão Lacrado 20 Litros</p>
                    </div>
                    <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider">Obrigatório</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                    {WATER_BRANDS.map((item) => (
                      <label key={item.nome} className={`flex items-center justify-between p-3.5 cursor-pointer hover:bg-slate-50 transition-colors ${selectedWater === item.nome ? 'bg-blue-50/60' : ''}`}>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{item.nome}</p>
                          <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                        <input type="radio" name="waterBrand" value={item.nome} checked={selectedWater === item.nome}
                          onChange={() => { setSelectedWater(item.nome); setWaterError(false); }}
                          className="w-5 h-5 accent-blue-600 cursor-pointer" />
                      </label>
                    ))}
                  </div>
                </section>
              )}

              {/* ÁGUA 2 */}
              {product.hasWater && product.waterQuantity && product.waterQuantity > 1 && (
                <section className={`rounded-2xl border transition-all ${water2Error ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200'}`}>
                  <div className="bg-slate-100 p-3.5 rounded-t-2xl flex justify-between items-center border-b border-slate-200">
                    <div>
                      <h2 className="font-bold text-slate-800 uppercase text-xs tracking-wider">
                        {product.hasGas ? '3. Escolha a 2ª Água 20L' : '2. Escolha a 2ª Água 20L'}
                      </h2>
                      <p className="text-[11px] text-slate-500">Segunda marca do garrafão</p>
                    </div>
                    <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider">Obrigatório</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                    {WATER_BRANDS.map((item) => (
                      <label key={`w2-${item.nome}`} className={`flex items-center justify-between p-3.5 cursor-pointer hover:bg-slate-50 transition-colors ${selectedWater2 === item.nome ? 'bg-blue-50/60' : ''}`}>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{item.nome}</p>
                          <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                        <input type="radio" name="waterBrand2" value={item.nome} checked={selectedWater2 === item.nome}
                          onChange={() => { setSelectedWater2(item.nome); setWater2Error(false); }}
                          className="w-5 h-5 accent-blue-600 cursor-pointer" />
                      </label>
                    ))}
                  </div>
                </section>
              )}

              {/* DADOS DE ENTREGA */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <i className="fas fa-truck text-blue-600"></i> Endereço de Entrega
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Seu Nome *</label>
                    <input type="text" required placeholder="Ex: João Silva" value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Telefone *</label>
                    <input type="tel" required placeholder="(11) 99999-8888" value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    {phone.length > 0 && phone.length < 10 && (
                      <p className="text-red-500 text-[10px] mt-0.5">Digite ao menos 10 dígitos com DDD</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Rua, Número e Comp. *</label>
                    <input type="text" required placeholder="Rua das Flores, 123 - Apt 4" value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Bairro *</label>
                    <input type="text" required placeholder="Bairro Central" value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              </div>

              {/* FORMA DE PAGAMENTO */}
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-3">
                <h3 className="font-black text-emerald-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <i className="fas fa-credit-card text-emerald-600 text-base"></i> Forma de Pagamento
                </h3>
                <div className="bg-emerald-600 text-white p-4 rounded-xl flex items-center gap-3 shadow-sm">
                  <i className="fas fa-bolt text-amber-300 text-lg"></i>
                  <div>
                    <p className="font-extrabold text-sm">PIX — Aprovação Imediata</p>
                    <p className="text-emerald-100 text-[11px]">Ative a promoção pagando via PIX</p>
                  </div>
                  <span className="ml-auto bg-white/20 text-white text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider whitespace-nowrap">
                    Selecionado
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 font-medium">
                  Após confirmar, você será redirecionado para o checkout seguro da PromissePay.
                </p>
              </div>

              {/* OBSERVAÇÕES */}
              <div>
                <h2 className="font-bold text-slate-800 mb-1.5 uppercase text-xs tracking-wider">Observações de Entrega</h2>
                <textarea className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={2} value={observations} onChange={(e) => setObservations(e.target.value)}
                  placeholder="Ex: Entregar no portão, avisar pelo WhatsApp ao chegar..."></textarea>
              </div>

              {/* ERRO DA API */}
              {apiError && (
                <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl p-3 text-xs font-medium">
                  <i className="fas fa-exclamation-circle mr-1"></i> {apiError}
                </div>
              )}

              {/* BOTÃO SUBMIT */}
              <div className="pt-2">
                <button type="submit" disabled={isProcessing}
                  className={`w-full text-white font-extrabold h-14 rounded-2xl flex justify-center items-center gap-3 px-8 transition-all shadow-lg cursor-pointer ${
                    isProcessing ? 'bg-slate-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 active:scale-[0.99]'
                  }`}>
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <span className="uppercase text-base tracking-wider">GERANDO PAGAMENTO...</span>
                    </>
                  ) : (
                    <span className="uppercase text-lg tracking-wider">CONFIRMAR PEDIDO</span>
                  )}
                </button>
              </div>
            </form>
          </div>

        ) : isOrderComplete ? (
          /* TELA DE PEDIDO CONFIRMADO */
          <div className="p-6 md:p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl animate-bounce">
              <i className="fas fa-check"></i>
            </div>

            <div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Pedido Recebido com Sucesso!
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">Sua entrega está a caminho!</h2>
              <p className="text-slate-600 text-sm mt-1">
                Tempo estimado de entrega: <b className="text-blue-700">15 a 25 minutos</b>
              </p>
            </div>

            {/* RESUMO */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between font-bold border-b border-slate-200 pb-2 text-slate-800">
                <span>Produto:</span><span>{product.title}</span>
              </div>
              {selectedGas && (
                <div className="flex justify-between text-slate-600">
                  <span>Gás Escolhido:</span><span className="font-bold text-slate-800">{selectedGas}</span>
                </div>
              )}
              {selectedWater && (
                <div className="flex justify-between text-slate-600">
                  <span>Água Escolhida:</span><span className="font-bold text-slate-800">{selectedWater}</span>
                </div>
              )}
              {selectedWater2 && (
                <div className="flex justify-between text-slate-600">
                  <span>2ª Água:</span><span className="font-bold text-slate-800">{selectedWater2}</span>
                </div>
              )}
              {customerName && (
                <div className="flex justify-between text-slate-600">
                  <span>Cliente:</span><span className="font-bold text-slate-800">{customerName}</span>
                </div>
              )}
              {address && (
                <div className="flex justify-between text-slate-600">
                  <span>Endereço:</span>
                  <span className="font-bold text-slate-800">{address}{neighborhood ? ` (${neighborhood})` : ''}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Pagamento:</span>
                <span className="font-bold text-emerald-700">{paymentLabel}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-slate-900 border-t border-slate-200 pt-2">
                <span>Total a Pagar:</span>
                <span className="text-blue-700">{product.currentPrice}</span>
              </div>
            </div>

            {/* CHECKOUT PROMISSEPAY */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-3">
              <div className="text-xs font-extrabold text-emerald-900 uppercase flex items-center justify-center gap-1.5">
                <i className="fas fa-shield-alt text-emerald-600 text-base"></i> Pagamento Seguro — PromissePay
              </div>

              {dynamicCheckoutUrl && (
                <a href={dynamicCheckoutUrl} target="_blank" rel="noopener noreferrer"
                  className="block bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 px-6 rounded-xl text-sm uppercase tracking-wider shadow-md transition-colors cursor-pointer">
                  <i className="fas fa-lock mr-2"></i> Clique Aqui para Pagar
                </a>
              )}

              {dynamicQrImage && (
                <div className="space-y-2 pt-1">
                  <p className="text-[11px] text-slate-500">Ou escaneie o QR Code PIX:</p>
                  <div className="flex justify-center">
                    <img src={dynamicQrImage} alt="QR Code PIX" className="w-40 h-40 rounded-xl border border-emerald-200 shadow-sm object-contain" />
                  </div>
                </div>
              )}

              {dynamicPixCode && (
                <div className="space-y-2">
                  <div className="bg-white p-2 rounded-xl border border-emerald-200 text-[10px] font-mono text-slate-600 break-all select-all">
                    {dynamicPixCode}
                  </div>
                  <button type="button" onClick={copyPix}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer">
                    {pixCopied ? 'Copiado! ✓' : 'Copiar Código PIX'}
                  </button>
                </div>
              )}
            </div>

            <button onClick={onClose}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-extrabold py-3.5 rounded-xl text-sm uppercase tracking-wider shadow-md transition-colors cursor-pointer">
              Voltar à Loja
            </button>
          </div>
        ) : (
          /* TELA DE AGUARDANDO PAGAMENTO */
          <div className="p-6 md:p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-2xl animate-pulse">
              <i className="fas fa-hourglass-half"></i>
            </div>

            <div>
              <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Aguardando Confirmação de Pagamento
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">Seu pedido está sendo processado</h2>
              <p className="text-slate-600 text-sm mt-1">
                Não iremos preparar a entrega até o pagamento ser confirmado. Aguarde a confirmação automática.
              </p>
            </div>

            {/* RESUMO */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between font-bold border-b border-slate-200 pb-2 text-slate-800">
                <span>Produto:</span><span>{product.title}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Pagamento:</span>
                <span className="font-bold text-emerald-700">{paymentLabel} • {txStatus || 'PENDING'}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-slate-900 border-t border-slate-200 pt-2">
                <span>Total a Pagar:</span>
                <span className="text-blue-700">{product.currentPrice}</span>
              </div>
            </div>

            {/* CHECKOUT / QR */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-3">
              {dynamicCheckoutUrl && (
                <a href={dynamicCheckoutUrl} target="_blank" rel="noopener noreferrer"
                  className="block bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 px-6 rounded-xl text-sm uppercase tracking-wider shadow-md transition-colors cursor-pointer">
                  <i className="fas fa-lock mr-2"></i> Abrir Checkout (nova aba)
                </a>
              )}

              {dynamicQrImage && (
                <div className="space-y-2 pt-1">
                  <p className="text-[11px] text-slate-500">Ou escaneie o QR Code PIX:</p>
                  <div className="flex justify-center">
                    <img src={dynamicQrImage} alt="QR Code PIX" className="w-40 h-40 rounded-xl border border-emerald-200 shadow-sm object-contain" />
                  </div>
                </div>
              )}

              {dynamicPixCode && (
                <div className="space-y-2">
                  <div className="bg-white p-2 rounded-xl border border-emerald-200 text-[10px] font-mono text-slate-600 break-all select-all">
                    {dynamicPixCode}
                  </div>
                  <button type="button" onClick={copyPix}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer">
                    {pixCopied ? 'Copiado! ✓' : 'Copiar Código PIX'}
                  </button>
                </div>
              )}
            </div>

            <button onClick={onClose}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-extrabold py-3.5 rounded-xl text-sm uppercase tracking-wider shadow-md transition-colors cursor-pointer">
              Voltar à Loja
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
