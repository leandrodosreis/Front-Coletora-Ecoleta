import { rotaBase } from '../../services/api';

export const cadastrarEmpresa = async function (dados) {
  let url = `${rotaBase}/empresas`;

  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    let respostaAPI = await response.json();

    if (response.ok) {
      return { ok: true };
    } else {
      // a API devolve { mensagem: '...', campos: { cnpj: '...' } }
      return { ok: false, mensagem: respostaAPI.mensagem, campos: respostaAPI.campos };
    }
  } catch (error) {
    console.error(error);
    return { ok: false, mensagem: 'Não foi possível conectar ao servidor.' };
  }
};
