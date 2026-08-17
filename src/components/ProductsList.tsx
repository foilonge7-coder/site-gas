import React from 'react';
import { ComboProduct } from '../types';
import { COMBO_PRODUCTS } from '../data/products';

interface ProductsListProps {
  onSelectProduct: (product: ComboProduct) => void;
}

export const ProductsList: React.FC<ProductsListProps> = ({ onSelectProduct }) => {
  return (
    <section id="packs" className="scroll-mt-12 bg-[#f4f6fa] px-4 pt-6 pb-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-4">
          <h2 className="text-xl font-extrabold italic text-slate-900">
            Combos e Unidades disponíveis
          </h2>
          <p className="text-blue-600 font-bold italic text-sm">
            Entrega rápida • Frete grátis
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {COMBO_PRODUCTS.map((combo) => (
            <div
              key={combo.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              {/* TAG */}
              <div className="relative px-3 pt-3">
                <span className={`${combo.tagColor} text-white text-[9px] font-black px-2 py-0.5 rounded-full`}>
                  {combo.tag}
                </span>
              </div>

              {/* IMAGEM */}
              <div className="flex justify-center px-4 py-2">
                <img
                  src={combo.img}
                  alt={combo.title}
                  className="w-20 h-20 object-contain"
                  loading="lazy"
                />
              </div>

              {/* INFO */}
              <div className="px-3 pb-3">
                <h3 className="font-black text-slate-900 text-sm leading-tight mb-0.5">
                  {combo.title}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mb-1.5">
                  {combo.subtitle}
                </p>

                <div className="text-[10px] text-slate-400">
                  De <del>{combo.originalPrice}</del>
                  <span className="text-red-500 font-black ml-1">{combo.discount}</span>
                </div>
                <div className="text-lg font-black text-slate-900 mb-2">
                  {combo.currentPrice}
                </div>

                <button
                  onClick={() => onSelectProduct(combo)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-black text-xs cursor-pointer transition-colors active:scale-[0.98]"
                >
                  Pedir Agora
                </button>

                <div className="mt-1.5 text-[10px] text-slate-400 flex items-center gap-1">
                  <i className="fas fa-truck-fast text-blue-500"></i>
                  Frete grátis
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
