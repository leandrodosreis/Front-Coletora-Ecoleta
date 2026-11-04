// Funções para tratar textos, usadas em mais de uma tela.

// Deixa só os números de um texto. Exemplo: '12.345-678' vira '12345678'
// (o \D significa "qualquer coisa que NÃO seja número", e trocamos por vazio)
export function numeros(texto) {
  return texto.replace(/\D/g, '');
}

// O banco guarda o CNPJ formatado: '12345678000190' vira '12.345.678/0001-90'
// slice(inicio, fim) corta um pedaço do texto
export function formatarCnpj(cnpj) {
  return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12)}`;
}