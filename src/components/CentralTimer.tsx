import React from 'react';

interface CentralTimerProps {
  timerText: string;
}

export const CentralTimer: React.FC<CentralTimerProps> = ({ timerText }) => {
  const scrollToPacks = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('packs')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-[#f4f6fa] px-4 pt-4 pb-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
          <p className="text-xs font-black text-blue-700 uppercase tracking-widest mb-3">
            Entrega Promocional Encerra Em
          </p>
          <div className="inline-block bg-blue-600 text-white text-4xl font-black px-10 py-3 rounded-xl shadow-md tracking-wider mb-2">
            {timerText}
          </div>
          <p className="text-xs text-slate-400 font-semibold">
            Garanta o frete grátis e prioridade na rota.
          </p>
        </div>

        {/* CTA FINAL */}
        <div className="flex justify-center mt-6 mb-4">
          <a
            href="#packs"
            onClick={scrollToPacks}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-full shadow-lg uppercase text-sm pulse cursor-pointer transition-colors"
          >
            QUERO GARANTIR MINHA ENTREGA
          </a>
        </div>
      </div>
    </section>
  );
};
