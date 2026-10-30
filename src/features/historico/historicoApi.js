import { rotaBase, pegarToken } from '../../services/api';

function converterEvento(evento) {
  return {
    // A "chave" identifica cada linha da lista (o React pede um valor único)
    chave: `${evento.tipo}-${evento.id_referencia}-${evento.data_hora_status}`,
    estabelecimento: evento.nome_estabelecimento || '',
    material: evento.material || '',
    quantidade: evento.quantidade,
    valor: evento.valor,
    status: evento.status, // Concluída, Recusada...
    data: evento.data_hora_status
  };
}

export const getHistorico = async function () {
  let url = `${rotaBase}/empresas-coletoras/historico`;

  try {
    let response = await fetch(url, {
      // Authorization envia o token para a API saber quem está pedindo
      headers: { Authorization: `Bearer ${pegarToken()}` }
    });

    if (response.ok) {
      let respostaAPI = await response.json(); 

      if (respostaAPI.length > 0) {
        // map aplica "converterEvento" em cada evento da lista
        return respostaAPI.map(converterEvento);
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