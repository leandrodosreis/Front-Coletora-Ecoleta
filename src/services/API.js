// Endereço base da API. Todas as chamadas começam por ele.
// Troque pelo endereço real quando a API estiver pronta.
export const rotaBase = 'http://localhost:8080';

// O token é a "chave" que a API devolve no login.
// Ele fica guardado no navegador (localStorage) e é enviado nas chamadas
// que exigem login, para a API saber quem é a empresa.
export const pegarToken = function () {
  return localStorage.getItem('token');
};

// Guarda os tokens no navegador logo depois do login.
export const salvarToken = function (token) {
  localStorage.setItem('token', token);
};

// Apaga os tokens do navegador (usado no logout).
export const removerToken = function () {
  localStorage.removeItem('token');
};

export const sairDoSistema = function () {
  removerToken();
  window.location.href = '/';
};

// FAZ A REQUISIÇÃO PARA A API DA ECOLETA.
// Todas as telas passam por aqui, então token, JSON, 401 e erro de rede ficam num lugar só.
//  caminho -> parte final do endereço. Exemplo: '/v1/ecoleta/empresa-coletora/home'
//  opcoes  -> { metodo: 'GET', corpo: objeto, autenticado: true }
//    metodo      -> GET (padrão), POST, PUT, PATCH...
//    corpo       -> objeto que vai no corpo da requisição (vira JSON sozinho)
//    autenticado -> true (padrão) envia o token. Use false no login e no cadastro.
// Devolve SEMPRE um objeto { ok, status, dados }:
//    ok     -> true quando o servidor respondeu com sucesso (status 200 a 299)
//    status -> número do status HTTP (0 = não foi possível falar com o servidor)
//    dados  -> o JSON da resposta (ou null se a resposta não veio em JSON)
// Se o servidor responder 401 numa chamada com token, a sessão é encerrada aqui mesmo.
export const requisicao = async function (caminho, { metodo = 'GET', corpo, autenticado = true } = {}) {
  let cabecalhos = {};

  // "!== undefined" porque o corpo pode existir mesmo sendo um objeto vazio
  if (corpo !== undefined) {
    cabecalhos['Content-Type'] = 'application/json';
  }

  if (autenticado) {
    cabecalhos.Authorization = `Bearer ${pegarToken()}`;
  }

  // try/catch: se a internet cair ou a API estiver fora, o catch trata o erro
  try {
    let response = await fetch(`${rotaBase}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined
    });

    // 401 = token inválido ou vencido: apaga o token e volta para o login
    if (autenticado && response.status === 401) {
      sairDoSistema();
    }

    // .catch(() => null): se a resposta não for JSON, devolve null em vez de quebrar
    let dados = await response.json().catch(() => null);

    return { ok: response.ok, status: response.status, dados };
  } catch (erro) {
    console.error(erro);
    return { ok: false, status: 0, dados: null };
  }
};

// Escolhe a mensagem de erro certa para mostrar ao usuário, a partir do resultado de requisicao().
// "padrao" é o texto usado quando não há nada mais específico para dizer.
export const mensagemDeErro = function (resultado, padrao) {
  if (resultado.status === 0) {
    return 'Não foi possível conectar ao servidor.';
  }

  if (resultado.status === 401) {
    return 'Sua sessão expirou. Faça login novamente.';
  }

  // A API costuma explicar o erro no campo "message"
  return resultado.dados?.message || padrao;
};