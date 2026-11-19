// Função que conversa com a API na tela de Login.
import { requisicao } from '../../services/API';

// ENTRAR -> POST /login/empresa-coletora
// Recebe o CNPJ (já formatado) e a senha.
// Devolve { ok: true, token } se deu certo,
// ou { ok: false, mensagem: '...' } se deu erro.
export const loginEmpresa = async function (cnpj, senha) {
  // autenticado: false porque ainda não existe token: é o login que vai criá-lo.
  // ATENÇÃO: o swagger ainda mostra "email" no login. Como o login será por CNPJ,
  // enviamos "cnpj". Se a API usar outro nome para este campo, é só trocar aqui.
  let resultado = await requisicao('/v1/ecoleta/login/empresa-coletora', {
    metodo: 'POST',
    corpo: { cnpj: cnpj, senha: senha },
    autenticado: false
  });

  if (resultado.ok) {
    let token = resultado.dados?.response?.token;

    // Sucesso sem token na resposta seria um erro da API: não deixa entrar
    if (token) {
      return { ok: true, token: token };
    }

    return { ok: false, mensagem: 'Não foi possível entrar. Tente novamente.' };
  }

  if (resultado.status === 0) {
    return { ok: false, mensagem: 'Não foi possível conectar ao servidor.' };
  }

  if (resultado.status === 401) {
    // 401 aqui = credenciais inválidas
    return { ok: false, mensagem: 'CNPJ ou senha incorretos.' };
  }

  if (resultado.status === 400) {
    return { ok: false, mensagem: 'Preencha o CNPJ e a senha.' };
  }

  return { ok: false, mensagem: 'Não foi possível entrar. Tente novamente.' };
};