import React from 'react';

interface FooterProps {
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTerms, onOpenPrivacy }) => {
  return (
    <footer className="bg-white border-t border-slate-100 py-8 text-center">
      <div className="flex justify-center items-center gap-4 mb-2">
        <button
          onClick={onOpenTerms}
          className="text-xs font-bold text-slate-400 hover:text-blue-600 cursor-pointer transition-colors uppercase tracking-wider"
        >
          Termos de Uso
        </button>
        <span className="text-slate-200 text-xs">|</span>
        <button
          onClick={onOpenPrivacy}
          className="text-xs font-bold text-slate-400 hover:text-blue-600 cursor-pointer transition-colors uppercase tracking-wider"
        >
          Política de Privacidade
        </button>
      </div>
      <p className="text-xs text-slate-300">
        © 2026 Ultra Gás & Água • Todos os direitos reservados
      </p>
    </footer>
  );
};
