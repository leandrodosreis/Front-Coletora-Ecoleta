// Função que conversa com a API na tela de Perfil.
import { rotaBase, pegarToken } from '../../services/api';
 
// A API devolve o endereço dentro de um objeto "endereco".
// Esta função deixa tudo "plano" (um objeto só), mais fácil de usar na tela.
// Se a API mudar o formato, só precisamos ajustar esta função.
function converterPerfil(perfil) {
  return {
    nome: perfil.nome,
    cnpj: perfil.cnpj,
    telefone: perfil.telefone || '',
    email: perfil.email,
    cep: perfil.endereco.cep,
    logradouro: perfil.endereco.logradouro,
    numero: String(perfil.endereco.numero), // o número vem como inteiro, o input usa texto
    bairro: perfil.endereco.bairro,
    // O "|| ''" evita erro se a API ainda não enviar esses dois campos
    cidade: perfil.endereco.nome_cidade || '',
    estado: perfil.endereco.sigla_estado || ''
  };
}
 
// BUSCA O PERFIL DA EMPRESA -> GET /empresas-coletoras/perfil
// O id da empresa não vai na URL: a API descobre pelo token do login.
// Devolve o perfil, ou false se der erro.
export const getPerfil = async function () {
  let url = `${rotaBase}/empresas-coletoras/perfil`;
 
  try {
    let response = await fetch(url, {
      // Authorization envia o token para a API saber quem está pedindo
      headers: { Authorization: `Bearer ${pegarToken()}` }
    });
 
    if (response.ok) {
      let respostaAPI = await response.json();
      return converterPerfil(respostaAPI);
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};