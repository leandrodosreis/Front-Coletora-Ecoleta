// Função que conversa com a API na tela de Histórico.
import { rotaBase, pegarToken } from '../../services/api';

// Converte UM evento do histórico para o formato que a tela usa.
// ATENÇÃO: o swagger atual só tem tipo, id_referencia, status e data_hora_status.
// Combinamos que a API vai incluir também nome, material, quantidade e valor,
// mas os nomes abaixo (nome_estabelecimento, material, quantidade, valor) são uma SUPOSIÇÃO.
// Se vierem com outro nome, é SÓ AQUI que precisamos ajustar.
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

// BUSCA O HISTÓRICO DA EMPRESA -> GET /empresas-coletoras/historico
// O id da empresa não vai na URL: a API descobre pelo token do login.
// Devolve uma lista de eventos, ou false se der erro ou vier vazia.
export const getHistorico = async function () {
  let url = `${rotaBase}/empresas-coletoras/historico`;

  try {
    let response = await fetch(url, {
      // Authorization envia o token para a API saber quem está pedindo
      headers: { Authorization: `Bearer ${pegarToken()}` }
    });

    if (response.ok) {
      let respostaAPI = await response.json(); // lista de eventos

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