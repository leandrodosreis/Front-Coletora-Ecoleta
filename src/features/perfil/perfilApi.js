import { rotaBase, pegarToken } from '../../services/API';
 
function converterPerfil(perfil) {
  return {
    nome: perfil.nome,
    cnpj: perfil.cnpj,
    telefone: perfil.telefone || '',
    email: perfil.email,
    cep: perfil.cep,
    logradouro: perfil.logradouro,
    numero: String(perfil.numero), // o número vem como inteiro, o input usa texto
    bairro: perfil.bairro,
    // O "|| ''" evita erro se a API ainda não enviar esses dois campos
    cidade: perfil.nome_cidade || '',
    estado: perfil.sigla_estado || ''
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