import { requisicao } from '../../services/API';

function converterOferta(oferta) {
  return {
    id: oferta.id_oferta_inicial,
    idColeta: oferta.id_coleta,
    estabelecimento: oferta.nome_estabelecimento,
    material: oferta.material,
    quantidade: oferta.quantidade,
    data: oferta.data_disponivel,
    valor: oferta.valor_ofertado,
    status: oferta.status_oferta,
    horarioInicial: oferta.horario_inicial || '',
    horarioFinal: oferta.horario_final || '',
    logradouro: oferta.logradouro || '',
    numero: oferta.numero || '',
    bairro: oferta.bairro || '',
    cidade: oferta.nome_cidade || '',
    observacao: oferta.observacao || ''
  };
}

// Converte a resposta do /home para o formato que a tela usa.
// ATENÇÃO: o time da API ainda está finalizando o /home.
// Se o nome de algum campo mudar, é SÓ AQUI que precisamos ajustar.
function converterHome(home) {
  let resumo = home.response.resumo;

  return {
    nome: resumo.nome_empresa || '',
    kg: Number(resumo.soma_total_quantidade) || 0,
    residuosDisponiveis: resumo.residuos_disponiveis || 0,
    ofertasEnviadas: resumo.ofertas_enviadas || 0,
    coletasAgendadas: resumo.coletas_agendadas || 0,
    coletasConcluidas: resumo.coletas_concluidas || 0,
    ofertasRecentes: (home.response.ofertas || []).map(converterOferta)
  };
}

export const getHome = async function () {
  let resultado = await requisicao('/v1/ecoleta/empresa-coletora/home');

  // Sem sucesso, ou sem o resumo que a tela precisa: devolve false
  if (!resultado.ok || !resultado.dados?.response?.resumo) {
    return false;
  }

  // try/catch: se a API mudar algum campo, a tela recebe false em vez de quebrar
  try {
    return converterHome(resultado.dados);
  } catch (erro) {
    console.error(erro);
    return false;
  }
};