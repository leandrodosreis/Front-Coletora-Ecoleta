import { rotaBase, pegarToken } from '../../services/API';
 

function converterPerfil(perfil) {
  let dados = perfil.response.perfil[0];

  return {
    nome: dados.nome_empresa || '',
    cnpj: dados.cnpj || '',
    telefone: dados.telefone || '',
    email: dados.email || '',
    cep: dados.cep || '',
    logradouro: dados.logradouro || '',
    numero: String(dados.numero ?? ''),
    bairro: dados.bairro || '',
    cidade: dados.nome_cidade || '',
    estado: dados.sigla || ''
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