import React from 'react';

export const StructureSection: React.FC = () => {
  return (
    <section className="max-w-4xl mx-auto px-4 mt-10">
      <div className="bg-white rounded-3xl card-shadow overflow-hidden border border-slate-100">
        <div className="relative h-[280px] md:h-[340px] bg-slate-100 flex items-center justify-center">
          <img
            src="/img/banner.webp"
            className="w-full h-full object-contain"
            alt="Nossa estrutura"
            loading="lazy"
          />
        </div>

        <div className="p-6">
          <h3 className="font-extrabold text-xl text-blue-900 mb-2">Nossa Estrutura</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Somos especializados em <b>entregas rápidas de Água Mineral e Gás de Cozinha</b>, com operação local e organizada.
            Trabalhamos <b>exclusivamente no modelo delivery</b> para garantir agilidade e segurança.
            Todos os pedidos são atendidos por equipe preparada e com produtos <b>lacrados</b> e conferidos.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-extrabold">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3">
              <div className="text-blue-900"><i className="fas fa-shield-halved mr-1"></i> Compra segura</div>
              <div className="text-slate-600 font-semibold text-[11px] mt-1">padrão de entrega local</div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3">
              <div className="text-blue-900"><i className="fas fa-clock mr-1"></i> Agilidade</div>
              <div className="text-slate-600 font-semibold text-[11px] mt-1">atendimento imediato</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
