import { useState, useEffect } from 'react';
import { Abas } from '../../components/abas/Abas';
import { SecaoColetas } from '../../components/secaoColetas/SecaoColetas';
import { FinalizarColetaModal } from '../../components/finalizarColetaModal/FinalizarColetaModal';
import { DetalhesResiduoModal } from '../../components/detalhesResiduoModal/DetalhesResiduoModal';
import { getColetasEmpresa, getDetalhesColeta } from './coletasApi';
import './Coletas.css';
import { CabecalhoPagina } from '../../components/cabecalhoPagina/CabecalhoPagina';

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
  const [coletaDetalhes, setColetaDetalhes] = useState(null);

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
        <CabecalhoPagina etiqueta="PAINEL DA EMPRESA COLETORA" titulo="Coletas" descricao="Gerencie e acompanhe suas operações na Ecoleta." />

        {/* Abas para filtrar as coletas por status. */}
        <Abas abas={ABAS} ativa={filtro} onChange={setFiltro} />

        {carregando && (
          <p className="aviso">Carregando coletas...</p>
        )}

        {!carregando && !mostrarAguardando && !mostrarAgendadas && (
          <p className="aviso">Nenhuma coleta encontrada.</p>
        )}

        {/* Coletas que precisam ser finalizadas. */}
        {mostrarAguardando && (
          <SecaoColetas
            etiqueta="Atenção necessária"
            titulo="Coletas aguardando finalização"
            coletas={coletasAguardando}
            onFinalizar={setColetaSelecionada}
          />
        )}

        {/* Coletas que ainda estão agendadas. */}
        {mostrarAgendadas && (
          <SecaoColetas
            etiqueta="Agendadas"
            titulo="Coletas agendadas"
            coletas={coletasAgendadas}
            onVerMais={(coleta) => setColetaDetalhes({ id: coleta.id_coleta })}
          />
        )}
      </div>

      {/* Modal de finalização da coleta selecionada. */}
      <DetalhesResiduoModal
        isOpen={Boolean(coletaDetalhes)}
        residuo={coletaDetalhes}
        buscarDetalhes={getDetalhesColeta}
        onClose={() => setColetaDetalhes(null)}
      />

      <FinalizarColetaModal
        isOpen={Boolean(coletaSelecionada)}
        coleta={coletaSelecionada}
        onClose={() => setColetaSelecionada(null)}
        onSucesso={atualizarAposFinalizacao}
      />
    </main>
  );
}
