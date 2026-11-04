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
  window.location.href = '/login';
};