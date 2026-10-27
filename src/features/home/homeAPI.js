// Função que conversa com a API na tela de home.
import { rotaBase, pegarToken } from '../../services/api';

// Converte UMA oferta da API para o formato que a tela usa.
// A API entrega objetos dentro de objetos (oferta.residuo.tipo_material.material...),
// aqui deixamos tudo "plano" para ficar fácil de usar na tela.
function converterOferta(oferta) {
  return {
    id: oferta.id,
    estabelecimento: oferta.residuo.estabelecimento.nome,
    material: oferta.residuo.tipo_material.material,
    quantidade: oferta.residuo.quantidade,
    data: oferta.data_hora_oferta,
    valor: oferta.valor_ofertado,
    status: oferta.status_atual // Pendente, Aceita ou Recusada
  };
}

// Converte a resposta do /home para o formato que a tela usa.
// ATENÇÃO: o time da API ainda está finalizando o /home.
// Se o nome de algum campo mudar, é SÓ AQUI que precisamos ajustar.
function converterHome(home) {
  return {
    // Estes 3 campos foram combinados, mas os nomes ainda são uma suposição:
    nome: home.nome_empresa || '',
    kg: home.kg_encaminhados || 0,
    residuosDisponiveis: home.residuos_disponiveis || 0,

    // "Ofertas enviadas" = pendentes + aceitas + recusadas (soma de todas)
    ofertasEnviadas: home.ofertas_pendentes + home.ofertas_aceitas + home.ofertas_recusadas,

    // Estes dois já existem no swagger
    coletasAgendadas: home.coletas_agendadas,
    coletasConcluidas: home.coletas_concluidas,

    // map aplica "converterOferta" em cada oferta da lista
    ofertasRecentes: (home.ofertas_recentes || []).map(converterOferta)
  };
}

// BUSCA O RESUMO DA TELA INICIAL -> GET /empresas-coletoras/home
// O id da empresa não vai na URL: a API descobre pelo token do login.
// Devolve os dados já convertidos, ou false se der erro.
export const getHome = async function () {
  let url = `${rotaBase}/empresas-coletoras/home`;

  try {
    let response = await fetch(url, {
      // Authorization envia o token para a API saber quem está pedindo
      headers: { Authorization: `Bearer ${pegarToken()}` }
    });

    if (response.ok) {
      let respostaAPI = await response.json();
      return converterHome(respostaAPI);
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};