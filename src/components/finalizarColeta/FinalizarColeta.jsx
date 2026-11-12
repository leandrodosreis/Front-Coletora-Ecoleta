
import { useEffect, useState } from 'react';
import { finalizarColeta } from '../../features/coletas/coletasApi';
import './FinalizarColeta.css';

// Converte DD/MM/AAAA para AAAA-MM-DD, formato utilizado pelo input date.
function converterDataParaInput(data) {
  if (!data || !data.includes('/')) {
    return '';
  }

  let [dia, mes, ano] = data.split('/');
  return `${ano}-${mes}-${dia}`;
}

// Converte AAAA-MM-DD para DD/MM/AAAA, formato exigido pela API.
function converterDataParaAPI(data) {
  let [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Verifica se a data informada é válida no calendário.
function validarData(data) {
  if (!data) {
    return false;
  }

  let [ano, mes, dia] = data.split('-').map(Number);
  let dataInformada = new Date(ano, mes - 1, dia);

  return (
    dataInformada.getFullYear() === ano &&
    dataInformada.getMonth() === mes - 1 &&
    dataInformada.getDate() === dia
  );
}

export function FinalizarColetaModal({
  isOpen,
  coleta,
  onClose,
  onSucesso
}) {
  const [nomeColetor, setNomeColetor] = useState('');
  const [placaVeiculo, setPlacaVeiculo] = useState('');
  const [dataColeta, setDataColeta] = useState('');
  const [horaColeta, setHoraColeta] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  // Limpa o formulário sempre que uma nova coleta for aberta.
  useEffect(() => {
    if (isOpen) {
      setNomeColetor('');
      setPlacaVeiculo('');
      setDataColeta('');
      setHoraColeta('');
      setMensagemErro('');
    }
  }, [isOpen, coleta]);

  if (!isOpen || !coleta) {
    return null;
  }

  // Envia os dados preenchidos para finalizar a coleta.
  async function enviarFormulario(evento) {
    evento.preventDefault();
    setMensagemErro('');

    if (nomeColetor.trim().length === 0) {
      setMensagemErro('Informe o nome do coletor.');
      return;
    }

    // Aceita placas no padrão Mercosul.
    let placaFormatada = placaVeiculo.trim().toUpperCase();
    let placaValida = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(placaFormatada);

    if (!placaValida) {
      setMensagemErro('Informe uma placa válida no padrão Mercosul.');
      return;
    }

    if (!validarData(dataColeta)) {
      setMensagemErro('Informe uma data válida para a coleta.');
      return;
    }

    if (!horaColeta) {
      setMensagemErro('Informe o horário da coleta.');
      return;
    }

    try {
      setCarregando(true);

      await finalizarColeta(coleta.id_coleta, {
        nome_coletor: nomeColetor.trim(),
        placa_veiculo: placaFormatada,
        data_coleta: converterDataParaAPI(dataColeta),
        hora_coleta: horaColeta
      });

      onSucesso();

    } catch (erro) {
      setMensagemErro(erro.message || 'Erro ao finalizar a coleta.');

    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="finalizar-overlay" onClick={onClose}>
      <div
        className="finalizar-container"
        onClick={(evento) => evento.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-finalizar-coleta"
      >
        <span className="finalizar-brand">ECOLETA</span>

        <h2 id="titulo-finalizar-coleta">
          Finalizar coleta
        </h2>

        <form onSubmit={enviarFormulario}>
          <div className="finalizar-campo">
            <label htmlFor="nome_coletor">Nome do coletor</label>

            <input
              id="nome_coletor"
              type="text"
              value={nomeColetor}
              onChange={(evento) => setNomeColetor(evento.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div className="finalizar-campo">
            <label htmlFor="placa_veiculo">Placa do veículo</label>

            <input
              id="placa_veiculo"
              type="text"
              value={placaVeiculo}
              onChange={(evento) =>
                setPlacaVeiculo(evento.target.value.toUpperCase())
              }
              placeholder="ABC1D23"
              maxLength={7}
              required
            />
          </div>

          <div className="finalizar-campos-linha">
            <div className="finalizar-campo">
              <label htmlFor="data_coleta">Data da coleta</label>

              <input
                id="data_coleta"
                type="date"
                value={dataColeta}
                onChange={(evento) => setDataColeta(evento.target.value)}
                min={converterDataParaInput(coleta.data_disponivel)}
                required
              />
            </div>

            <div className="finalizar-campo">
              <label htmlFor="hora_coleta">Hora da coleta</label>

              <input
                id="hora_coleta"
                type="time"
                value={horaColeta}
                onChange={(evento) => setHoraColeta(evento.target.value)}
                required
              />
            </div>
          </div>

          {mensagemErro && (
            <p className="finalizar-erro">
              {mensagemErro}
            </p>
          )}

          <div className="finalizar-acoes">
            <button
              type="button"
              className="finalizar-cancelar"
              onClick={onClose}
              disabled={carregando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="finalizar-confirmar"
              disabled={carregando}
            >
              {carregando ? 'Finalizando...' : 'Confirmar coleta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
