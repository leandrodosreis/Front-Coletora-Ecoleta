import { useState } from 'react';
import './OfertaInicial.css';
import { enviarOfertaInicial } from '../../features/residuos/residuosApi';

export function ModalOferta({ isOpen, onClose, residuo, onSucesso }) {
  const [nomeOfertante, setNomeOfertante] = useState('');
  const [valorOfertado, setValorOfertado] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  if (!isOpen || !residuo) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (nomeOfertante.trim().length < 2) {
      setErro('O nome do funcionário deve ter pelo menos 2 caracteres.');
      return;
    }

    const valorNumerico = parseFloat(valorOfertado.replace(',', '.'));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      setErro('Informe um valor válido maior que zero.');
      return;
    }

    try {
      setCarregando(true);
      await enviarOfertaInicial(residuo.id_residuo, {
        nome_ofertante: nomeOfertante.trim(),
        valor_ofertado: valorNumerico
      });

      setNomeOfertante('');
      setValorOfertado('');
      if (onSucesso) onSucesso();
      onClose();
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <span className="modal-brand">ECOLETA</span>
        <h2 className="modal-title">Fazer oferta</h2>

        <div className="resumo-grid">
          <div className="info-group span-2">
            <label>Estabelecimento</label>
            <input 
              type="text" 
              value={residuo.nome_estabelecimento} 
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
              value={`${residuo.quantidade} kg`} 
              readOnly 
            />
          </div>

          <div className="info-group">
            <label>Data disponível</label>
            <input 
              type="text" 
              value={residuo.data_disponivel} 
              readOnly 
            />
          </div>

          <div className="info-group">
            <label>Horário</label>
            <input 
              type="text" 
              value={`${residuo.horario_inicial} às ${residuo.horario_final}`} 
              readOnly 
            />
          </div>

          <div className="info-group">
            <label>Distância</label>
            <input 
              type="text" 
              value={residuo.distancia || 'Não informada'} 
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


        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="nome_ofertante">Nome do funcionário:</label>
            <input
              id="nome_ofertante"
              type="text"
              value={nomeOfertante}
              onChange={(e) => setNomeOfertante(e.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="valor_ofertado">Valor da oferta (R$)</label>
            <input
              id="valor_ofertado"
              type="number"
              step="0.01"
              min="0.01"
              max="999999.99"
              value={valorOfertado}
              onChange={(e) => setValorOfertado(e.target.value)}
              required
            />
          </div>

          {erro && <p className="modal-erro">{erro}</p>}

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
