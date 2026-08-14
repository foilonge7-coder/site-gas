import React, { useEffect, useState } from 'react';
import { SALES_DATA } from '../data/products';
import { SalesItem } from '../types';

interface SalesPopupProps {
  userCity: string;
}

export const SalesPopup: React.FC<SalesPopupProps> = ({ userCity }) => {
  const [currentSale, setCurrentSale] = useState<SalesItem | null>(null);
  const [distanceText, setDistanceText] = useState<string>('a poucos metros');
  const [visible, setVisible] = useState<boolean>(false);

  const getRandomDistance = () => {
    const meters = [120, 180, 240, 310, 450, 600];
    const pick = meters[Math.floor(Math.random() * meters.length)];
    return `a ${pick}m de você`;
  };

  const showRandomPopup = () => {
    const randomItem = SALES_DATA[Math.floor(Math.random() * SALES_DATA.length)];
    setCurrentSale(randomItem);
    setDistanceText(getRandomDistance());
    setVisible(true);

    setTimeout(() => {
      setVisible(false);
    }, 7000);
  };

  useEffect(() => {
    // Initial delay then repeat every 20 seconds
    const initialTimer = setTimeout(() => {
      showRandomPopup();
      const interval = setInterval(showRandomPopup, 20000);
      return () => clearInterval(interval);
    }, 4000);

    return () => clearTimeout(initialTimer);
  }, [userCity]);

  if (!currentSale) return null;

  return (
    <div
      className={`fixed bottom-6 left-4 right-4 md:right-auto md:max-w-[380px] bg-white rounded-xl shadow-[0_12px_40px_rgba(2,6,23,0.20)] z-[100] p-3 flex items-center gap-3 transition-all duration-700 transform border border-slate-100 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-40 opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative shrink-0">
        <img
          src={currentSale.img}
          alt={currentSale.item}
          className="w-14 h-14 rounded-lg object-cover shadow-xs bg-slate-50"
        />
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider flex items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
            Pedido realizado
          </span>
          <span className="text-[10px] font-black text-white bg-blue-700 px-2 py-0.5 rounded shadow-xs whitespace-nowrap ml-2">
            {distanceText}
          </span>
        </div>

        <h4 className="text-[13px] font-extrabold text-slate-900 truncate leading-none mb-1">
          {currentSale.name} • {userCity}
        </h4>
        <p className="text-[11px] text-slate-600 truncate mb-1 font-medium">{currentSale.item}</p>

        <div className="flex items-center text-[10px] text-slate-500 font-bold italic">
          <i className="fas fa-map-marker-alt text-blue-700 mr-1"></i>
          <span>Próximo a você</span>
          <span className="mx-1">•</span>
          <span className="font-black text-blue-700">{currentSale.price}</span>
        </div>
      </div>

      <button
        onClick={() => setVisible(false)}
        className="text-slate-300 hover:text-slate-500 p-1 cursor-pointer transition-colors"
        aria-label="Fechar"
      >
        <i className="fas fa-times text-xs"></i>
      </button>
    </div>
  );
};
