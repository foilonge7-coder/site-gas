import React from 'react';

export const HowItWorks: React.FC = () => {
  return (
    <section className="bg-[#f4f6fa] px-4 pt-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-extrabold text-base text-slate-900 mb-4">Como funciona</h3>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: 'fa-cart-shopping', label: '1) Escolha o pack',       sub: 'Selecione o combo ideal.' },
              { icon: 'fa-headset',       label: '2) Finalize seu pedido',  sub: 'Finalize sua compra' },
              { icon: 'fa-truck-fast',    label: '3) Receba em casa',       sub: 'Entrega local e ágil.' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <div className="text-blue-700 font-black text-[11px] flex items-start gap-1 mb-1">
                  <i className={`fas ${item.icon} mt-0.5 flex-shrink-0`}></i>
                  <span>{item.label}</span>
                </div>
                <div className="text-slate-400 text-[10px] font-semibold">{item.sub}</div>
              </div>
            ))}
          </div>

          <p className="mt-3 text-[11px] text-slate-400">
            *Atendemos apenas por delivery (entregas locais).
          </p>
        </div>
      </div>
    </section>
  );
};
