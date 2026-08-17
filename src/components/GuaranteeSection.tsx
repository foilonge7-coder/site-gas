import React from 'react';

export const GuaranteeSection: React.FC = () => {
  return (
    <>
      {/* GARANTIA TOTAL — fundo azul escuro gradiente */}
      <section className="bg-[#f4f6fa] px-4 pt-4">
        <div className="max-w-lg mx-auto">
          <div
            className="rounded-2xl p-5 text-white shadow-md"
            style={{ background: 'linear-gradient(135deg, #0b1b46 0%, #1e40af 100%)' }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <i className="fas fa-shield-halved text-base"></i>
              </div>
              <div>
                <h3 className="font-extrabold text-base leading-tight">Garantia Total & Segurança</h3>
                <p className="text-white/75 text-xs mt-0.5">
                  Produtos lacrados e conferidos. Atendimento humano. Entrega local com acompanhamento.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: 'fa-seal',               label: 'Lacre verificado',      sub: 'Qualidade garantida.' },
                { icon: 'fa-hand-holding-heart', label: 'Atendimento confiável', sub: 'Suporte do início ao fim.' },
                { icon: 'fa-truck-fast',         label: 'Entrega rápida',        sub: 'Tempo médio 20min.' },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 rounded-xl p-3 border border-white/15">
                  <div className="text-xs font-black mb-0.5">
                    <i className={`fas ${item.icon} mr-1`}></i>{item.label}
                  </div>
                  <div className="text-[10px] text-white/65">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BANNER ENTREGA COM ENTREGADOR */}
      <section className="bg-[#f4f6fa] px-4 pt-4">
        <div className="max-w-lg mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-sm">
            <img
              src="/img/entrega11.webp"
              alt="Entrega de Água e Gás de Cozinha"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
};
