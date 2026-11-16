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
    estado: dados.sigla || '',
    nomeEstado: dados.nome_estado || ''
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

// ATUALIZA O PERFIL DA EMPRESA -> PUT /v1/ecoleta/empresa-coletora/perfil
export const atualizarPerfil = async function (perfil) {
  let url = `${rotaBase}/v1/ecoleta/empresa-coletora/perfil`;

  // Organiza os dados conforme os nomes exigidos pela API
  let dados = {
    nome_empresa: perfil.nome,
    telefone: perfil.telefone,
    email: perfil.email,
    cep: perfil.cep,
    logradouro: perfil.logradouro,
    numero_local: Number(perfil.numero),
    bairro: perfil.bairro,
    cidade: perfil.cidade,
    nome_estado: perfil.nomeEstado,
    sigla_estado: perfil.estado
  };

  try {
    let response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pegarToken()}`
      },
      body: JSON.stringify(dados)
    });

if (response.ok) {
  return { ok: true };
}

let respostaAPI = await response.json();

console.log('Status:', response.status);
console.log('JSON enviado:', dados);
console.log('Erro retornado pelo backend:', respostaAPI);

return {
  ok: false,
  mensagem: respostaAPI.message || 'Não foi possível atualizar o perfil.'
};

  } catch (error) {
    console.error(error);

    return {
      ok: false,
      mensagem: 'Não foi possível conectar ao servidor.'
    };
  }
};