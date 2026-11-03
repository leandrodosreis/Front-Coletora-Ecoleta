// Endereço base da API. Todas as chamadas começam por ele.
// Troque pelo endereço real quando a API estiver pronta.
export const rotaBase = 'http://localhost:8080';

// O token é a "chave" que a API devolve no login.
// Ele fica guardado no navegador (localStorage) e é enviado nas chamadas
// que exigem login, para a API saber quem é a empresa.
export const pegarToken = function () {
  return localStorage.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9lbXByZXNhX2NvbGV0b3JhIjozLCJpYXQiOjE3OTM3MzU2NjEsImV4cCI6MTc5Mzc2MTIwMH0.HlDra1BSPwb8qB2WqElsx0DmHOGfw13RXTGmQAAtmEQ');
};
