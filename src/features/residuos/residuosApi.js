import { requisicao, mensagemDeErro } from '../../services/API';

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
  let resultado = await requisicao('/v1/ecoleta/empresa-coletora/residuos-disponiveis');

  if (!resultado.ok || resultado.dados === null) {
    return false;
  }

  // A API retorna os resíduos dentro da propriedade response.
  let residuos = resultado.dados.response || [];

  if (!Array.isArray(residuos)) {
    return false;
  }

  try {
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

  let resultado = await requisicao(`/v1/ecoleta/empresa-coletora/residuos-disponiveis/oferta/${idResiduo}`, {
    metodo: 'POST',
    corpo: {
      nome_ofertante: dadosOferta.nome_ofertante,
      valor_ofertado: Number(dadosOferta.valor_ofertado)
    }
  });

  if (!resultado.ok) {
    throw new Error(mensagemDeErro(resultado, 'Erro ao enviar oferta.'));
  }

  return resultado.dados ?? {};
};

// Busca os detalhes de uma coleta agendada pelo ID do resíduo.
export async function buscarDetalhesColeta(idResiduo) {
  if (!idResiduo) {
    throw new Error('Não foi possível identificar o resíduo.');
  }

  let resultado = await requisicao(`/v1/ecoleta/empresa-coletora/residuos-disponiveis/coleta/${idResiduo}`);

  if (!resultado.ok) {
    throw new Error(mensagemDeErro(resultado, 'Não foi possível buscar os detalhes da coleta.'));
  }

  let detalhes = resultado.dados?.response;

  // Resposta de sucesso, mas sem os detalhes: trata como erro para o modal avisar
  if (!detalhes) {
    throw new Error('Não foi possível buscar os detalhes da coleta.');
  }

  return detalhes;
}