import React from 'react';

interface FooterProps {
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTerms, onOpenPrivacy }) => {
  return (
    <footer className="bg-white border-t border-slate-100 py-10 text-center text-sm text-slate-500">
      <div className="flex justify-center items-center gap-4 mb-3 font-bold text-xs uppercase">
        <button
          onClick={onOpenTerms}
          className="hover:text-blue-600 cursor-pointer transition-colors"
        >
          Termos de Uso
        </button>
        <span className="text-slate-300">|</span>
        <button
          onClick={onOpenPrivacy}
          className="hover:text-blue-600 cursor-pointer transition-colors"
        >
          Política de Privacidade
        </button>
      </div>
      <p>© 2026 Água & Gás do Bairro • Todos os direitos reservados</p>
    </footer>
  );
};
