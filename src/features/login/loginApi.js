// Função que conversa com a API na tela de Login.
import { rotaBase } from '../../services/API';

// ENTRAR -> POST /login/empresa-coletora
// Recebe o CNPJ (já formatado) e a senha.
// Devolve { ok: true, accessToken, refreshToken } se deu certo,
// ou { ok: false, mensagem: '...' } se deu erro.
export const loginEmpresa = async function (cnpj, senha) {
  let url = `${rotaBase}/v1/ecoleta/login/empresa-coletora`;

  // try/catch: se a internet cair ou a API estiver fora, o catch trata o erro
  try {
    let response = await fetch(url, {
      method: 'POST', // POST = enviar dados para a API
      headers: { 'Content-Type': 'application/json' }, // avisa que estamos enviando JSON
      // ATENÇÃO: o swagger ainda mostra "email" no login. Como o login será por CNPJ,
      // enviamos "cnpj". Se a API usar outro nome para este campo, é só trocar aqui.
      body: JSON.stringify({ cnpj: cnpj, senha: senha })
    });

    if (response.ok) {
      // A API responde com os dois tokens: { accessToken, refreshToken }
      let respostaAPI = await response.json();
      return {
        ok: true,
        token: respostaAPI.response.token
      };
    } else if (response.status === 401) {
      // 401 = credenciais inválidas
      return { ok: false, mensagem: 'CNPJ ou senha incorretos.' };
    } else if (response.status === 400) {
      return { ok: false, mensagem: 'Preencha o CNPJ e a senha.' };
    } else {
      return { ok: false, mensagem: 'Não foi possível entrar. Tente novamente.' };
    }
  } catch (error) {
    console.error(error);
    return { ok: false, mensagem: 'Não foi possível conectar ao servidor.' };
  }
};