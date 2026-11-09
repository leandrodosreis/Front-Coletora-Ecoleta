import { rotaBase, pegarToken } from '../../services/API';

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
  let url = `${rotaBase}/v1/ecoleta/empresa-coletora/historico`;

  try {
    let response = await fetch(url, {
      // Authorization envia o token para a API saber quem está pedindo
      headers: { Authorization: `Bearer ${pegarToken()}` }
    });

    if (response.ok) {
      let respostaAPI = await response.json();

      let historico = respostaAPI.response.historico || [];
        // map aplica "converterEvento" em cada evento da lista

      return historico.map(converterEvento);
    }

    return false;

  } catch (error) {
    console.error(error);
    return false;
  }
};