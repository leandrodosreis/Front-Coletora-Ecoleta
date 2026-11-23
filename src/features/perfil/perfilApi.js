import { requisicao, mensagemDeErro } from '../../services/API';
 
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
  let resultado = await requisicao('/v1/ecoleta/empresa-coletora/perfil');

  if (!resultado.ok || !resultado.dados?.response?.perfil?.[0]) {
    return false;
  }

  try {
    return converterPerfil(resultado.dados);
  } catch (erro) {
    console.error(erro);
    return false;
  }
};

// ATUALIZA O PERFIL DA EMPRESA -> PUT /v1/ecoleta/empresa-coletora/perfil
export const atualizarPerfil = async function (perfil) {
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

  let resultado = await requisicao('/v1/ecoleta/empresa-coletora/perfil', {
    metodo: 'PUT',
    corpo: dados
  });

  if (resultado.ok) {
    return { ok: true };
  }

  return {
    ok: false,
    mensagem: mensagemDeErro(resultado, 'Não foi possível atualizar o perfil.')
  };
};

// ALTERA A SENHA DA EMPRESA -> PATCH /empresa-coletora/perfil/senha
export const alterarSenha = async function (dadosSenha) {
  let resultado = await requisicao('/v1/ecoleta/empresa-coletora/perfil/senha', {
    metodo: 'PATCH',
    corpo: dadosSenha
  });

  if (resultado.ok) {
    return { ok: true };
  }

  return {
    ok: false,
    mensagem: mensagemDeErro(resultado, 'Não foi possível alterar a senha.')
  };
};