import React, { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  timerText: string;
  userCity: string;
}

const SLIDES = [
  {
    bg1: '#0d2d6b',
    bg2: '#1a4fa8',
    accent: '#3b9eff',
    tag: 'SEU GÁS,',
    tagHighlight: 'NOSSA',
    tagEnd: 'RESPONSABILIDADE!',
    desc: 'Entrega rápida, segura e com o melhor preço da região!',
    bullets: [
      { icon: 'fa-shield-halved', text: 'Segurança em primeiro lugar' },
      { icon: 'fa-clock', text: 'Entrega rápida' },
      { icon: 'fa-thumbs-up', text: 'Qualidade garantida' },
    ],
    img: '/img/combo.webp',
    imgRight: true,
  },
  {
    bg1: '#0d2d6b',
    bg2: '#0d4a8a',
    accent: '#38bdf8',
    tag: 'ÁGUA',
    tagHighlight: 'DE QUALIDADE',
    tagEnd: 'PARA SUA FAMÍLIA!',
    desc: 'Galões lacrados e higienizados, com toda segurança que você merece.',
    bullets: [],
    img: '/img/agua.webp',
    imgRight: false,
  },
  {
    bg1: '#0d2d6b',
    bg2: '#1a4fa8',
    accent: '#3b9eff',
    tag: 'COMPRE',
    tagHighlight: 'SEU GÁS',
    tagEnd: 'SEM SAIR DE CASA!',
    desc: '',
    bullets: [
      { icon: 'fa-motorcycle', text: 'Entrega rápida e eficiente' },
      { icon: 'fa-shield-halved', text: 'Botijões lacrados e de qualidade' },
      { icon: 'fa-phone', text: 'Atendimento fácil e rápido' },
    ],
    img: '/img/gas3.webp',
    imgRight: true,
    cta: 'PEÇA AGORA',
  },
  {
    bg1: '#0d2d6b',
    bg2: '#1a4fa8',
    accent: '#3b9eff',
    tag: 'GÁS',
    tagHighlight: 'E ÁGUA',
    tagEnd: 'TUDO O QUE VOCÊ\nPRECISA, A GENTE\nENTREGA!',
    desc: '',
    bullets: [
      { icon: 'fa-fire-flame-curved', text: 'Gás de cozinha com o melhor preço' },
      { icon: 'fa-droplet', text: 'Água mineral gelada e de qualidade' },
      { icon: 'fa-truck-fast', text: 'Entrega rápida e segura' },
    ],
    img: '/img/comboss.webp',
    imgRight: true,
  },
];

export const Header: React.FC<HeaderProps> = ({ timerText, userCity }) => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (index: number) => {
    if (animating || index === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 200);
  };

  const next = () => goTo((current + 1) % SLIDES.length);
  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    intervalRef.current = setInterval(next, 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [current]);

  const scrollToPacks = (e: React.MouseEvent) => {
    e.preventDefault();
    const packsEl = document.getElementById('packs');
    if (packsEl) packsEl.scrollIntoView({ behavior: 'smooth' });
  };

  const slide = SLIDES[current];

  return (
    <>
      {/* TOPO TIMER */}
      <div className="banner-top text-white text-center py-2 text-xs font-black sticky top-0 z-50 shadow-md">
        <i className="fas fa-bolt mr-1"></i>Promoção encerra em <span id="top-timer">{timerText}</span>
      </div>

      {/* HEADER */}
      <header className="soft px-4 pt-6 pb-7 rounded-b-[44px] shadow-sm text-center">
        <div className="max-w-4xl mx-auto">

          {/* CARROSSEL PROFISSIONAL */}
          <div className="mb-5 relative rounded-3xl overflow-hidden shadow-xl select-none" style={{ height: 220 }}>

            {/* IMAGEM DE FUNDO FULL */}
            <img
              src={slide.img}
              alt="produto"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'right center',
                opacity: animating ? 0 : 1,
                transition: 'opacity 0.22s ease',
              }}
            />

            {/* OVERLAY GRADIENTE */}
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(to right, ${slide.bg1}f5 0%, ${slide.bg1}e0 50%, ${slide.bg1}70 75%, transparent 100%)`,
              opacity: animating ? 0 : 1,
              transition: 'opacity 0.22s ease',
            }} />

            {/* CONTEÚDO */}
            <div style={{
              position: 'absolute', inset: 0,
              padding: '14px 16px 28px 16px',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
              opacity: animating ? 0 : 1,
              transition: 'opacity 0.22s ease',
              width: '65%',
            }}>
              {/* Ícone */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'rgba(255,255,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 5, flexShrink: 0,
              }}>
                <i className="fas fa-fire-flame-curved" style={{ color: slide.accent, fontSize: 12 }}></i>
              </div>

              {/* Título */}
              <div style={{ lineHeight: 1.2, marginBottom: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: '#fff', display: 'block' }}>{slide.tag}</span>
                <span style={{ fontSize: 16, fontWeight: 900, color: slide.accent, display: 'block' }}>{slide.tagHighlight}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', display: 'block', whiteSpace: 'pre-line', opacity: 0.95 }}>{slide.tagEnd}</span>
              </div>

              {/* Linha */}
              <div style={{ width: 24, height: 3, background: slide.accent, borderRadius: 2, marginBottom: 6, flexShrink: 0 }} />

              {/* Desc ou bullets */}
              {slide.desc ? (
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, margin: 0 }}>{slide.desc}</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {slide.bullets.slice(0, 3).map((b, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: '50%',
                        background: slide.accent, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <i className={`fas ${b.icon}`} style={{ fontSize: 7, color: '#fff' }}></i>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.92)', lineHeight: 1.3 }}>{b.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA */}
              {slide.cta && (
                <div style={{
                  marginTop: 8, background: slide.accent, color: '#fff',
                  fontSize: 10, fontWeight: 900,
                  padding: '5px 12px', borderRadius: 6,
                  display: 'inline-block', letterSpacing: 0.5, alignSelf: 'flex-start', flexShrink: 0,
                }}>
                  {slide.cta}
                </div>
              )}
            </div>

            {/* Setas */}
            <button onClick={(e) => { e.stopPropagation(); prev(); }} style={{
              position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.35)', border: 'none', borderRadius: '50%',
              width: 26, height: 26, cursor: 'pointer', color: '#fff', fontSize: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
            }}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} style={{
              position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.35)', border: 'none', borderRadius: '50%',
              width: 26, height: 26, cursor: 'pointer', color: '#fff', fontSize: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
            }}>
              <i className="fas fa-chevron-right"></i>
            </button>

            {/* Indicadores */}
            <div style={{
              position: 'absolute', bottom: 8, left: 0, right: 0,
              display: 'flex', justifyContent: 'center', gap: 5, zIndex: 10,
            }}>
              {SLIDES.map((_, i) => (
                <button key={i} onClick={() => goTo(i)} style={{
                  height: 4, borderRadius: 4, border: 'none', cursor: 'pointer', padding: 0,
                  background: i === current ? '#fff' : 'rgba(255,255,255,0.4)',
                  width: i === current ? 20 : 6, transition: 'all 0.3s',
                }} />
              ))}
            </div>
          </div>

          {/* LOGO */}
          <div className="flex justify-center mb-3">
            <img
              src="/img/logo.webp"
              alt="Logo"
              className="h-24 md:h-28 object-contain rounded-2xl shadow-sm transition-transform hover:scale-105"
            />
          </div>

          {/* SUBTEXTO */}
          <div className="text-sm font-bold text-blue-900 mb-1 flex items-center justify-center gap-2">
            <span>Entrega rápida</span>
            <span className="chip px-2 py-0.5 rounded text-xs font-black">20 min</span>
          </div>
          <div className="text-xs font-semibold text-slate-500 mb-3">
            Atendimento imediato em todo o Brasil
          </div>

          {/* SELOS DE CREDIBILIDADE */}
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-xs">
              <i className="fas fa-lock text-emerald-600 text-xs"></i>
              <span>Site 100% Seguro</span>
            </div>
            <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-xs">
              <i className="fas fa-shield-halved text-blue-600 text-xs"></i>
              <span>Proteção SSL</span>
            </div>
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-800 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-xs">
              <i className="fas fa-credit-card text-orange-500 text-xs"></i>
              <span>Pagamento Seguro</span>
            </div>
            <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-200 text-purple-800 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-xs">
              <i className="fas fa-truck-fast text-purple-500 text-xs"></i>
              <span>Entrega Garantida</span>
            </div>
          </div>

          {/* BADGES */}
          <div className="flex flex-wrap justify-center items-center gap-2 mb-3">
            <div className="chip px-4 py-1 rounded-full text-xs font-extrabold flex items-center gap-2 shadow-xs">
              <i className="fas fa-map-marker-alt text-blue-600"></i>
              <span>Frete grátis para <span className="text-blue-900 font-black">{userCity}</span></span>
            </div>
            <div className="chip px-4 py-1 rounded-full text-xs font-extrabold flex items-center gap-2 shadow-xs">
              <i className="fas fa-circle-check text-emerald-600"></i>
              <span>Pedido 100% Seguro</span>
            </div>
          </div>

          {/* AVALIAÇÕES */}
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="fas fa-star text-amber-400 text-xs"></i>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-600">4,9 · <span className="text-slate-500 font-medium">+2.400 pedidos entregues</span></span>
          </div>

          {/* ESTAMOS ABERTO */}
          <div className="flex justify-center mb-4">
            <div className="status-open">Estamos Aberto</div>
          </div>

          {/* FEATURES */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-extrabold text-slate-700">
            <div className="bg-white rounded-2xl p-3 card-shadow border border-slate-100">
              💧 Água lacrada
              <div className="text-[10px] text-slate-500 font-semibold mt-1">Qualidade garantida</div>
            </div>
            <div className="bg-white rounded-2xl p-3 card-shadow border border-slate-100">
              🔥 Gás 13kg
              <div className="text-[10px] text-slate-500 font-semibold mt-1">Produto lacrado</div>
            </div>
            <div className="bg-white rounded-2xl p-3 card-shadow border border-slate-100">
              🚚 Delivery rápido
              <div className="text-[10px] text-slate-500 font-semibold mt-1">Todo o Brasil</div>
            </div>
            <div className="bg-white rounded-2xl p-3 card-shadow border border-slate-100">
              ⚡ Pix Instantâneo
              <div className="text-[10px] text-slate-500 font-semibold mt-1">Aprovação imediata</div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-5 flex justify-center">
            <a
              href="#packs"
              onClick={scrollToPacks}
              className="btn-primary text-white font-black py-4 px-10 rounded-full shadow-lg uppercase pulse inline-block cursor-pointer"
            >
              PEDIR AGORA
            </a>
          </div>
        </div>
      </header>
    </>
  );
};
