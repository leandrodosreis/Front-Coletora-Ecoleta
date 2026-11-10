import { rotaBase, pegarToken, sairDoSistema } from '../../services/API';

// Converte os dados da API para o formato utilizado pelo JSX
function converterResiduo(residuo) {
  let material = residuo.material || '';

  // Identifica a categoria para os filtros da tela
  let materialNormalizado = material.toLowerCase();

  let tipo = 'outros';

  if (materialNormalizado.includes('vidro')) {
    tipo = 'vidro';
  } else if (
    materialNormalizado.includes('papel') ||
    materialNormalizado.includes('papelão')
  ) {
    tipo = 'papel';
  } else if (materialNormalizado.includes('plástico') ||
             materialNormalizado.includes('plastico')) {
    tipo = 'plastico';
  }

  // Converte o status retornado pela API
  let statusNormalizado = (residuo.status_residuo || '').toLowerCase();

  let status = statusNormalizado.includes('agendado')
    ? 'agendado'
    : statusNormalizado.includes('disponível') ||
      statusNormalizado.includes('disponivel')
      ? 'disponivel'
      : statusNormalizado;

  // Monta o horário de disponibilidade
  let horario = `${residuo.horario_inicial || ''} às ${residuo.horario_final || ''}`;

  // Monta o nome do estabelecimento e a distância
  let estabelecimento = residuo.nome_estabelecimento || '';

  if (residuo.distancia !== null && residuo.distancia !== undefined) {
    estabelecimento += ` - ${residuo.distancia} km`;
  }

  return {
    id: residuo.id_residuo,
    material: material,
    estabelecimento: estabelecimento,
    tipo: tipo,
    status: status,
    quantidade: `${residuo.quantidade} kg`,
    data: residuo.data_disponivel,
    horario: horario,
    observacao: residuo.observacao || ''
  };
}

export const getResiduos = async function () {
  let url = `${rotaBase}/v1/ecoleta/empresa-coletora/residuos-disponiveis`;

  try {
    let response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${pegarToken()}`
      }
    });

    // 401 = token inválido ou vencido
    if (response.status === 401) {
      sairDoSistema();
      return false;
    }

    if (response.ok) {
      let respostaAPI = await response.json();

      console.log('RESÍDUOS COMPLETOS:', respostaAPI);

      // A API retorna o array diretamente dentro de response
      let residuos = respostaAPI.response || [];

      return residuos.map(converterResiduo);
    }

    return false;

  } catch (error) {
    console.error(error);
    return false;
  }
};
