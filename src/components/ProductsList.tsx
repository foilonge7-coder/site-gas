import React from 'react';
import { ComboProduct } from '../types';
import { COMBO_PRODUCTS } from '../data/products';

interface ProductsListProps {
  onSelectProduct: (product: ComboProduct) => void;
}

export const ProductsList: React.FC<ProductsListProps> = ({ onSelectProduct }) => {
  return (
    <section id="packs" className="scroll-mt-28 max-w-4xl mx-auto px-4 pt-8">
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold italic text-slate-900">
          Combos e Unidades disponíveis
        </h2>
        <p className="text-blue-700 font-bold italic">
          Entrega rápida • Frete grátis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COMBO_PRODUCTS.map((combo) => (
          <div key={combo.id} className="bg-white rounded-2xl p-4 card-shadow border border-slate-100 hover:border-blue-200 transition-all">
            <div className="grid grid-cols-[110px_1fr] gap-4">
              <div className="relative w-[110px] h-[110px] flex items-center justify-center bg-slate-50 rounded-xl">
                <span className={`absolute -top-2 -right-2 ${combo.tagColor} text-white text-[10px] px-2.5 py-1 rounded-full font-black shadow z-10`}>
                  {combo.tag}
                </span>
                <img
                  src={combo.img}
                  alt={combo.title}
                  className="w-full h-full object-contain p-1"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-slate-900 leading-snug">{combo.title}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{combo.subtitle}</p>
                  <div className="mt-2">
                    <div className="text-[11px] text-slate-500 font-bold">
                      De <del>{combo.originalPrice}</del>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-slate-900">{combo.currentPrice}</span>
                      <span className="chip text-[11px] font-black px-1.5 py-0.5 rounded">{combo.discount}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectProduct(combo)}
                  className="mt-3 btn-primary text-white py-2.5 rounded-xl text-center font-black text-sm w-full cursor-pointer hover:brightness-105 active:scale-[0.98] transition-transform"
                >
                  Pedir Agora
                </button>
                
                <div className="mt-2 text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                  <i className="fas fa-truck-fast text-blue-700"></i> Frete grátis
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
