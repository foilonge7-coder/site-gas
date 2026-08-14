import React from 'react';

interface CentralTimerProps {
  timerText: string;
}

export const CentralTimer: React.FC<CentralTimerProps> = ({ timerText }) => {
  const scrollToPacks = (e: React.MouseEvent) => {
    e.preventDefault();
    const packsEl = document.getElementById('packs');
    if (packsEl) {
      packsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="max-w-xl mx-auto px-4 mt-10">
        <div className="bg-white rounded-3xl p-6 text-center card-shadow border border-slate-100">
          <h3 className="font-black text-blue-800 uppercase mb-3 text-sm tracking-wide">
            Entrega promocional encerra em
          </h3>
          <div className="bg-blue-600 text-white inline-block px-8 py-2 rounded-2xl text-4xl font-black timer-box tracking-wider">
            {timerText}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-semibold">
            Garanta o frete grátis e prioridade na rota.
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <div className="flex justify-center my-14 px-4">
        <a
          href="#packs"
          onClick={scrollToPacks}
          className="btn-primary text-white font-black py-4 px-12 rounded-full shadow-lg uppercase pulse text-center inline-block cursor-pointer hover:brightness-105 active:scale-95 transition-transform"
        >
          QUERO GARANTIR MINHA ENTREGA
        </a>
      </div>
    </>
  );
};
