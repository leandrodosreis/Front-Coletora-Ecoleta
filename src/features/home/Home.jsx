// TELA DE home da empresa coletora.
// Como funciona, resumindo:
//  1. Quando a tela abre, buscamos o resumo na API (useEffect).
//  2. Guardamos os dados no estado "home".
//  3. A tela desenha 4 partes: boas-vindas, números, banner e ofertas recentes.
// Nada aqui é componente separado: tudo fica neste arquivo, porque só esta tela usa.
// Os botões ainda não têm função.
import { useState, useEffect } from 'react';
import { getHome } from './homeApi';
import './home.css';

// Valores iniciais: tudo zerado, para a tela já ter o que mostrar antes da API responder
const homeInicial = {
  nome: '',
  kg: 0,
  residuosDisponiveis: 0,
  ofertasEnviadas: 0,
  coletasAgendadas: 0,
  coletasConcluidas: 0,
  ofertasRecentes: []
};

// Mostra o número com 2 dígitos, como no design: 5 vira "05" (padStart completa com zeros à esquerda)
function doisDigitos(numero) {
  return String(numero).padStart(2, '0');
}

// A API manda números como "15.00". Tira os zeros e troca o ponto por vírgula: 15,5
function formatarNumero(valor) {
  return String(Number(valor)).replace('.', ',');
}

// Mostra o valor em reais com 2 casas e vírgula: 100,00
function formatarValor(valor) {
  return Number(valor).toFixed(2).replace('.', ',');
}

// A API manda a data assim: "2026-08-27T14:30:00". Aqui viramos "27/08/2026".
// slice(0, 10) pega só os 10 primeiros caracteres ("2026-08-27")
// split('-') separa em partes: ["2026", "08", "27"]
function formatarData(data) {
  let [ano, mes, dia] = data.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

export function Home() {
  // ESTADOS (informações que, ao mudar, atualizam a tela)
  const [home, setHome] = useState(homeInicial); // dados do resumo
  const [carregando, setCarregando] = useState(true); // true = ainda buscando na API
  const [erro, setErro] = useState(false); // true = a API falhou

  // useEffect roda código quando a tela aparece.
  // O [] no final significa: "rode uma vez só, quando a tela abrir".
  useEffect(() => {
    async function carregarDados() {
      let dados = await getHome(); // espera a resposta da API

      if (dados) {
        setHome(dados);
      } else {
        setErro(true);
      }
      setCarregando(false); // terminou de carregar
    }

    carregarDados();
  }, []);

  // Lista dos 4 cards de números. Em vez de escrever 4 cards iguais,
  // escrevemos uma lista e usamos map para desenhar um card para cada item.
  // "destaque: true" deixa o card com fundo verde (como no design).
  const numeros = [
    { icone: '📦', valor: home.residuosDisponiveis, texto: 'resíduos disponíveis' },
    { icone: '💲', valor: home.ofertasEnviadas, texto: 'ofertas enviadas', destaque: true },
    { icone: '📅', valor: home.coletasAgendadas, texto: 'coletas agendadas' },
    { icone: '✔', valor: home.coletasConcluidas, texto: 'coletas concluídas' }
  ];

  return (
    <main className="home_tela">
      <div className="home_conteudo">
        {/* Textos do topo da tela */}
        <p className="home_etiqueta">PAINEL DA EMPRESA COLETORA</p>
        <h1 className="home_titulo">Home</h1>
        <p className="home_subtitulo">Encontre novos materiais e acompanhe suas atividades.</p>

        {/* Avisos de carregamento e de erro */}
        {carregando && <p className="home_aviso">Carregando...</p>}
        {erro && <p className="home_aviso">Não foi possível carregar o home.</p>}

        {/* O conteúdo só aparece depois de carregar, e se não deu erro.
            O <> </> agrupa vários elementos sem criar uma div extra. */}
        {!carregando && !erro && (
          <>
            {/* ===== PARTE 1: CARD DE BOAS-VINDAS ===== */}
            <section className="home_card home_boasvindas">
              <div className="home_boasvindas_texto">
                <p className="home_sustentavel">🛡 Operação sustentável</p>
                <h2>Olá, {home.nome}.</h2>
                <p>Cada coleta aproxima materiais de um novo ciclo.</p>
              </div>

              {/* Lado direito: folha + total de kg (separado por uma linha vertical) */}
              <div className="home_kg">
                <span className="home_kg_icone">🍃</span>
                <div>
                  <strong>{formatarNumero(home.kg)} kg</strong>
                  <span>já encaminhados</span>
                </div>
              </div>
            </section>

            {/* ===== PARTE 2: OS 4 CARDS DE NÚMEROS ===== */}
            <div className="home_numeros">
              {numeros.map((item) => (
                <div
                  key={item.texto}
                  // Se for o card de destaque, ganha a classe extra (fundo verde)
                  className={item.destaque ? 'home_numero home_numero_destaque' : 'home_numero'}
                >
                  <span className="home_numero_icone">{item.icone}</span>
                  <div>
                    <strong>{doisDigitos(item.valor)}</strong>
                    <span>{item.texto}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* ===== PARTE 3: BANNER ESCURO "PRÓXIMO PASSO" ===== */}
            <section className="home_banner">
              <div>
                <p className="home_banner_etiqueta">PRÓXIMO PASSO</p>
                <h2>Encontre resíduos</h2>
                <p>Encontre materiais disponíveis próximos à sua empresa.</p>
              </div>

              {/* Sem função por enquanto */}
              <button className="home_banner_botao">Encontrar resíduos →</button>
            </section>

            {/* ===== PARTE 4: OFERTAS RECENTES ===== */}
            <p className="home_etiqueta home_etiqueta_secao">MOVIMENTAÇÕES RECENTES</p>

            <div className="home_lista_topo">
              <h2>Ofertas recentes</h2>
              {/* Sem função por enquanto */}
              <button className="home_ver_todas">VER TODAS →</button>
            </div>

            {/* Se a lista estiver vazia, mostra um aviso */}
            {home.ofertasRecentes.length === 0 && (
              <p className="home_aviso">Nenhuma oferta recente.</p>
            )}

            {/* Para cada oferta da lista, desenha uma linha */}
            {home.ofertasRecentes.map((oferta) => (
              <div key={oferta.id} className="home_oferta">
                <span className="home_oferta_icone">🏢</span>

                <div className="home_oferta_info">
                  <p className="home_oferta_nome">{oferta.estabelecimento}</p>
                  <p className="home_oferta_detalhes">
                    {oferta.material} - {formatarNumero(oferta.quantidade)} kg - {formatarData(oferta.data)}
                  </p>
                </div>

                {/* Grupo da direita: valor, selo de status e botão */}
                <div className="home_oferta_lado">
                  <div className="home_oferta_valor">
                    <span>Valor ofertado</span>
                    <strong>R$ {formatarValor(oferta.valor)}</strong>
                  </div>

                  {/* A classe do selo depende do status:
                      "Aceita" vira home_selo_aceita, "Pendente" vira home_selo_pendente...
                      toLowerCase() deixa o texto em minúsculas para montar o nome da classe */}
                  <span className={'home_selo home_selo_' + oferta.status.toLowerCase()}>
                    {oferta.status}
                  </span>

                  {/* Oferta aceita tem coleta; as outras só têm a oferta para ver */}
                  <button className="home_botao_pequeno">
                    {oferta.status === 'Aceita' ? 'Ver coleta' : 'Ver oferta'}
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </main>
  );
}