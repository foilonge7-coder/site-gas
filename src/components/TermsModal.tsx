import React from 'react';

interface TermsModalProps {
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ onClose }) => {
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
          Termos de Uso
        </h1>

        <div className="space-y-6 text-sm leading-relaxed text-slate-700 max-h-[60vh] overflow-y-auto pr-2">
          <section>
            <h2 class="text-base font-bold text-slate-900 mb-1">
              1. Aceitação dos Termos
            </h2>
            <p>
              Ao acessar este site e realizar um pedido de <strong>Água Mineral ou Gás de Cozinha</strong>,
              o usuário declara estar ciente e concordar integralmente com os presentes Termos de Uso.
            </p>
          </section>

          <section>
            <h2 class="text-base font-bold text-slate-900 mb-1">
              2. Entregas e Prazos
            </h2>
            <p>
              O prazo de entrega informado no site é uma <strong>estimativa</strong>,
              baseada em condições normais de tráfego, clima e disponibilidade de produto.
              Situações excepcionais podem ocasionar atrasos.
            </p>
            <p className="mt-1">
              O atendimento está sujeito à área de cobertura e disponibilidade de estoque.
            </p>
          </section>

          <section>
            <h2 class="text-base font-bold text-slate-900 mb-1">
              3. Produtos e Estoque
            </h2>
            <p>
              Trabalhamos com marcas selecionadas de Água Mineral 20L e Gás de Cozinha 13kg.
              Em caso de indisponibilidade da marca escolhida, o cliente será contatado
              para substituição ou cancelamento do pedido.
            </p>
          </section>

          <section>
            <h2 class="text-base font-bold text-slate-900 mb-1">
              4. Preços e Promoções
            </h2>
            <p>
              Os valores exibidos no site podem sofrer alterações sem aviso prévio,
              respeitando os pedidos já confirmados.
            </p>
            <p className="mt-1">
              Promoções com tempo limitado ou quantidade restrita são válidas
              enquanto durarem os estoques ou durante o período informado.
            </p>
          </section>

          <section>
            <h2 class="text-base font-bold text-slate-900 mb-1">
              5. Pagamentos
            </h2>
            <p>
              Aceitamos as seguintes formas de pagamento:
              <strong>PIX, cartões de crédito, cartões de débito e dinheiro</strong>.
            </p>
            <p className="mt-1">
              Caso o pagamento seja em dinheiro, o cliente deve informar o valor para troco
              no momento do pedido.
            </p>
          </section>

          <section>
            <h2 class="text-base font-bold text-slate-900 mb-1">
              6. Cancelamentos
            </h2>
            <p>
              O cancelamento do pedido poderá ser solicitado
              <strong>antes da saída para entrega</strong>.
            </p>
            <p className="mt-1">
              Após o envio do produto, o cancelamento poderá não ser possível,
              especialmente em razão de custos logísticos e operacionais.
            </p>
          </section>

          <section>
            <h2 class="text-base font-bold text-slate-900 mb-1">
              7. Responsabilidades
            </h2>
            <p>
              O cliente é responsável por fornecer corretamente os dados de entrega.
              Não nos responsabilizamos por atrasos ou falhas decorrentes
              de informações incorretas ou incompletas.
            </p>
          </section>
        </div>

        <p className="mt-8 text-[11px] text-slate-400 text-center uppercase font-semibold">
          Água & Gás • Atendimento com Segurança e Transparência
        </p>
      </div>
    </div>
  );
};
