// Funções que conversam com a API na tela de Cadastro.
// Cada função é "async": ela espera a resposta da API antes de continuar (await).
import { rotaBase } from '../../services/api';

// BUSCA O ENDEREÇO PELO CEP -> GET /cep/{cep}
// Devolve os dados do endereço, ou false se der erro / não encontrar.
export const getCep = async function (cep) {
  let url = `${rotaBase}/cep/${cep}`;

  // try/catch: se a internet cair ou a API estiver fora, o catch trata o erro
  try {
    let response = await fetch(url);

    // response.ok é true quando a API respondeu com sucesso (status 200 a 299)
    if (response.ok) {
      let respostaAPI = await response.json(); // converte a resposta para objeto
      return respostaAPI;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// CADASTRA A EMPRESA -> POST /cadastro/empresa-coletora
// Devolve { ok: true } se deu certo, ou { ok: false, mensagem: '...' } se deu erro.
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
