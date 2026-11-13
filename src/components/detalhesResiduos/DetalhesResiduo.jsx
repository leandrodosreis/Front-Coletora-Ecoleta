import { useEffect, useState } from 'react';
import './DetalhesResiduo.css';

export function ModalDetalhesResiduo({
  isOpen,
  residuo,
  buscarDetalhes,
  onClose
}) {
  const [detalhesColeta, setDetalhesColeta] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  // Busca os detalhes sempre que um resíduo for selecionado.
  useEffect(() => {
    if (!isOpen || !residuo) {
      setDetalhesColeta(null);
      setMensagemErro('');
      return;
    }

    async function carregarDetalhes() {
      setCarregando(true);
      setMensagemErro('');
      setDetalhesColeta(null);

      try {
        let dadosColeta = await buscarDetalhes(residuo.id);
        setDetalhesColeta(dadosColeta);
      } catch (erro) {
        setMensagemErro(
          erro.message || 'Não foi possível carregar os detalhes da coleta.'
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDetalhes();
  }, [isOpen, residuo, buscarDetalhes]);

  if (!isOpen || !residuo) {
    return null;
  }

  return (
    <div className="detalhes-overlay" onClick={onClose}>
      <div
        className="detalhes-container"
        onClick={(evento) => evento.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-detalhes"
      >
        <span className="detalhes-brand">ECOLETA</span>

        <h2 id="titulo-detalhes">Detalhes da coleta</h2>

        {carregando && (
          <p className="detalhes-aviso">
            Carregando detalhes da coleta...
          </p>
        )}

        {mensagemErro && (
          <p className="detalhes-erro">{mensagemErro}</p>
        )}

        {detalhesColeta && (
          <>
            <span className="detalhes-status">
              {detalhesColeta.status_coleta || 'COLETA AGENDADA'}
            </span>

            <div className="detalhes-grade">
              <div className="detalhes-campo campo-largo">
                <label>Estabelecimento</label>
                <p>{detalhesColeta.nome_estabelecimento || 'Não informado'}</p>
              </div>

              <div className="detalhes-campo">
                <label>Material</label>
                <p>{detalhesColeta.material || 'Não informado'}</p>
              </div>

              <div className="detalhes-campo">
                <label>Quantidade</label>
                <p>
                  {detalhesColeta.quantidade
                    ? `${detalhesColeta.quantidade} kg`
                    : 'Não informada'}
                </p>
              </div>

              <div className="detalhes-campo">
                <label>Data disponível</label>
                <p>{detalhesColeta.data_disponivel || 'Não informada'}</p>
              </div>

              <div className="detalhes-campo">
                <label>Horário disponível</label>
                <p>
                  {detalhesColeta.horario_inicial || '--:--'}
                  {' às '}
                  {detalhesColeta.horario_final || '--:--'}
                </p>
              </div>

              <div className="detalhes-campo campo-largo">
                <label>Endereço</label>
                <p>
                  {detalhesColeta.logradouro || ''}
                  {detalhesColeta.numero ? `, ${detalhesColeta.numero}` : ''}
                  {detalhesColeta.bairro ? ` - ${detalhesColeta.bairro}` : ''}
                  {detalhesColeta.nome_cidade
                    ? ` - ${detalhesColeta.nome_cidade}`
                    : ''}
                </p>
              </div>

              <div className="detalhes-campo">
                <label>Distância</label>
                <p>
                  {detalhesColeta.distancia != null
                    ? `${detalhesColeta.distancia} km`
                    : 'Não informada'}
                </p>
              </div>

              <div className="detalhes-campo">
                <label>Valor acordado</label>
                <p>
                  {detalhesColeta.valor_acordado != null
                    ? `R$ ${Number(detalhesColeta.valor_acordado).toFixed(2).replace('.', ',')}`
                    : 'Não informado'}
                </p>
              </div>

              <div className="detalhes-campo campo-largo">
                <label>Observações do estabelecimento</label>
                <p className="detalhes-observacao">
                  {detalhesColeta.observacao || 'Nenhuma observação informada.'}
                </p>
              </div>
            </div>
          </>
        )}

        <div className="detalhes-acoes">
          <button
            type="button"
            className="detalhes-fechar"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
