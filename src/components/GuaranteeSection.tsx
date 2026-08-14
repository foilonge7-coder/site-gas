import React from 'react';

export const GuaranteeSection: React.FC = () => {
  return (
    <>
      <section className="max-w-4xl mx-auto px-4 mt-10">
        <div className="premium-box rounded-3xl p-6 text-white card-shadow">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <i className="fas fa-shield-halved text-lg"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-xl">Garantia Total & Segurança</h3>
              <p className="text-white/90 text-sm font-semibold mt-1">
                Produtos lacrados e conferidos. Atendimento humano. Entrega local com acompanhamento.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3 mt-4 text-sm font-extrabold">
            <div className="bg-white/10 rounded-2xl p-4 border border-white/15">
              <div><i className="fas fa-seal mr-1"></i> Lacre verificado</div>
              <div className="text-[12px] font-semibold text-white/80 mt-1">Qualidade garantida.</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 border border-white/15">
              <div><i className="fas fa-hand-holding-heart mr-1"></i> Atendimento confiável</div>
              <div className="text-[12px] font-semibold text-white/80 mt-1">Suporte do início ao fim.</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 border border-white/15">
              <div><i className="fas fa-truck-fast mr-1"></i> Entrega rápida</div>
              <div className="text-[12px] font-semibold text-white/80 mt-1">Tempo médio 20min.</div>
            </div>
          </div>
        </div>
      </section>

      {/* BOX DE IMAGEM SIMPLES */}
      <section className="max-w-4xl mx-auto px-4 mt-10">
        <div className="rounded-3xl overflow-hidden shadow-md border border-slate-100">
          <img src="/img/entrega11.webp" alt="Entrega rápida" className="w-full h-auto object-cover" loading="lazy" />
        </div>
      </section>
    </>
  );
};
