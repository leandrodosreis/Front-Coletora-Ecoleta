import './OfertaDetalhesModal.css';

function formatarData(data) {
  if (!data) return 'Não informada';

  let partes = String(data).slice(0, 10).split('-');
  return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : data;
}

function formatarValor(valor) {
  if (valor === null || valor === undefined || valor === '') return 'Não informado';

  return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;
}

function montarEndereco(oferta) {
  let endereco = [oferta.logradouro, oferta.numero].filter(Boolean).join(', ');
  let localidade = [oferta.bairro, oferta.cidade].filter(Boolean).join(' - ');
  return [endereco, localidade].filter(Boolean).join(' - ') || 'Não informado';
}

export function OfertaDetalhesModal({ oferta, onClose }) {
  if (!oferta) return null;

  let horario = oferta.horarioInicial || oferta.horarioFinal
    ? `${oferta.horarioInicial || '--:--'} às ${oferta.horarioFinal || '--:--'}`
    : 'Não informado';

  return (
    <div className="oferta-detalhes-overlay" onClick={onClose}>
      <div
        className="oferta-detalhes-container"
        onClick={(evento) => evento.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-detalhes-oferta"
      >
        <span className="oferta-detalhes-brand">ECOLETA</span>
        <h2 id="titulo-detalhes-oferta">Detalhes da oferta - {oferta.material || 'Material'}</h2>
        <p className="oferta-detalhes-descricao">Confira as informações disponíveis desta oferta.</p>

        <div className="oferta-detalhes-status">
          <strong>Status:</strong> {oferta.status || 'Não informado'}
        </div>

        <div className="oferta-detalhes-grade">
          <div className="oferta-detalhes-campo campo-largo">
            <label>Estabelecimento</label>
            <p>{oferta.estabelecimento || 'Não informado'}</p>
          </div>
          <div className="oferta-detalhes-campo">
            <label>Material</label>
            <p>{oferta.material || 'Não informado'}</p>
          </div>
          <div className="oferta-detalhes-campo">
            <label>Quantidade</label>
            <p>{oferta.quantidade != null ? `${oferta.quantidade} kg` : 'Não informada'}</p>
          </div>
          <div className="oferta-detalhes-campo">
            <label>Data disponível</label>
            <p>{formatarData(oferta.data)}</p>
          </div>
          <div className="oferta-detalhes-campo">
            <label>Horário disponível</label>
            <p>{horario}</p>
          </div>
          <div className="oferta-detalhes-campo campo-largo">
            <label>Endereço da coleta</label>
            <p>{montarEndereco(oferta)}</p>
          </div>
          <div className="oferta-detalhes-campo campo-largo">
            <label>Observações</label>
            <p>{oferta.observacao || 'Nenhuma observação informada.'}</p>
          </div>
          <div className="oferta-detalhes-campo campo-largo">
            <label>Valor ofertado</label>
            <p>{formatarValor(oferta.valor)}</p>
          </div>
        </div>

        <div className="oferta-detalhes-acoes">
          <button type="button" onClick={onClose}>Entendi</button>
        </div>
      </div>
    </div>
  );
}
