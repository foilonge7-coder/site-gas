import React from 'react';

export const HowItWorks: React.FC = () => {
  return (
    <section className="max-w-4xl mx-auto px-4 mt-10">
      <div className="bg-white rounded-3xl card-shadow p-6 border border-slate-100">
        <h3 className="font-extrabold text-lg text-slate-900 mb-4">Como funciona</h3>
        <div className="grid md:grid-cols-3 gap-3 text-sm">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <div className="font-black text-blue-900 flex items-center gap-1.5">
              <i className="fas fa-cart-shopping"></i>
              <span>1) Escolha o pack</span>
            </div>
            <div className="text-slate-600 font-semibold text-[12px] mt-1">Selecione o combo ideal.</div>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <div className="font-black text-blue-900 flex items-center gap-1.5">
              <i className="fas fa-headset"></i>
              <span>2) Finalize seu pedido</span>
            </div>
            <div className="text-slate-600 font-semibold text-[12px] mt-1">Finalize sua compra</div>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <div className="font-black text-blue-900 flex items-center gap-1.5">
              <i className="fas fa-truck-fast"></i>
              <span>3) Receba em casa</span>
            </div>
            <div className="text-slate-600 font-semibold text-[12px] mt-1">Entrega local e ágil.</div>
          </div>
        </div>
        <div className="mt-4 text-[12px] text-slate-500 font-semibold">
          *Atendemos apenas por delivery (entregas locais).
        </div>
      </div>
    </section>
  );
};
