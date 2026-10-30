import { rotaBase } from '../../services/api';

export const getCep = async function (cep) {
  let url = `${rotaBase}/cep/${cep}`;

  try {
    let response = await fetch(url);

    if (response.ok) {
      let respostaAPI = await response.json();
      return respostaAPI;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const cadastrarEmpresa = async function (dados) {
  let url = `${rotaBase}/cadastro/empresa-coletora`;

  try {
    let response = await fetch(url, {
      method: 'POST', // POST = enviar dados novos para a API
      headers: { 'Content-Type': 'application/json' }, // avisa que estamos enviando JSON
      body: JSON.stringify(dados) // transforma o objeto em texto JSON
    });

    // A API responde só com o status (201, 400, 409...), sem corpo,
    // então olhamos o status para saber o que aconteceu
    if (response.ok) {
      return { ok: true };
    } else if (response.status === 409) {
      return { ok: false, mensagem: 'Email ou CNPJ já cadastrado.' };
    } else if (response.status === 400) {
      return { ok: false, mensagem: 'Dados inválidos. Confira os campos.' };
    } else {
      return { ok: false, mensagem: 'Não foi possível concluir o cadastro.' };
    }
  } catch (error) {
    console.error(error);
    return { ok: false, mensagem: 'Não foi possível conectar ao servidor.' };
  }
};
