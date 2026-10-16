import './CardColeta.css';

export function CardColeta({ coleta }) {
  const aguardando = coleta.status === 'aguardando';

  return (
    <div className="card_coleta">
      <span className="card_icone">🏢</span>

      <div className="card_info">
        <p className="card_nome">{coleta.empresa}</p>
        <p className="card_detalhes">
          {coleta.residuo} · {coleta.peso} kg · {coleta.distancia} km
        </p>
      </div>

      {/* o valor só aparece nas coletas agendadas */}
      {!aguardando && (
        <div className="card_valor">
          <span>Valor acordado</span>
          <strong>R$ {coleta.valor}</strong>
        </div>
      )}

      <span className={aguardando ? 'card_status status_aguardando' : 'card_status status_agendado'}>
        {aguardando ? 'Aguardando finalização' : 'Agendado'}
      </span>

      <button className="card_botao">
        {aguardando ? 'Finalizar coleta' : 'Ver mais'}
      </button>
    </div>
  );
}
