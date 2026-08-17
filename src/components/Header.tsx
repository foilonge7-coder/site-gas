import React from 'react';

interface HeaderProps {
  timerText: string;
  userCity: string;
}

export const Header: React.FC<HeaderProps> = ({ timerText, userCity }) => {
  const scrollToPacks = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('packs')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* BARRA AZUL TOPO */}
      <div className="bg-blue-700 text-white text-center py-2 text-xs font-bold sticky top-0 z-50">
        <i className="fas fa-bolt mr-1 text-yellow-300"></i>
        Promoção encerra em {timerText}
      </div>

      <header className="bg-white text-center px-4 pt-8 pb-6">
        <div className="max-w-lg mx-auto">

          {/* LOGO ESCUDO GRANDE */}
          <div className="flex justify-center mb-5">
            <img
              src="/img/logo.webp"
              alt="Gás & Água Express"
              className="w-52 h-52 object-contain drop-shadow-xl"
            />
          </div>

          {/* NOME */}
          <h1 className="text-2xl font-black text-blue-900 mb-1">Ultra Gás & Água</h1>

          {/* SUBTEXTO COM BADGE */}
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-700 mb-1">
            <span>Entrega rápida</span>
            <span className="bg-blue-600 text-white text-xs font-black px-2.5 py-0.5 rounded-md">20 min</span>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            Estamos a 1,6 km de você • Atendimento imediato
          </p>

          {/* BADGES FRETE + SEGURO */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">
              <i className="fas fa-location-dot text-blue-500 text-xs"></i>
              Frete grátis para <span className="font-black ml-1">{userCity}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">
              <i className="fas fa-shield-halved text-blue-500 text-xs"></i>
              Pedido 100% Seguro
            </div>
          </div>

          {/* STATUS ABERTO */}
          <div className="flex justify-center mb-5">
            <div className="status-open">Estamos Aberto</div>
          </div>

          {/* FEATURES 4 COLUNAS */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[
              { icon: '💧', label: 'Água lacrada',   sub: 'Qualidade garantida' },
              { icon: '🔥', label: 'Gás 13kg',        sub: 'Produto lacrado' },
              { icon: '🚚', label: 'Apenas delivery', sub: 'Entrega local' },
              { icon: '⚡', label: 'Pix',              sub: 'Pagamento fácil' },
            ].map((f, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-2.5 text-center shadow-sm">
                <div className="text-base mb-0.5">{f.icon}</div>
                <div className="text-[10px] font-black text-slate-700 leading-tight">{f.label}</div>
                <div className="text-[9px] text-slate-400 mt-0.5 leading-tight">{f.sub}</div>
              </div>
            ))}
          </div>

          {/* BOTÃO PEDIR AGORA */}
          <a
            href="#packs"
            onClick={scrollToPacks}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 px-12 rounded-full shadow-lg uppercase text-sm pulse cursor-pointer transition-colors"
          >
            PEDIR AGORA
          </a>
        </div>
      </header>
    </>
  );
};
