import { rotaBase, pegarToken } from '../../services/API';
 
function converterPerfil(perfil) {
  return {
    nome: perfil.response.perfil.nome_empresa,
    cnpj: perfil.response.cnpj,
    telefone: perfil.response.telefone || '',
    email: perfil.response.email,
    cep: perfil.response.cep,
    logradouro: perfil.response.logradouro,
    numero: String(perfil.response.numero), // o número vem como inteiro, o input usa texto
    bairro: perfil.response.bairro,
    // O "|| ''" evita erro se a API ainda não enviar esses dois campos
    cidade: perfil.response.nome_cidade || '',
    estado: perfil.response.sigla_estado || ''
  };
}
 
export const getPerfil = async function () {
  let url = `${rotaBase}/v1/ecoleta/empresa-coletora/perfil`;
 
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