
import { useState, useEffect } from 'react';
import { CardColeta } from '../../components/cardColeta/CardColeta';
import { FinalizarColetaModal } from '../../components/finalizarColeta/FinalizarColeta';
import { getColetasEmpresa } from './coletasApi';
import './Coletas.css';

// Abas disponíveis na tela.
const ABAS = [
  { valor: 'todas', nome: 'Todas' },
  { valor: 'aguardando', nome: 'Aguardando finalização' },
  { valor: 'agendada', nome: 'Agendada' }
];

export function Coletas() {
  const [filtro, setFiltro] = useState('todas');
  const [coletas, setColetas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [coletaSelecionada, setColetaSelecionada] = useState(null);

  // Busca as coletas da empresa na API.
  async function carregarColetas() {
    setCarregando(true);

    let dadosColetas = await getColetasEmpresa();

    if (dadosColetas !== false) {
      setColetas(dadosColetas);
    } else {
      setColetas([]);
    }

    setCarregando(false);
  }

  // Carrega os dados quando a tela é aberta.
  useEffect(() => {
    carregarColetas();
  }, []);

  // Separa as coletas de acordo com o status.
  const coletasAguardando = coletas.filter(
    (coleta) => coleta.status_coleta === 'Aguardando Finalização'
  );

  const coletasAgendadas = coletas.filter(
    (coleta) => coleta.status_coleta === 'Agendada'
  );

  // Define quais seções devem aparecer de acordo com a aba selecionada.
  const mostrarAguardando =
    (filtro === 'todas' || filtro === 'aguardando') &&
    coletasAguardando.length > 0;

  const mostrarAgendadas =
    (filtro === 'todas' || filtro === 'agendada') &&
    coletasAgendadas.length > 0;

  // Atualiza a lista depois que o backend confirma a finalização.
  async function atualizarAposFinalizacao() {
    setColetaSelecionada(null);
    await carregarColetas();
  }

  return (
    <main className="tela_coletas">
      <div className="conteudo_coletas">
        <p className="etiqueta">PAINEL DA EMPRESA COLETORA</p>

        <h1 className="titulo_coletas">Coletas</h1>

        <p className="subtitulo">
          Gerencie e acompanhe suas operações na Ecoleta.
        </p>

        {/* Abas para filtrar as coletas por status. */}
        <div className="abas">
          {ABAS.map((aba) => (
            <button
              key={aba.valor}
              className={filtro === aba.valor ? 'aba aba_ativa' : 'aba'}
              onClick={() => setFiltro(aba.valor)}
            >
              {aba.nome}
            </button>
          ))}
        </div>

        {carregando && (
          <p className="aviso">Carregando coletas...</p>
        )}

        {!carregando && !mostrarAguardando && !mostrarAgendadas && (
          <p className="aviso">Nenhuma coleta encontrada.</p>
        )}

        {/* Coletas que precisam ser finalizadas. */}
        {mostrarAguardando && (
          <section className="secao">
            <p className="etiqueta">Atenção necessária</p>

            <h2>Coletas aguardando finalização</h2>

            {coletasAguardando.map((coleta) => (
              <CardColeta
                key={coleta.id_coleta}
                coleta={coleta}
                onFinalizar={setColetaSelecionada}
              />
            ))}
          </section>
        )}

        {/* Coletas que ainda estão agendadas. */}
        {mostrarAgendadas && (
          <section className="secao">
            <p className="etiqueta">Agendadas</p>

            <h2>Coletas agendadas</h2>

            {coletasAgendadas.map((coleta) => (
              <CardColeta
                key={coleta.id_coleta}
                coleta={coleta}
              />
            ))}
          </section>
        )}
      </div>

      {/* Modal de finalização da coleta selecionada. */}
      <FinalizarColetaModal
        isOpen={Boolean(coletaSelecionada)}
        coleta={coletaSelecionada}
        onClose={() => setColetaSelecionada(null)}
        onSucesso={atualizarAposFinalizacao}
      />
    </main>
  );
}
