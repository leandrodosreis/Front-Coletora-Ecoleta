import { useState } from 'react';
import { CardColeta } from '../../components/cardColeta/CardColeta';
import './Coletas.css';

// dados de exemplo (depois virão da API)
const coletas = [
  { id: 1, empresa: 'Restaurante X', residuo: 'Vidro', peso: 15, distancia: '2,4', status: 'aguardando' },
  { id: 2, empresa: 'Padaria do zé', residuo: 'Papelão', peso: 10, distancia: '12,5', status: 'aguardando' },
  { id: 3, empresa: 'Restaurante X', residuo: 'Plástico', peso: 5, distancia: '2,4', status: 'agendado', valor: '20,00' },
  { id: 4, empresa: 'Padaria do zé', residuo: 'Plástico', peso: 5, distancia: '2,4', status: 'agendado', valor: '20,00' },
  { id: 5, empresa: 'Restaurante X', residuo: 'Plástico', peso: 5, distancia: '2,4', status: 'agendado', valor: '20,00' }
];

const abas = [
  { valor: 'todas', nome: 'Todas' },
  { valor: 'aguardando', nome: 'Aguardando finalização' },
  { valor: 'agendado', nome: 'Agendado' }
];

export function Coletas() {
  const [filtro, setFiltro] = useState('todas');

  const aguardando = coletas.filter((coleta) => coleta.status === 'aguardando');
  const agendadas = coletas.filter((coleta) => coleta.status === 'agendado');

  return (
    <main className="tela_coletas">
    </main>
  );
}
