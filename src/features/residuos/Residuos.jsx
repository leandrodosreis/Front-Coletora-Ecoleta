
import { useState, useEffect } from 'react';
import { buscarResiduos } from './residuosApi';
import './Residuos.css';
import { ModalOferta } from '../../components/ofertaInicial/OfertaInicial';

// Define os textos exibidos de acordo com o status do resíduo.
const ROTULO_STATUS = {
  disponivel: 'DISPONÍVEL',
  agendado: 'AGENDADO'
};

export function Residuos() {
  // Estados responsáveis pelos dados recebidos da API.
  const [residuos, setResiduos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  // Guarda o resíduo selecionado para abrir o modal de oferta.
  const [residuoSelecionado, setResiduoSelecionado] = useState(null);

  // Guarda os valores digitados nos filtros.
  const [busca, setBusca] = useState('');
  const [tipo, setTipo] = useState('todos');
  const [status, setStatus] = useState('todos');

  // Os filtros só são aplicados quando o usuário clica no botão Filtrar.
  const [filtros, setFiltros] = useState({
    busca: '',
    tipo: 'todos',
    status: 'todos'
  });

  // Busca os resíduos na API e atualiza os estados da tela.
  async function carregarResiduos() {
    setCarregando(true);
    setErro(false);

    let dadosResiduos = await buscarResiduos();

    if (dadosResiduos !== false) {
      setResiduos(dadosResiduos);
    } else {
      setErro(true);
    }

    setCarregando(false);
  }

  // Carrega os resíduos quando a tela é aberta.
  useEffect(() => {
    carregarResiduos();
  }, []);

  // Aplica os valores selecionados nos filtros.
  function aplicarFiltros() {
    setFiltros({
      busca,
      tipo,
      status
    });
  }

  // Filtra os resíduos de acordo com os critérios selecionados.
  const residuosFiltrados = residuos.filter((residuo) => {
    let buscaMinuscula = filtros.busca.toLowerCase();

    let correspondeBusca =
      residuo.material.toLowerCase().includes(buscaMinuscula) ||
      residuo.estabelecimento.toLowerCase().includes(buscaMinuscula);

    let correspondeTipo =
      filtros.tipo === 'todos' || residuo.tipo === filtros.tipo;

    let correspondeStatus =
      filtros.status === 'todos' || residuo.status === filtros.status;

    return correspondeBusca && correspondeTipo && correspondeStatus;
  });

  return (
    <main className="tela_residuos">
      <div className="conteudo_residuos">
        <p className="etiqueta">PAINEL DA EMPRESA COLETORA</p>

        <h1 className="titulo_residuos">
          Resíduos disponíveis
        </h1>

        <p className="subtitulo">
          Gerencie e acompanhe suas operações na Ecoleta.
        </p>

        {/* Campos utilizados para filtrar os resíduos. */}
        <div className="barra_filtros">
          <div className="busca_campo">
            <input
              className="barra_pesquisa"
              type="text"
              placeholder="Buscar por material ou estabelecimento"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </div>

          <select
            className="select_filtro"
            value={tipo}
            onChange={(evento) => setTipo(evento.target.value)}
          >
            <option value="todos">Todos os tipos</option>
            <option value="vidro">Vidro</option>
            <option value="papel">Papel</option>
            <option value="plastico">Plástico</option>
            <option value="outros">Outros</option>
          </select>

          <select
            className="select_filtro"
            value={status}
            onChange={(evento) => setStatus(evento.target.value)}
          >
            <option value="todos">Todos os status</option>
            <option value="disponivel">Disponível</option>
            <option value="agendado">Agendado</option>
          </select>

          <button
            className="botao_filtrar"
            onClick={aplicarFiltros}
          >
            Filtrar
          </button>
        </div>

        {/* Lista de resíduos e mensagens da tela. */}
        <section className="lista_residuos">
          {carregando && (
            <p className="residuos_aviso">
              Carregando resíduos...
            </p>
          )}

          {erro && (
            <p className="residuos_aviso">
              Não foi possível carregar os resíduos.
            </p>
          )}

          {!carregando && !erro && residuosFiltrados.length === 0 && (
            <p className="residuos_aviso">
              Nenhum resíduo encontrado. Ajuste os filtros e tente de novo.
            </p>
          )}

          {!carregando && !erro && residuosFiltrados.map((residuo) => (
            <article className="residuos_card" key={residuo.id}>
              <div className="card_topo">
                <div className="card_icone">📦</div>

                <div className="card_titulo_texto">
                  <h2>{residuo.material}</h2>

                  <p>
                    {residuo.estabelecimento}
                    {residuo.distancia !== null &&
                      ` - ${residuo.distancia} km`}
                  </p>
                </div>

                <span className={`selo selo_${residuo.status}`}>
                  {ROTULO_STATUS[residuo.status] || residuo.status}
                </span>
              </div>

              <div className="card_info_grade">
                <div>
                  <strong>Quantidade</strong>
                  <p>{residuo.quantidade}</p>
                </div>

                <div className="info_centro">
                  <strong>Data disponível</strong>
                  <p>{residuo.data}</p>
                </div>

                <div className="info_direita">
                  <strong>Horário</strong>
                  <p>{residuo.horario}</p>
                </div>
              </div>

              <div className="card_rodape">
                <p className="observacao">
                  {residuo.observacao}
                </p>

                <div className="acoes">
                  {residuo.status === 'disponivel' ? (
                    <button
                      className="botao_oferta"
                      onClick={() => setResiduoSelecionado(residuo)}
                    >
                      Fazer oferta →
                    </button>
                  ) : (
                    <button className="botao_ver_coleta">
                      Ver Coleta
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>

      {/* Modal utilizado para enviar uma oferta ao estabelecimento. */}
      <ModalOferta
        isOpen={Boolean(residuoSelecionado)}
        residuo={residuoSelecionado}
        onClose={() => setResiduoSelecionado(null)}
        onSucesso={() => {
          alert('Oferta enviada com sucesso!');
          carregarResiduos();
        }}
      />
    </main>
  );
}
