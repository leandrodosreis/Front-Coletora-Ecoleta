// COMPONENTE GLOBAL: o card de uma coleta.
// Ele NÃO busca dados: só recebe uma coleta pelas props e desenha na tela.
// Assim qualquer tela pode usar o mesmo card.
import './CardColeta.css';

// A API manda números como "5.00". Esta função tira os zeros e troca ponto por vírgula: 5,5
function formatarNumero(valor) {
  return String(Number(valor)).replace('.', ',');
}

// Mostra o valor com 2 casas e vírgula: 20,00
function formatarValor(valor) {
  return Number(valor).toFixed(2).replace('.', ',');
}

// "coleta" é uma prop: o objeto com os dados de uma coleta
export function CardColeta({ coleta }) {
  // true quando a coleta está aguardando finalização (o texto é o mesmo do banco)
  const aguardando = coleta.status_coleta === 'Aguardando Finalização';

  return (
    <div className="card_coleta">
      <span className="card_icone">🏢</span>

      <div className="card_info">
        <p className="card_nome">{coleta.nome_estabelecimento}</p>
        <p className="card_detalhes">
          {coleta.material} · {formatarNumero(coleta.quantidade)} kg
          {/* A distância pode vir vazia da API: só mostramos se existir */}
          {coleta.distancia != null && ` · ${formatarNumero(coleta.distancia)} km`}
        </p>
      </div>

      {/* Esta div agrupa valor, selo e botão (no celular eles descem para a linha de baixo) */}
      <div className="card_lado">
        {/* O valor acordado só aparece nas coletas agendadas (e se a API enviar) */}
        {!aguardando && coleta.valor_acordado != null && (
          <div className="card_valor">
            <span>Valor acordado</span>
            <strong>R$ {formatarValor(coleta.valor_acordado)}</strong>
          </div>
        )}

        {/* O selo muda de cor e de texto conforme o status */}
        <span className={aguardando ? 'card_status status_aguardando' : 'card_status status_agendado'}>
          {aguardando ? 'Aguardando finalização' : 'Agendada'}
        </span>

        {/* O texto do botão também depende do status */}
        <button className="card_botao">
          {aguardando ? 'Finalizar coleta' : 'Ver mais'}
        </button>
      </div>
    </div>
  );
}
