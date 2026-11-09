import { rotaBase, pegarToken } from '../../services/API';

function converterOferta(oferta) {
  return {
    id: oferta.id_oferta_inicial,
    estabelecimento: oferta.nome_estabelecimento,
    material: oferta.material,
    quantidade: oferta.quantidade,
    data: oferta.data_disponivel,
    valor: oferta.valor_ofertado,
    status: oferta.status_oferta
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

  let url = `${rotaBase}/v1/ecoleta/empresa-coletora/home`;

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