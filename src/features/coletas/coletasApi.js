// Funções que conversam com a API na tela de Coletas.
import { rotaBase, pegarToken } from '../../services/api';

// A API devolve os dados de um jeito (com objetos dentro de objetos),
// mas o nosso card usa um formato mais simples.
// Esta função "traduz" uma coleta da API para o formato do card.
// Se a API mudar, só precisamos ajustar esta função.
function converterColeta(coleta) {
  return {
    id_coleta: coleta.id,
    status_coleta: coleta.status_atual,
    nome_estabelecimento: coleta.residuo.estabelecimento.nome,
    material: coleta.residuo.tipo_material.material,
    quantidade: coleta.residuo.quantidade,
    distancia: coleta.residuo.distancia_km,
    valor_acordado: coleta.valor_acordado
  };
}

// BUSCA AS COLETAS DA EMPRESA -> GET /empresas-coletoras/coletas
// O id da empresa não vai na URL: a API descobre pelo token do login.
// Devolve uma lista de coletas, ou false se der erro ou vier vazia.
export const getColetasEmpresa = async function () {
  let url = `${rotaBase}/empresas-coletoras/coletas`;

  try {
    let response = await fetch(url, {
      // Authorization envia o token para a API saber quem está pedindo
      headers: { Authorization: `Bearer ${pegarToken()}` }
    });

    if (response.ok) {
      let respostaAPI = await response.json(); // lista de coletas

      if (respostaAPI.length > 0) {
        // map aplica a função "converterColeta" em cada coleta da lista
        return respostaAPI.map(converterColeta);
      } else {
        console.warn('A API não retornou nada');
        return false;
      }
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};
