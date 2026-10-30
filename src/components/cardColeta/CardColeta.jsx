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

      <div className="card_lado">
        {!aguardando && coleta.valor_acordado != null && (
          <div className="card_valor">
            <span>Valor acordado</span>
            <strong>R$ {formatarValor(coleta.valor_acordado)}</strong>
          </div>
        )}

        <span className={aguardando ? 'card_status status_aguardando' : 'card_status status_agendado'}>
          {aguardando ? 'Aguardando finalização' : 'Agendada'}
        </span>

        <button className="card_botao">
          {aguardando ? 'Finalizar coleta' : 'Ver mais'}
        </button>
      </div>
    </div>
  );
}
