
import { rotaBase, pegarToken, sairDoSistema } from '../../services/API';

// Converte o material para uma categoria utilizada nos filtros.
function identificarTipoMaterial(material) {
  let materialMinusculo = material.toLowerCase();

  if (materialMinusculo.includes('vidro')) {
    return 'vidro';
  }

  if (
    materialMinusculo.includes('papel') ||
    materialMinusculo.includes('papelao')
  ) {
    return 'papel';
  }

  if (materialMinusculo.includes('plast')) {
    return 'plastico';
  }

  return 'outros';
}

// Converte o status recebido pela API para o formato utilizado na tela.
function identificarStatusResiduo(status) {
  let statusMinusculo = status
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (statusMinusculo.includes('agendado')) {
    return 'agendado';
  }

  if (statusMinusculo.includes('disponivel')) {
    return 'disponivel';
  }

  return statusMinusculo;
}

// Organiza os dados da API para facilitar sua utilização no JSX.
function formatarResiduo(residuo) {
  let material = String(residuo.material || '');

  return {
    id: residuo.id_residuo,
    material: material,
    estabelecimento: residuo.nome_estabelecimento || '',
    distancia: residuo.distancia ?? null,
    tipo: identificarTipoMaterial(material),
    status: identificarStatusResiduo(residuo.status_residuo || ''),
    quantidade: `${residuo.quantidade} kg`,
    data: residuo.data_disponivel || '',
    horario: `${residuo.horario_inicial || ''} às ${residuo.horario_final || ''}`,
    observacao: residuo.observacao || ''
  };
}

// Busca os resíduos disponíveis para a empresa coletora.
export const buscarResiduos = async function () {
  let url = `${rotaBase}/v1/ecoleta/empresa-coletora/residuos-disponiveis`;

  try {
    let resposta = await fetch(url, {
      headers: {
        Authorization: `Bearer ${pegarToken()}`
      }
    });

    // Encerra a sessão caso o token esteja inválido ou vencido.
    if (resposta.status === 401) {
      sairDoSistema();
      return false;
    }

    if (!resposta.ok) {
      return false;
    }

    let dadosResposta = await resposta.json();

    // A API retorna os resíduos dentro da propriedade response.
    let residuos = dadosResposta.response || [];

    if (!Array.isArray(residuos)) {
      return false;
    }

    return residuos.map(formatarResiduo);

  } catch (erro) {
    console.error('Erro ao buscar resíduos:', erro);
    return false;
  }
};

// Envia a oferta inicial para um resíduo específico.
export const enviarOfertaInicial = async function (idResiduo, dadosOferta) {
  if (!idResiduo) {
    throw new Error('Não foi possível identificar o resíduo selecionado.');
  }

  let url = `${rotaBase}/v1/ecoleta/empresa-coletora/residuos-disponiveis/oferta/${idResiduo}`;

  let resposta = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${pegarToken()}`
    },
    body: JSON.stringify({
      nome_ofertante: dadosOferta.nome_ofertante,
      valor_ofertado: Number(dadosOferta.valor_ofertado)
    })
  });

  // Trata o retorno da API, inclusive quando não houver JSON na resposta.
  let dadosResposta = await resposta.json().catch(() => ({}));

  // Encerra a sessão caso o token esteja inválido ou vencido.
  if (resposta.status === 401) {
    sairDoSistema();
    throw new Error('Sua sessão expirou. Faça login novamente.');
  }

  if (!resposta.ok) {
    throw new Error(dadosResposta.message || 'Erro ao enviar oferta.');
  }

  return dadosResposta;
};

// Busca os detalhes de uma coleta agendada pelo ID do resíduo.
export async function buscarDetalhesColeta(idResiduo) {
  if (!idResiduo) {
    throw new Error('Não foi possível identificar o resíduo.');
  }

  let url = `${rotaBase}/v1/ecoleta/empresa-coletora/residuos-disponiveis/coleta/${idResiduo}`;

  try {
    let resposta = await fetch(url, {
      headers: {
        Authorization: `Bearer ${pegarToken()}`
      }
    });

    if (resposta.status === 401) {
      sairDoSistema();
      throw new Error('Sua sessão expirou. Faça login novamente.');
    }

    let dadosResposta = await resposta.json();

    if (!resposta.ok) {
      throw new Error(
        dadosResposta.message || 'Não foi possível buscar os detalhes da coleta.'
      );
    }

    return dadosResposta.response;

  } catch (erro) {
    console.error('Erro ao buscar detalhes da coleta:', erro);
    throw erro;
  }
}