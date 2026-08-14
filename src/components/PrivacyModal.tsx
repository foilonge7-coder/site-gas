import React from 'react';

interface PrivacyModalProps {
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[130] bg-slate-900/60 backdrop-blur-xs overflow-y-auto flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white max-w-3xl w-full rounded-[32px] p-6 md:p-10 shadow-2xl border border-slate-100 my-auto relative">
        <button
          onClick={onClose}
          className="text-[#006437] font-bold flex items-center gap-2 mb-6 hover:underline cursor-pointer"
        >
          <i className="fas fa-chevron-left"></i> Voltar para a Loja
        </button>

        <h1 className="text-2xl md:text-3xl font-extrabold text-[#006437] mb-6 italic uppercase">
          Política de Privacidade
        </h1>

        <div className="space-y-6 text-sm leading-relaxed text-slate-700 max-h-[60vh] overflow-y-auto pr-2">
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-1">
              1. Coleta de Informações
            </h2>
            <p>
              Coletamos informações essenciais para o atendimento e entrega de nossos produtos,
              como <strong>nome, endereço, telefone, observações de entrega</strong> e dados de navegação.
              Essas informações são necessárias para garantir a correta entrega de Água Mineral e Gás de Cozinha.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-1">
              2. Uso dos Dados (LGPD)
            </h2>
            <p>
              Em conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – LGPD)</strong>,
              utilizamos seus dados exclusivamente para:
            </p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Processamento e logística de entrega de água e gás;</li>
              <li>Contato para confirmação e atualização do pedido;</li>
              <li>Atendimento ao cliente;</li>
              <li>Melhoria da experiência de navegação no site.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-1">
              3. Cookies e Armazenamento
            </h2>
            <p>
              Utilizamos cookies e tecnologias similares para salvar preferências,
              localização aproximada e facilitar pedidos futuros.
              Você pode gerenciar ou excluir cookies diretamente nas configurações do seu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-1">
              4. Compartilhamento de Dados
            </h2>
            <p>
              Seus dados <strong>não são vendidos ou comercializados</strong>.
              O compartilhamento ocorre apenas quando necessário para:
            </p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Serviços de entrega;</li>
              <li>Processamento de pagamentos;</li>
              <li>Plataformas de comunicação (ex: WhatsApp) para atendimento.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-1">
              5. Segurança das Informações
            </h2>
            <p>
              Adotamos medidas técnicas e organizacionais para proteger seus dados contra
              acessos não autorizados, perda ou uso indevido.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-1">
              6. Direitos do Titular
            </h2>
            <p>
              Você pode, a qualquer momento, solicitar:
            </p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Acesso aos seus dados;</li>
              <li>Correção de informações;</li>
              <li>Exclusão de dados da nossa base;</li>
              <li>Revogação do consentimento.</li>
            </ul>
            <p className="mt-2">
              Para isso, entre em contato através de nossos canais oficiais de atendimento.
            </p>
          </section>
        </div>

        <p className="mt-8 text-[11px] text-slate-400 text-center uppercase font-semibold">
          Última atualização: Janeiro de 2026
        </p>
      </div>
    </div>
  );
};
