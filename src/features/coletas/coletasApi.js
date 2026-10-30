import { rotaBase, pegarToken } from '../../services/api';

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
