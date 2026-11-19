// Função que conversa com a API na tela de Estabelecimentos próximos.
import { rotaBase, pegarToken } from '../../services/API';

// A API manda UM item por resíduo (dois resíduos de vidro = dois itens).
// O design mostra os resíduos somados por material: "Vidro - 35 kg".
// Esta função faz essa soma e guarda também o id do material (usado no filtro).
function somarPorMaterial(residuos) {
  let lista = [];

  for (let residuo of residuos) {
    // find procura na lista um item com o mesmo material (devolve vazio se não achar)
    let existente = lista.find((item) => item.material === residuo.material);

    if (existente) {
      // Já tem esse material: soma a quantidade
      existente.quantidade += Number(residuo.quantidade);
    } else {
      // Material novo: adiciona na lista
      lista.push({
        id: residuo.id_tipo_material,
        material: residuo.material,
        quantidade: Number(residuo.quantidade)
      });
    }
  }

  return lista;
}

// Converte UM estabelecimento da API para o formato que a tela usa.
// Se a API mudar o nome de algum campo, é SÓ AQUI que precisamos ajustar.
function converterEstabelecimento(estabelecimento) {
  return {
    id: estabelecimento.id_estabelecimento,
    nome: estabelecimento.nome_estabelecimento,
    distancia: estabelecimento.distancia, // pode vir vazia (null) se ainda não foi calculada
    // Junta logradouro e número num texto só: "Av. Dos Bandeirantes, 250"
    endereco: `${estabelecimento.logradouro}, ${estabelecimento.numero}`,
    residuos: somarPorMaterial(estabelecimento.residuos || [])
  };
}

// BUSCA OS ESTABELECIMENTOS:
//  - sem filtro:  GET /v1/ecoleta/empresa-coletora/estabelecimentos
//  - com filtro:  GET /v1/ecoleta/empresa-coletora/estabelecimentos/{id_tipo_material}
// O id da empresa não vai na URL: a API descobre pelo token do login.
// Devolve uma lista de estabelecimentos, ou false se der erro ou vier vazia.
export const getEstabelecimentosProximos = async function (idTipoMaterial) {
  let url = `${rotaBase}/v1/ecoleta/empresa-coletora/estabelecimentos`;

  // Se foi escolhido um tipo de material, acrescenta o id dele no final do endereço
  if (idTipoMaterial) {
    url = `${url}/${idTipoMaterial}`;
  }

  try {
    let response = await fetch(url, {
      // Authorization envia o token para a API saber quem está pedindo
      headers: { Authorization: `Bearer ${pegarToken()}` }
    });

    // 401 = token inválido ou vencido: apaga o token e volta para o login
    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      return false;
    }

    if (response.ok) {
      let respostaAPI = await response.json();
      // A lista fica em response.estabelecimentos
      let lista = respostaAPI.response.estabelecimentos;

      if (lista.length > 0) {
        // map aplica "converterEstabelecimento" em cada item da lista
        return lista.map(converterEstabelecimento);
      } else {
        console.warn('A API não retornou nada');
        return false;
      }
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};