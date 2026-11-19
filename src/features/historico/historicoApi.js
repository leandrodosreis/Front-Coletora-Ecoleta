import { requisicao } from '../../services/API';

function converterEvento(evento) {
  return {
    chave: `${evento.tipo_registro}-${evento.id_coleta ?? evento.id_oferta_inicial}-${evento.data_disponivel}`,
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

  if (!resultado.ok || !resultado.dados?.response) {
    return false;
  }

  try {
    let historico = resultado.dados.response.historico || [];

    // map aplica "converterEvento" em cada evento da lista
    return historico.map(converterEvento);
  } catch (erro) {
    console.error(erro);
    return false;
  }
};