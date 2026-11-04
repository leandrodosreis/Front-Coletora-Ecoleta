import { useState } from "react";
import "./Residuos.css";

const RESIDUOS_INICIAIS = [
  {
    id: 1,
    material: "Vidro",
    estabelecimento: "Restaurante X - 2.4 km",
    tipo: "vidro",
    status: "disponivel",
    quantidade: "35 kg",
    data: "27/08/2026",
    horario: "08:00 às 12:00",
    observacao: "Material separado e embalado.",
  },
  {
    id: 2,
    material: "Papelão",
    estabelecimento: "Restaurante X - 2.4 km",
    tipo: "papel",
    status: "agendado",
    quantidade: "18 kg",
    data: "28/08/2026",
    horario: "08:00 às 12:00",
    observacao: "Próximo ao local indicado.",
  },
  {
    id: 3,
    material: "Plástico",
    estabelecimento: "Mini Mercado - 5.0 km",
    tipo: "plastico",
    status: "disponivel",
    quantidade: "12 kg",
    data: "29/08/2026",
    horario: "08:00 às 17:00",
    observacao: "Material leve, porém grande.",
  },
];

const ROTULO_STATUS = {
  disponivel: "DISPONÍVEL",
  agendado: "AGENDADO",
};

export function Residuos() {
  const [residuos] = useState(RESIDUOS_INICIAIS);
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("todos");
  const [status, setStatus] = useState("todos");
  const [filtros, setFiltros] = useState({ busca: "", tipo: "todos", status: "todos" });

  function aplicarFiltros() {
    setFiltros({ busca, tipo, status });
  }

  const residuosFiltrados = residuos.filter((r) => {
    const bateBusca = r.material.toLowerCase().includes(filtros.busca.toLowerCase()) || 
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

          <select className="select_filtro" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="todos">Todos os tipos</option>
            <option value="vidro">Vidro</option>
            <option value="papel">Papel</option>
            <option value="plastico">Plástico</option>
          </select>

          <select className="select_filtro" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="todos">Todos os status</option>
            <option value="disponivel">Disponível</option>
            <option value="agendado">Agendado</option>
          </select>

          <button className="botao_filtrar" onClick={aplicarFiltros}>
            Filtrar
          </button>
        </div>

        <section className="lista_residuos">
          {residuosFiltrados.length === 0 && (
            <p className="residuos_aviso">Nenhum resíduo encontrado. Ajuste os filtros e tente de novo.</p>
          )}

          {residuosFiltrados.map((r) => (
            <article className="residuos_card" key={r.id}>
              <div className="card_topo">
                <div className="card_icone">📦</div>
                <div className="card_titulo_texto">
                  <h2>{r.material}</h2>
                  <p>{r.estabelecimento}</p>
                </div>
                <span className={`selo selo_${r.status}`}>{ROTULO_STATUS[r.status]}</span>
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
                    <button className="botao_oferta">Fazer oferta →</button>
                  ) : (
                    <button className="botao_ver_coleta">Ver Coleta</button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
