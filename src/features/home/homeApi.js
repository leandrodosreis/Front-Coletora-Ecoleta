import { requisicao } from '../../services/API';

function converterEvento(evento) {
  return {
    chave: `${evento.tipo_registro}-${evento.id_coleta ?? evento.id_oferta_inicial}-${evento.data_disponivel}`,
    idColeta: evento.id_coleta,
    idOferta: evento.id_oferta_inicial,
    tipoRegistro: evento.tipo_registro,
    estabelecimento: evento.nome_estabelecimento || '',
    material: evento.material || '',
    quantidade: evento.quantidade,
    valor: evento.valor_historico,
    status: evento.status_historico,
    data: evento.data_disponivel
  };
}

export const getHistorico = async function () {
  let resultado = await requisicao('/v1/ecoleta/empresa-coletora/historico');

  if (!resultado.ok || !resultado.dados?.response) return false;

  try {
    let historico = resultado.dados.response.historico || [];
    return historico.map(converterEvento);
  } catch (erro) {
    console.error(erro);
    return false;
  }
};

export const getDetalhesHistorico = async function (item) {
  let ehColeta = item.tipoRegistro === 'coleta' || item.idColeta != null;
  let caminho = ehColeta
    ? `/v1/ecoleta/empresa-coletora/historico/coleta/${item.idColeta}`
    : `/v1/ecoleta/empresa-coletora/historico/oferta/${item.idOferta}`;

  let resultado = await requisicao(caminho);

  if (!resultado.ok || !resultado.dados?.response) {
    throw new Error(resultado.dados?.message || 'Não foi possível carregar os detalhes.');
  }

  let resposta = resultado.dados.response;
  let detalhes = ehColeta ? resposta.coleta?.[0] : resposta.oferta?.[0];

  if (!detalhes) throw new Error('Nenhum detalhe foi encontrado para este registro.');
  return detalhes;
};
