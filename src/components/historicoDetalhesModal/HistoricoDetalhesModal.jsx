import { useEffect, useState } from 'react';
import { getDetalhesHistorico } from '../../features/historico/historicoApi';
import '../ofertaDetalhesModal/OfertaDetalhesModal.css';

function formatarData(data) {
  if (!data) return 'Não informada';
  let partes = String(data).slice(0, 10).split('-');
  return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : data;
}

function formatarValor(valor) {
  if (valor == null || valor === '') return 'Não informado';
  return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;
}

function Campo({ titulo, valor, largo = false }) {
  return (
    <div className={`oferta-detalhes-campo ${largo ? 'campo-largo' : ''}`}>
      <label>{titulo}</label>
      <p>{valor || 'Não informado'}</p>
    </div>
  );
}

export function HistoricoDetalhesModal({ item, onClose }) {
  const [detalhes, setDetalhes] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const ehColeta = item?.tipoRegistro === 'coleta' || item?.idColeta != null;

  useEffect(() => {
    if (!item) return;

    async function carregar() {
      setCarregando(true);
      setDetalhes(null);
      setErro('');
      try {
        setDetalhes(await getDetalhesHistorico(item));
      } catch (erroBusca) {
        setErro(erroBusca.message || 'Não foi possível carregar os detalhes.');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [item]);

  if (!item) return null;

  let titulo = ehColeta
    ? `Detalhes da coleta - ${item.material}`
    : `Detalhes da oferta - ${item.material}`;
  let endereco = detalhes
    ? [detalhes.logradouro, detalhes.numero].filter(Boolean).join(', ') +
      ([detalhes.bairro, detalhes.nome_cidade || detalhes.cidade].filter(Boolean).length
        ? ` - ${[detalhes.bairro, detalhes.nome_cidade || detalhes.cidade].filter(Boolean).join(' - ')}` : '')
    : '';
  let horario = detalhes
    ? `${detalhes.horario_inicial || '--:--'} às ${detalhes.horario_final || '--:--'}`
    : '';

  return (
    <div className="oferta-detalhes-overlay" onClick={onClose}>
      <div className="oferta-detalhes-container" onClick={(evento) => evento.stopPropagation()}
        role="dialog" aria-modal="true" aria-labelledby="titulo-detalhes-historico">
        <span className="oferta-detalhes-brand">ECOLETA</span>
        <h2 id="titulo-detalhes-historico">{titulo}</h2>
        <p className="oferta-detalhes-descricao">Confira as informações completas desta operação.</p>

        {carregando && <p>Carregando informações...</p>}
        {erro && <p className="detalhes-erro">{erro}</p>}

        {detalhes && <>
          <div className="oferta-detalhes-status">
            <strong>Status:</strong> {ehColeta ? (detalhes.status_coleta || 'Concluída') : (detalhes.status_oferta || 'Recusado')}
          </div>
          <div className="oferta-detalhes-grade">
            <Campo titulo="Estabelecimento" valor={detalhes.nome_estabelecimento} largo />
            {ehColeta && <Campo titulo="Local da coleta" valor={endereco} largo />}
            <Campo titulo="Quantidade" valor={detalhes.quantidade != null ? `${detalhes.quantidade} kg` : 'Não informada'} />
            <Campo titulo="Data disponível" valor={formatarData(detalhes.data_disponivel)} />
            <Campo titulo="Horário" valor={horario} />
            <Campo titulo="Observação" valor={detalhes.observacao || 'Nenhuma observação informada.'} largo />
            {ehColeta ? <>
              <Campo titulo="Valor acordado" valor={formatarValor(detalhes.valor_acordado)} />
              <Campo titulo="Coletor" valor={detalhes.nome_coletor} />
              <Campo titulo="Placa do veículo" valor={detalhes.placa_veiculo} />
              <Campo titulo="Data/hora da coleta" valor={`${formatarData(detalhes.data_coleta)} ${detalhes.hora_coleta || ''}`.trim()} largo />
            </> : <Campo titulo="Valor ofertado" valor={formatarValor(detalhes.valor_ofertado)} largo />}
          </div>
        </>}

        <div className="oferta-detalhes-acoes">
          <button type="button" onClick={onClose}>Entendi</button>
        </div>
      </div>
    </div>
  );
}
