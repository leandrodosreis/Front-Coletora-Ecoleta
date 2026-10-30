import { useState, useEffect } from 'react';
import { CardColeta } from '../../components/cardColeta/CardColeta';
import { getColetasEmpresa } from './coletasApi';
import './Coletas.css';

// Lista das abas. "valor" identifica a aba e "nome" é o texto que aparece
const abas = [
  { valor: 'todas', nome: 'Todas' },
  { valor: 'aguardando', nome: 'Aguardando finalização' },
  { valor: 'agendada', nome: 'Agendada' }
];

export function Coletas() {
  // ESTADOS (informações que, ao mudar, atualizam a tela)
  const [filtro, setFiltro] = useState('todas'); // aba escolhida no momento
  const [coletas, setColetas] = useState([]); // lista de coletas vinda da API
  const [carregando, setCarregando] = useState(true); // true = ainda buscando na API

  // useEffect roda código quando a tela aparece.
  // O [] no final significa: "rode uma vez só, quando a tela abrir".
  useEffect(() => {
    async function carregarDados() {
      let dados = await getColetasEmpresa();

      if (dados) {
        setColetas(dados);
      } else {
        setColetas([]); // deu erro ou veio vazio: lista vazia
      }
      setCarregando(false); // terminou de carregar
    }

    carregarDados();
  }, []);

  // filter cria uma nova lista só com as coletas que atendem à condição.
  // Os textos são os mesmos da tabela de status do banco.
  const aguardando = coletas.filter((coleta) => coleta.status_coleta === 'Aguardando Finalização');
  const agendadas = coletas.filter((coleta) => coleta.status_coleta === 'Agendada');

  // Cada seção só aparece se a aba combina E se existe alguma coleta nela
  const mostrarAguardando = (filtro === 'todas' || filtro === 'aguardando') && aguardando.length > 0;
  const mostrarAgendadas = (filtro === 'todas' || filtro === 'agendada') && agendadas.length > 0;

  return (
    <main className="tela_coletas">
      <div className="conteudo_coletas">
        <p className="etiqueta">PAINEL DA EMPRESA COLETORA</p>
        <h1 className="titulo_coletas">Coletas</h1>
        <p className="subtitulo">Gerencie e acompanhe suas operações na Ecoleta.</p>

        {/* Abas: map cria um botão para cada item da lista "abas" */}
        <div className="abas">
          {abas.map((aba) => (
            <button
              key={aba.valor}
              // A aba escolhida ganha a classe "aba_ativa" (fundo branco)
              className={filtro === aba.valor ? 'aba aba_ativa' : 'aba'}
              // Ao clicar, guarda esta aba como a escolhida
              onClick={() => setFiltro(aba.valor)}
            >
              {aba.nome}
            </button>
          ))}
        </div>

        {carregando && <p className="aviso">Carregando coletas...</p>}

        {!carregando && !mostrarAguardando && !mostrarAgendadas && (
          <p className="aviso">Nenhuma coleta encontrada.</p>
        )}

        {/* Seção: coletas aguardando finalização */}
        {mostrarAguardando && (
          <section className="secao">
            <p className="etiqueta">Atenção necessária</p>
            <h2>Coletas aguardando finalização</h2>
            {/* A prop "coleta" entrega os dados para o CardColeta */}
            {aguardando.map((coleta) => (
              <CardColeta key={coleta.id_coleta} coleta={coleta} />
            ))}
          </section>
        )}

        {/* Seção: coletas agendadas */}
        {mostrarAgendadas && (
          <section className="secao">
            <p className="etiqueta">Agendadas</p>
            <h2>Coletas agendadas</h2>
            {agendadas.map((coleta) => (
              <CardColeta key={coleta.id_coleta} coleta={coleta} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
