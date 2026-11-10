// TELA DE ESTABELECIMENTOS PRÓXIMOS da empresa coletora.
// Como funciona, resumindo:
//  1. Quando a tela abre, buscamos os estabelecimentos na API (useEffect).
//  2. Guardamos a lista no estado "estabelecimentos".
//  3. A BUSCA (campo de texto) filtra a lista aqui mesmo, a cada letra digitada.
//  4. O FILTRO de tipo + botão Filtrar pedem para a API só os estabelecimentos daquele material.
//  5. Para cada estabelecimento da lista, desenhamos um card (map).
// O botão "Ver resíduos" ainda NÃO tem função.
import { useState, useEffect } from 'react';
import { getEstabelecimentosProximos } from './estabelecimentoApi';
import './Estabelecimento.css';

// A API manda números como "35.00". Tira os zeros e troca o ponto por vírgula: 35
function formatarNumero(valor) {
  return String(Number(valor)).replace('.', ',');
}

// Monta o texto dos resíduos. Exemplo: "Vidro - 35 kg | Papelão - 18 kg"
function montarResiduos(residuos) {
  // Se não tiver nenhum resíduo, mostra um aviso no lugar
  if (residuos.length === 0) {
    return 'Nenhum resíduo disponível';
  }

  // map transforma cada resíduo em um texto. join junta os textos com " | " entre eles.
  return residuos
    .map((residuo) => `${residuo.material} - ${formatarNumero(residuo.quantidade)} kg`)
    .join(' | ');
}

// Monta a lista de materiais do filtro, sem repetir. Cada item fica { id, nome }.
function listarMateriais(estabelecimentos) {
  let lista = [];

  for (let estabelecimento of estabelecimentos) {
    for (let residuo of estabelecimento.residuos) {
      // find confere se esse material já está na lista (para não repetir)
      let jaExiste = lista.find((item) => item.id === residuo.id);

      if (!jaExiste) {
        lista.push({ id: residuo.id, nome: residuo.material });
      }
    }
  }

  return lista;
}

export function Estabelecimentos() {
  // ESTADOS (informações que, ao mudar, atualizam a tela)
  const [estabelecimentos, setEstabelecimentos] = useState([]); // lista vinda da API
  const [materiais, setMateriais] = useState([]); // opções do filtro (carregadas uma vez só)
  const [tipoEscolhido, setTipoEscolhido] = useState(''); // id do material escolhido ('' = todos)
  const [busca, setBusca] = useState(''); // texto digitado na busca
  const [carregando, setCarregando] = useState(true); // true = ainda buscando na API

  // useEffect roda código quando a tela aparece.
  // O [] no final significa: "rode uma vez só, quando a tela abrir".
  useEffect(() => {
    async function carregarDados() {
      let dados = await getEstabelecimentosProximos(); // sem filtro: traz todos

      if (dados) {
        setEstabelecimentos(dados);
        // As opções do filtro saem desta primeira lista (a lista completa)
        setMateriais(listarMateriais(dados));
      } else {
        setEstabelecimentos([]); // deu erro ou veio vazio: lista vazia
      }
      setCarregando(false); // terminou de carregar
    }

    carregarDados();
  }, []);

  // Roda quando o usuário clica em Filtrar: pede para a API só o material escolhido
  async function filtrar() {
    setCarregando(true);
    let dados = await getEstabelecimentosProximos(tipoEscolhido); // '' = todos

    if (dados) {
      setEstabelecimentos(dados);
    } else {
      setEstabelecimentos([]); // nenhum estabelecimento com esse material
    }
    setCarregando(false);
  }

  // BUSCA: criamos uma nova lista só com os estabelecimentos que combinam com o texto digitado.
  // toLowerCase deixa tudo em minúsculas, para não diferenciar "Vidro" de "vidro".
  // trim tira os espaços do começo e do fim.
  const texto = busca.toLowerCase().trim();
  const visiveis = estabelecimentos.filter((estabelecimento) => {
    // true se o nome do estabelecimento tem o texto
    let achouNome = estabelecimento.nome.toLowerCase().includes(texto);

    // some devolve true se ALGUM resíduo tem o texto no nome do material
    let achouResiduo = estabelecimento.residuos.some((residuo) =>
      residuo.material.toLowerCase().includes(texto)
    );

    // Com o campo vazio, includes('') é sempre true: todos aparecem
    return achouNome || achouResiduo;
  });

  return (
    <main className="estabelecimentos_tela">
      <div className="estabelecimentos_conteudo">
        {/* Textos do topo da tela */}
        <p className="estabelecimentos_etiqueta">PAINEL DA EMPRESA COLETORA</p>
        <h1 className="estabelecimentos_titulo">Estabelecimentos próximos</h1>
        <p className="estabelecimentos_subtitulo">Gerencie e acompanhe suas operações na Ecoleta.</p>

        {/* ===== BARRA DE BUSCA E FILTRO ===== */}
        <div className="estabelecimentos_filtros">
          <div className="estabelecimentos_busca">
            <span>🔍</span>
            {/* value + onChange ligam o campo ao estado "busca" */}
            <input
              type="text"
              placeholder="Buscar estabelecimento ou resíduo"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </div>

          {/* O select fica dentro de uma div para podermos desenhar a setinha dele */}
          <div className="estabelecimentos_select_caixa">
            <select value={tipoEscolhido} onChange={(evento) => setTipoEscolhido(evento.target.value)}>
              <option value="">Todos os tipos</option>
              {materiais.map((material) => (
                <option key={material.id} value={material.id}>{material.nome}</option>
              ))}
            </select>
          </div>

          {/* onClick: roda a função "filtrar" */}
          <button className="estabelecimentos_botao_filtrar" onClick={filtrar}>Filtrar</button>
        </div>

        {/* Avisos de carregamento e de lista vazia */}
        {carregando && <p className="estabelecimentos_aviso">Carregando estabelecimentos...</p>}
        {!carregando && visiveis.length === 0 && (
          <p className="estabelecimentos_aviso">Nenhum estabelecimento encontrado.</p>
        )}

        {/* ===== GRADE DE CARDS: para cada estabelecimento visível, desenha um card ===== */}
        {!carregando && (
          <div className="estabelecimentos_grade">
            {visiveis.map((estabelecimento) => (
              <div key={estabelecimento.id} className="estabelecimentos_card">
                {/* Parte de cima do card: fundo verde com o marcador de mapa */}
                <div className="estabelecimentos_mapa">
                  <span className="estabelecimentos_pin"></span>
                </div>

                {/* Parte de baixo do card: as informações */}
                <div className="estabelecimentos_corpo">
                  <div className="estabelecimentos_topo">
                    <h2>{estabelecimento.nome}</h2>
                    {/* A distância pode vir vazia da API: só mostramos se existir */}
                    {estabelecimento.distancia != null && (
                      <span>- {formatarNumero(estabelecimento.distancia)} km de distância</span>
                    )}
                  </div>

                  <p className="estabelecimentos_endereco">{estabelecimento.endereco}</p>

                  <hr className="estabelecimentos_linha" />

                  <p className="estabelecimentos_label">Resíduos disponíveis</p>
                  <p className="estabelecimentos_residuos">{montarResiduos(estabelecimento.residuos)}</p>

                  {/* Sem função por enquanto */}
                  <button className="estabelecimentos_botao">Ver resíduos →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}