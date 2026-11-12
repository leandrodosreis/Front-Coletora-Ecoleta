import { useState, useEffect } from "react";
import { getResiduos } from "./residuosApi";
import "./Residuos.css";
import { ModalOferta } from "../../components/ofertaInicial/OfertaInicial";

const ROTULO_STATUS = {
  disponivel: "DISPONÍVEL",
  agendado: "AGENDADO",
};

export function Residuos() {
  // ESTADOS DA TELA
  const [residuos, setResiduos] = useState([]); // Dados recebidos da API
  const [carregando, setCarregando] = useState(true); // Controla o carregamento
  const [erro, setErro] = useState(false); // Controla erros da API

  // ESTADO DO MODAL DE OFERTA
  const [residuoSelecionado, setResiduoSelecionado] = useState(null);

  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("todos");
  const [status, setStatus] = useState("todos");

  // Guarda os filtros somente quando o botão Filtrar for clicado
  const [filtros, setFiltros] = useState({
    busca: "",
    tipo: "todos",
    status: "todos"
  });

  // FUNÇÃO REUTILIZÁVEL PARA CARREGAR/RECARREGAR OS RESÍDUOS
  async function carregarResiduos() {
    setCarregando(true);
    setErro(false);
    let dados = await getResiduos();

    if (dados !== false) {
      setResiduos(dados);
    } else {
      setErro(true);
    }

    setCarregando(false);
  }

  // BUSCA OS RESÍDUOS NA API QUANDO A TELA É ABERTA
  useEffect(() => {
    carregarResiduos();
  }, []);

  // APLICA OS FILTROS INFORMADOS PELO USUÁRIO
  function aplicarFiltros() {
    setFiltros({ busca, tipo, status });
  }

  // FILTRA OS RESÍDUOS RECEBIDOS DA API
  const residuosFiltrados = residuos.filter((r) => {
    const bateBusca =
      r.material.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      r.estabelecimento.toLowerCase().includes(filtros.busca.toLowerCase());

    const bateTipo = filtros.tipo === "todos" || r.tipo === filtros.tipo;
    const bateStatus = filtros.status === "todos" || r.status === filtros.status;

    return bateBusca && bateTipo && bateStatus;
  });

  return (
    <main className="tela_residuos">
      <div className="conteudo_residuos">
        <p className="etiqueta">PAINEL DA EMPRESA COLETORA</p>
        <h1 className="titulo_residuos">Resíduos disponíveis</h1>
        <p className="subtitulo">Gerencie e acompanhe suas operações na Ecoleta.</p>

        <div className="barra_filtros">
          <div className="busca_campo">
            <input
              className="barra_pesquisa"
              type="text"
              placeholder="Buscar por material ou estabelecimento"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <select
            className="select_filtro"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
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
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="todos">Todos os status</option>
            <option value="disponivel">Disponível</option>
            <option value="agendado">Agendado</option>
          </select>

          <button className="botao_filtrar" onClick={aplicarFiltros}>
            Filtrar
          </button>
        </div>

        <section className="lista_residuos">

          {/* AVISOS DE CARREGAMENTO E ERRO */}
          {carregando && (
            <p className="residuos_aviso">Carregando resíduos...</p>
          )}

          {erro && (
            <p className="residuos_aviso">
              Não foi possível carregar os resíduos.
            </p>
          )}

          {/* MENSAGEM QUANDO NÃO EXISTEM RESÍDUOS */}
          {!carregando && !erro && residuosFiltrados.length === 0 && (
            <p className="residuos_aviso">
              Nenhum resíduo encontrado. Ajuste os filtros e tente de novo.
            </p>
          )}

          {/* LISTA OS RESÍDUOS RECEBIDOS DA API */}
          {!carregando && !erro && residuosFiltrados.map((r) => (
            <article className="residuos_card" key={r.id}>
              <div className="card_topo">
                <div className="card_icone">📦</div>

                <div className="card_titulo_texto">
                  <h2>{r.material}</h2>
                  <p>{r.estabelecimento}</p>
                </div>

                <span className={`selo selo_${r.status}`}>
                  {ROTULO_STATUS[r.status] || r.status}
                </span>
              </div>

              <div className="card_info_grade">
                <div>
                  <strong>Quantidade</strong>
                  <p>{r.quantidade}</p>
                </div>

                <div className="info_centro">
                  <strong>Data disponível</strong>
                  <p>{r.data}</p>
                </div>

                <div className="info_direita">
                  <strong>Horário</strong>
                  <p>{r.horario}</p>
                </div>
              </div>

              <div className="card_rodape">
                <p className="observacao">{r.observacao}</p>

                <div className="acoes">
                  {r.status === "disponivel" ? (
                    <button 
                      className="botao_oferta" 
                      onClick={() => setResiduoSelecionado(r)}
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

      {/* JANELA MODAL DE FAZER OFERTA */}
      <ModalOferta
        isOpen={Boolean(residuoSelecionado)}
        residuo={residuoSelecionado}
        onClose={() => setResiduoSelecionado(null)}
        onSucesso={() => {
          alert("Oferta enviada com sucesso!");
          carregarResiduos();
        }}
      />
    </main>
  );
}
