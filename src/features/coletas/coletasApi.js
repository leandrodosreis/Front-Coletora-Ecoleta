import { requisicao, mensagemDeErro } from '../../services/API';

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
  let resultado = await requisicao('/v1/ecoleta/empresa-coletora/coletas');

  if (!resultado.ok || resultado.dados === null) {
    return false;
  }

  let coletas = resultado.dados.response?.coletas || [];

  if (!Array.isArray(coletas)) {
    return false;
  }

  try {
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

  let resultado = await requisicao(`/v1/ecoleta/empresa-coletora/coleta/finalizar/${idColeta}`, {
    metodo: 'PATCH',
    corpo: {
      nome_coletor: dadosColeta.nome_coletor,
      placa_veiculo: dadosColeta.placa_veiculo,
      data_coleta: dadosColeta.data_coleta,
      hora_coleta: dadosColeta.hora_coleta
    }
  });

  if (!resultado.ok) {
    throw new Error(mensagemDeErro(resultado, 'Não foi possível finalizar a coleta.'));
  }

  return resultado.dados ?? {};
};

// Busca os detalhes de uma coleta agendada pelo ID da coleta.
export const getDetalhesColeta = async function (idColeta) {
  if (!idColeta) {
    throw new Error('Não foi possível identificar a coleta.');
  }

  let resultado = await requisicao(`/v1/ecoleta/empresa-coletora/coletas/${idColeta}`);

  if (!resultado.ok || !resultado.dados?.response) {
    throw new Error(resultado.dados?.message || 'Não foi possível carregar os detalhes da coleta.');
  }

  let coleta = resultado.dados.response.coleta?.[0];

  if (!coleta) {
    throw new Error('Nenhum detalhe foi encontrado para esta coleta.');
  }

  return coleta;
};