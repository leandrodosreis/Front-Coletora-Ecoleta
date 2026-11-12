
import { rotaBase, pegarToken, sairDoSistema } from '../../services/API';

// Organiza os dados recebidos da API para utilização na tela.
function formatarColeta(coleta) {
  return {
    id_coleta: coleta.id_coleta,
    status_coleta: coleta.status_coleta,
    nome_estabelecimento: coleta.nome_estabelecimento || '',
    material: coleta.material || '',
    quantidade: coleta.quantidade,
    distancia: coleta.distancia,
    valor_acordado: coleta.valor_acordado,
    data_disponivel: coleta.data_disponivel || ''
  };
}

// Busca as coletas da empresa coletora autenticada.
export const getColetasEmpresa = async function () {
  let url = `${rotaBase}/v1/ecoleta/empresa-coletora/coletas`;

  try {
    let resposta = await fetch(url, {
      headers: {
        Authorization: `Bearer ${pegarToken()}`
      }
    });

    if (resposta.status === 401) {
      sairDoSistema();
      return false;
    }

    if (!resposta.ok) {
      return false;
    }

    let dadosResposta = await resposta.json();
    let coletas = dadosResposta.response?.coletas || [];

    if (!Array.isArray(coletas)) {
      return false;
    }

    return coletas.map(formatarColeta);

  } catch (erro) {
    console.error('Erro ao buscar coletas:', erro);
    return false;
  }
};

// Registra os dados de execução e finaliza uma coleta.
export const finalizarColeta = async function (idColeta, dadosColeta) {
  if (!idColeta) {
    throw new Error('Não foi possível identificar a coleta.');
  }

  let url = `${rotaBase}/v1/ecoleta/empresa-coletora/coleta/finalizar/${idColeta}`;

  let resposta = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${pegarToken()}`
    },
    body: JSON.stringify({
      nome_coletor: dadosColeta.nome_coletor,
      placa_veiculo: dadosColeta.placa_veiculo,
      data_coleta: dadosColeta.data_coleta,
      hora_coleta: dadosColeta.hora_coleta
    })
  });

  let dadosResposta = await resposta.json().catch(() => ({}));

  if (resposta.status === 401) {
    sairDoSistema();
    throw new Error('Sua sessão expirou. Faça login novamente.');
  }

  if (!resposta.ok) {
    throw new Error(
      dadosResposta.message || 'Não foi possível finalizar a coleta.'
    );
  }

  return dadosResposta;
};
