import { rotaBase, pegarToken, sairDoSistema } from '../../services/API';

function converterColeta(coleta) {
  return {
    id_coleta: coleta.id_coleta,
    status_coleta: coleta.status_coleta,
    nome_estabelecimento: coleta.nome_estabelecimento || '',
    material: coleta.material || '',
    quantidade: coleta.quantidade,
    distancia: coleta.distancia,
    valor_acordado: coleta.valor_acordado
  };
}

export const getColetasEmpresa = async function () {
  let url = `${rotaBase}/v1/ecoleta/empresa-coletora/coletas`;

  try {
    let response = await fetch(url, {
      // Authorization envia o token para a API saber quem está pedindo
      headers: { Authorization: `Bearer ${pegarToken()}` }
    });

        // 401 = token inválido ou vencido: apaga o token e volta para o login
    if (response.status === 401) {
      sairDoSistema();
      return false;
    }

    if (response.ok) {
      let respostaAPI = await response.json(); // lista de coletas

      let coletas = respostaAPI.response.coletas || [];

        // map aplica a função "converterColeta" em cada coleta da lista
        return coletas.map(converterColeta);

    
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};
