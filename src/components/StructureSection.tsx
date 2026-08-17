import React from 'react';

export const StructureSection: React.FC = () => {
  return (
    <section className="bg-[#f4f6fa] px-4 pt-4 pb-2">
      <div className="max-w-lg mx-auto">
        {/* BANNER GÁS EM CASA */}
        <div className="rounded-2xl overflow-hidden shadow-sm mb-5">
          <img
            src="/img/banner.webp"
            alt="Gás em Casa Rápido e Seguro"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>

        {/* NOSSA ESTRUTURA */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-extrabold text-lg text-slate-900 mb-2">Nossa Estrutura</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Somos especializados em{' '}
            <b className="text-slate-800">entregas rápidas de Água Mineral e Gás de Cozinha</b>,
            com operação local e organizada. Trabalhamos{' '}
            <b className="text-slate-800">exclusivamente no modelo delivery</b> para garantir agilidade e segurança.
            Todos os pedidos são atendidos por equipe preparada e com produtos{' '}
            <b className="text-slate-800">lacrados</b> e conferidos.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white border border-slate-200 rounded-xl p-3">
              <div className="font-black text-slate-800">
                <i className="fas fa-shield-halved text-blue-600 mr-1"></i>Compra segura
              </div>
              <div className="text-slate-400 text-[11px] mt-0.5">padrão de entrega local</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-3">
              <div className="font-black text-slate-800">
                <i className="fas fa-clock text-blue-600 mr-1"></i>Agilidade
              </div>
              <div className="text-slate-400 text-[11px] mt-0.5">atendimento imediato</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
