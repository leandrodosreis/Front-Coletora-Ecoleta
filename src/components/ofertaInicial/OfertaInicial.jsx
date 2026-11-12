
import { useState } from 'react';
import './OfertaInicial.css';
import { enviarOfertaInicial } from '../../features/residuos/residuosApi';

export function ModalOferta({ isOpen, onClose, residuo, onSucesso }) {
  // Estados utilizados pelo formulário.
  const [nomeFuncionario, setNomeFuncionario] = useState('');
  const [valorOferta, setValorOferta] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  // Não exibe o modal quando ele estiver fechado ou sem um resíduo selecionado.
  if (!isOpen || !residuo) {
    return null;
  }

  // Valida e envia os dados da oferta para a API.
  async function enviarFormulario(evento) {
    evento.preventDefault();
    setMensagemErro('');

    if (nomeFuncionario.trim().length < 2) {
      setMensagemErro('O nome do funcionário deve ter pelo menos 2 caracteres.');
      return;
    }

    let valorNumerico = Number(valorOferta.replace(',', '.'));

    if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
      setMensagemErro('Informe um valor válido maior que zero.');
      return;
    }

    if (!residuo.id) {
      setMensagemErro('Não foi possível identificar o resíduo selecionado.');
      return;
    }

    try {
      setCarregando(true);

      // Envia o ID do resíduo e os dados da oferta.
      await enviarOfertaInicial(residuo.id, {
        nome_ofertante: nomeFuncionario.trim(),
        valor_ofertado: valorNumerico
      });

      // Limpa os campos após o envio bem-sucedido.
      setNomeFuncionario('');
      setValorOferta('');

      if (onSucesso) {
        onSucesso();
      }

      onClose();

    } catch (erro) {
      setMensagemErro(erro.message || 'Não foi possível enviar a oferta.');

    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(evento) => evento.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-oferta"
      >
        <span className="modal-brand">ECOLETA</span>

        <h2 className="modal-title" id="titulo-modal-oferta">
          Fazer oferta
        </h2>

        {/* Exibe os dados do resíduo selecionado. */}
        <div className="resumo-grid">
          <div className="info-group span-2">
            <label>Estabelecimento</label>
            <input
              type="text"
              value={residuo.estabelecimento}
              readOnly
            />
          </div>

          <div className="info-group">
            <label>Material</label>
            <input
              type="text"
              value={residuo.material}
              readOnly
            />
          </div>

          <div className="info-group">
            <label>Quantidade</label>
            <input
              type="text"
              value={residuo.quantidade}
              readOnly
            />
          </div>

          <div className="info-group">
            <label>Data disponível</label>
            <input
              type="text"
              value={residuo.data}
              readOnly
            />
          </div>

          <div className="info-group">
            <label>Horário</label>
            <input
              type="text"
              value={residuo.horario}
              readOnly
            />
          </div>

          <div className="info-group">
            <label>Distância</label>
            <input
              type="text"
              value={
                residuo.distancia !== null
                  ? `${residuo.distancia} km`
                  : 'Não informada'
              }
              readOnly
            />
          </div>

          <div className="info-group span-3">
            <label>Observação do estabelecimento</label>
            <input
              type="text"
              value={residuo.observacao || 'Nenhuma observação informada.'}
              readOnly
            />
          </div>
        </div>

        {/* Formulário para cadastrar a oferta. */}
        <form onSubmit={enviarFormulario} className="modal-form">
          <div className="form-group">
            <label htmlFor="nome_funcionario">
              Nome do funcionário:
            </label>

            <input
              id="nome_funcionario"
              type="text"
              value={nomeFuncionario}
              onChange={(evento) => setNomeFuncionario(evento.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="valor_oferta">
              Valor da oferta (R$)
            </label>

            <input
              id="valor_oferta"
              type="number"
              step="0.01"
              min="0.01"
              max="999999.99"
              value={valorOferta}
              onChange={(evento) => setValorOferta(evento.target.value)}
              required
            />
          </div>

          {/* Exibe mensagens de validação ou erros da API. */}
          {mensagemErro && (
            <p className="modal-erro">
              {mensagemErro}
            </p>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancelar"
              onClick={onClose}
              disabled={carregando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn-enviar"
              disabled={carregando}
            >
              {carregando ? 'Enviando...' : 'Enviar oferta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
