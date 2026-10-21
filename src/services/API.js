// Endereço base da API. Todas as chamadas começam por ele.
// Troque pelo endereço real quando a API estiver pronta.
export const rotaBase = 'http://localhost:3000';

// O token é a "chave" que a API devolve no login.
// Ele fica guardado no navegador (localStorage) e é enviado nas chamadas
// que exigem login, para a API saber quem é a empresa.
export const pegarToken = function () {
  return localStorage.getItem('accessToken');
};
