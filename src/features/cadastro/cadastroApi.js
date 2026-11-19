// Funções que conversam com as APIs na tela de Cadastro.
// Cada função é "async": ela espera a resposta antes de continuar (await).
import { requisicao } from '../../services/API';

// BUSCA O ENDEREÇO PELO CEP -> ViaCEP (serviço gratuito e público, não precisa de token)
// Recebe o CEP só com números (8 dígitos).
// Devolve { logradouro, bairro, localidade (cidade), uf (sigla do estado) ... } ou false.
export const getCep = async function (cep) {
  let url = `https://viacep.com.br/ws/${cep}/json/`;

  // try/catch: se a internet cair ou o serviço estiver fora, o catch trata o erro
  try {
    let response = await fetch(url);

    // response.ok é true quando o serviço respondeu com sucesso (status 200 a 299)
    if (response.ok) {
      let respostaAPI = await response.json(); // converte a resposta para objeto

      // Para um CEP que não existe, o ViaCEP responde com { erro: true }
      if (respostaAPI.erro) {
        return false;
      }
      return respostaAPI;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// CADASTRA A EMPRESA -> POST /v1/ecoleta/cadastro/empresa-coletora
// Devolve { ok: true } se deu certo, ou { ok: false, mensagem: '...' } se deu erro.
export const cadastrarEmpresa = async function (dados) {
  // autenticado: false porque quem está se cadastrando ainda não tem token
  let resultado = await requisicao('/v1/ecoleta/cadastro/empresa-coletora', {
    metodo: 'POST',
    corpo: dados,
    autenticado: false
  });

  // 201 = cadastrado. Os outros casos a gente identifica pelo status.
  if (resultado.ok) {
    return { ok: true };
  }

  if (resultado.status === 0) {
    return { ok: false, mensagem: 'Não foi possível conectar ao servidor.' };
  }

  if (resultado.status === 409) {
    return { ok: false, mensagem: 'Dados já cadastrados (CNPJ ou email).' };
  }

  if (resultado.status === 400) {
    return { ok: false, mensagem: 'Dados inválidos. Confira os campos.' };
  }

  return { ok: false, mensagem: 'Não foi possível concluir o cadastro.' };
};