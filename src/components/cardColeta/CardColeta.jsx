
import './CardColeta.css';

// Formata números removendo zeros desnecessários e usando vírgula.
function formatarNumero(valor) {
  return String(Number(valor)).replace('.', ',');
}

// Formata valores monetários com duas casas decimais.
function formatarValor(valor) {
  return Number(valor).toFixed(2).replace('.', ',');
}

export function CardColeta({ coleta, onFinalizar }) {
  const aguardando = coleta.status_coleta === 'Aguardando Finalização';

  return (
    <div className="card_coleta">
      <span className="card_icone">🏢</span>

      <div className="card_info">
        <p className="card_nome">{coleta.nome_estabelecimento}</p>

        <p className="card_detalhes">
          {coleta.material} · {formatarNumero(coleta.quantidade)} kg
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

        <span
          className={
            aguardando
              ? 'card_status status_aguardando'
              : 'card_status status_agendado'
          }
        >
          {aguardando ? 'Aguardando finalização' : 'Agendada'}
        </span>

        <button
          className="card_botao"
          onClick={() => {
            if (aguardando) {
              onFinalizar(coleta);
            }
          }}
          disabled={!aguardando}
        >
          {aguardando ? 'Finalizar coleta' : 'Ver mais'}
        </button>
      </div>
    </div>
  );
}
