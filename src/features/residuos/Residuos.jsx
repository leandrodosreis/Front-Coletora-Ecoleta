import { useState } from "react";
import "./Residuos.css"

// ADICIONADO: lista de resíduos de exemplo (depois você troca por dados da API)
const RESIDUOS_INICIAIS = [
    {
        id: 1, // identificador único de cada card
        material: "Vidro", // título do card
        tipo: "vidro", // usado no filtro "Todos os tipos"
        status: "disponivel", // usado no filtro "Todos os status" e na cor do selo
        descricaoStatus: "Disponível para coleta", // subtítulo abaixo do material
        quantidade: "35 kg",
        data: "27/08/2026",
        horario: "08:00 às 12:00",
        observacao: "Material separado e embalado.",
    },
    {
        id: 2,
        material: "Papelão",
        tipo: "papel",
        status: "agendado",
        descricaoStatus: "Agendado para coleta",
        quantidade: "18 kg",
        data: "28/08/2026",
        horario: "08:00 às 12:00",
        observacao: "Próximo ao local indicado.",
    },
    {
        id: 3,
        material: "Plástico",
        tipo: "plastico",
        status: "aguardando",
        descricaoStatus: "Disponível para coleta",
        quantidade: "12 kg",
        data: "29/08/2026",
        horario: "08:00 às 17:00",
        observacao: "Material leve, porém grande.",
    },
];

// ADICIONADO: texto exibido dentro do selo de status de cada card
const ROTULO_STATUS = {
    disponivel: "DISPONÍVEL",
    agendado: "AGENDADO",
    aguardando: "AGUARDANDO FINALIZAÇÃO",
};

export function Residuos() {
    // ADICIONADO: lista de resíduos (state para permitir cancelar um item)
    const [residuos, setResiduos] = useState(RESIDUOS_INICIAIS);
    // ADICIONADO: valores digitados/selecionados nos campos (ainda não aplicados)
    const [busca, setBusca] = useState("");
    const [tipo, setTipo] = useState("todos");
    const [status, setStatus] = useState("todos");
    // ADICIONADO: filtros realmente aplicados (só mudam ao clicar em "Filtrar")
    const [filtros, setFiltros] = useState({ busca: "", tipo: "todos", status: "todos" });

    // ADICIONADO: copia os valores dos campos para os filtros aplicados
    function aplicarFiltros() {
        setFiltros({ busca, tipo, status });
    }

    // ADICIONADO: remove um resíduo da lista (botão "Cancelar")
    function cancelarResiduo(id) {
        setResiduos(residuos.filter((r) => r.id !== id));
    }

    // ADICIONADO: gera a lista visível aplicando busca, tipo e status
    const residuosFiltrados = residuos.filter((r) => {
        const bateBusca = r.material.toLowerCase().includes(filtros.busca.toLowerCase());
        const bateTipo = filtros.tipo === "todos" || r.tipo === filtros.tipo;
        const bateStatus = filtros.status === "todos" || r.status === filtros.status;
        return bateBusca && bateTipo && bateStatus;
    });

    return (
        // ADICIONADO: fragmento para ter cabeçalho, conteúdo e rodapé lado a lado
        <>


            <main className="main">

                {/* Corrigido o texto: ESTABELECIMENTO */}
                <h1 className="painel-estabelecimento">PAINEL DO ESTABELECIMENTO</h1>
                <h1 className="meus-residos">Meus resíduos</h1>
                <h1 className="gerencie">Gerencie e acompanhe suas operações na Ecoleta.</h1>

                {/* ADICIONADO: linha que agrupa busca, selects e botões lado a lado */}
                <div className="barra-filtros">
                    <div className="busca">
                        
                        <input
                            className="barra-pesquisa"
                            type="text"
                            placeholder="Buscar por material"
                            // ADICIONADO: liga o input ao state
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>

                    {/* ADICIONADO: select de tipo de material */}
                    <select className="select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                        <option value="todos">Todos os tipos</option>
                        <option value="vidro">Vidro</option>
                        <option value="papel">Papel</option>
                        <option value="plastico">Plástico</option>
                    </select>

                    {/* ADICIONADO: select de status */}
                    <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="todos">Todos os status</option>
                        <option value="disponivel">Disponível</option>
                        <option value="agendado">Agendado</option>
                        <option value="aguardando">Aguardando finalização</option>
                    </select>

                    {/* ADICIONADO: onClick aplica os filtros */}
                    <button className="botao-filtrar" onClick={aplicarFiltros}>
                        <p>Filtrar</p>
                    </button>

                    {/* ADICIONADO: botão verde de novo resíduo */}
                    <button className="botao-novo">+ Novo Resíduo</button>
                </div>

                {/* ADICIONADO: lista de cards */}
                <section className="lista-residuos">
                    {/* ADICIONADO: mensagem quando nenhum resíduo bate com os filtros */}
                    {residuosFiltrados.length === 0 && (
                        <p className="lista-vazia">Nenhum resíduo encontrado. Ajuste os filtros e tente de novo.</p>
                    )}

                    {/* ADICIONADO: um card para cada resíduo filtrado */}
                    {residuosFiltrados.map((r) => (
                        <article className="card" key={r.id}>

                            {/* ADICIONADO: topo do card com ícone, nome e selo de status */}
                            <div className="card-topo">
                                <div className="card-icone">
                                    {/* ADICIONADO: ícone de caixa em SVG */}
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F9D63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
                                        <path d="M3 8l9 5 9-5M12 13v8" />
                                    </svg>
                                </div>
                                <div className="card-titulo">
                                    <h2>{r.material}</h2>
                                    <small>{r.descricaoStatus}</small>
                                </div>
                                {/* ADICIONADO: a classe do selo muda conforme o status (cores no CSS) */}
                                <span className={`selo selo-${r.status}`}>{ROTULO_STATUS[r.status]}</span>
                            </div>

                            {/* ADICIONADO: três colunas com quantidade, data e horário */}
                            <div className="card-info">
                                <div>
                                    <strong>Quantidade</strong>
                                    <small>{r.quantidade}</small>
                                </div>
                                <div className="info-centro">
                                    <strong>Data disponível</strong>
                                    <small>{r.data}</small>
                                </div>
                                <div className="info-direita">
                                    <strong>Horário</strong>
                                    <small>{r.horario}</small>
                                </div>
                            </div>

                            {/* ADICIONADO: linha de baixo com observação e ações */}
                            <div className="card-rodape">
                                <p className="observacao">{r.observacao}</p>

                                {/* ADICIONADO: ações mudam conforme o status */}
                                {r.status === "disponivel" && (
                                    <div className="acoes">
                                        <button className="botao-acao">Editar</button>
                                        <button className="botao-acao" onClick={() => cancelarResiduo(r.id)}>Cancelar</button>
                                    </div>
                                )}
                                {r.status === "agendado" && (
                                    <div className="acoes">
                                        <button className="botao-acao">Ver Coleta</button>
                                    </div>
                                )}
                                {r.status === "aguardando" && (
                                    <p className="aviso-aguardando">Aguardando a empresa coletora finalizar a coleta.</p>
                                )}
                            </div>
                        </article>
                    ))}
                </section>

  
            </main>
        </>
    );
}
