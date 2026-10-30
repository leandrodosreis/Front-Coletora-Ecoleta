import { useState, useEffect } from 'react';
import { getHistorico } from './historicoApi';
import './Historico.css';

function formatarNumero(valor) {
  return String(Number(valor)).replace('.', ',');
}

function formatarValor(valor) {
  return Number(valor).toFixed(2).replace('.', ',');
}

// slice(8, 10) pega o dia ("28"), slice(5, 7) pega o mês ("08") e slice(0, 4) pega o ano ("2026")
function formatarDia(data) {
  return data.slice(8, 10);
}
function formatarMesAno(data) {
  return `${data.slice(5, 7)}/${data.slice(0, 4)}`;
}

// Escolhe a cor do selo conforme o status
function classeDoSelo(status) {
  if (status === 'Concluída') return 'historico_selo historico_selo_verde';
  if (status === 'Recusada') return 'historico_selo historico_selo_vermelho';
  return 'historico_selo historico_selo_cinza'; 
}

function montarDetalhes(item) {
  let texto = `Material: ${item.material}`;

  // Só mostra a quantidade e o valor se a API enviar
  if (item.quantidade != null) {
    texto += ` · ${formatarNumero(item.quantidade)} kg`;
  }
  if (item.valor != null) {
    // Oferta recusada mostra o valor que foi ofertado; as outras mostram o valor acordado
    let rotulo = item.status === 'Recusada' ? 'Valor ofertado' : 'Valor acordado';
    texto += ` · ${rotulo}: R$ ${formatarValor(item.valor)}`;
  }
  return texto;
}

export function Historico() {
  // ESTADOS (informações que, ao mudar, atualizam a tela)
  const [historico, setHistorico] = useState([]); // lista vinda da API
  const [carregando, setCarregando] = useState(true); // true = ainda buscando na API

  // useEffect roda código quando a tela aparece.
  // O [] no final significa: "rode uma vez só, quando a tela abrir".
  useEffect(() => {
    async function carregarDados() {
      let dados = await getHistorico(); 

      if (dados) {
        setHistorico(dados);
      } else {
        setHistorico([]); 
      }
      setCarregando(false); // terminou de carregar
    }

    carregarDados();
  }, []);

  // Opções dos filtros, tiradas da própria lista do histórico.
  // map pega só o material (ou só o status) de cada item.
  // "new Set" remove os repetidos (Vidro, Vidro, Papelão vira Vidro, Papelão).
  // Os [...] transformam o resultado de volta em uma lista.
  const materiais = [...new Set(historico.map((item) => item.material))];
  const listaStatus = [...new Set(historico.map((item) => item.status))];

  return (
    <main className="historico_tela">
      <div className="historico_conteudo">

        <p className="historico_etiqueta">PAINEL DA EMPRESA COLETORA</p>
        <h1 className="historico_titulo">Histórico de coletas</h1>
        <p className="historico_subtitulo">Gerencie e acompanhe suas operações na Ecoleta.</p>

        {/*BARRA DE BUSCA E FILTROS*/}
        <div className="historico_filtros">
          <div className="historico_busca">
            <span>🔍</span>
            <input type="text" placeholder="Buscar estabelecimento ou material" />
          </div>

          {/* Cada select fica dentro de uma div para podermos desenhar a setinha dele */}
          <div className="historico_select_caixa">
            <select>
              <option value="">Todos os tipos</option>
              {materiais.map((material) => (
                <option key={material} value={material}>{material}</option>
              ))}
            </select>
          </div>

          <div className="historico_select_caixa">
            <select>
              <option value="">Todos os status</option>
              {listaStatus.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <button className="historico_botao_filtrar">Filtrar</button>
        </div>

        {carregando && <p className="historico_aviso">Carregando histórico...</p>}
        {!carregando && historico.length === 0 && (
          <p className="historico_aviso">Nenhum registro encontrado no histórico.</p>
        )}

        {/* Para cada item do histórico, desenha uma linha*/}
        {historico.map((item) => (
          <div key={item.chave} className="historico_item">

            <div className="historico_data">
              <strong>{formatarDia(item.data)}</strong>
              <span>{formatarMesAno(item.data)}</span>
            </div>

            <div className="historico_info">
              <p className="historico_nome">{item.estabelecimento}</p>
              <p className="historico_detalhes">{montarDetalhes(item)}</p>
            </div>

            {/* Grupo da direita: selo de status e botão */}
            <div className="historico_lado">
              <span className={classeDoSelo(item.status)}>{item.status}</span>
              <button className="historico_botao_detalhe">Detalhe</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}