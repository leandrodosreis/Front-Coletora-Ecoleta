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
      <div className="conteudo_coletas">
        <p className="etiqueta">PAINEL DA EMPRESA COLETORA</p>
        <h1 className="titulo_coletas">Coletas</h1>
        <p className="subtitulo">Gerencie e acompanhe suas operações na Ecoleta.</p>
 
        <div className="abas">
          {abas.map((aba) => (
            <button
              key={aba.valor}
              className={filtro === aba.valor ? 'aba aba_ativa' : 'aba'}
              onClick={() => setFiltro(aba.valor)}
            >
              {aba.nome}
            </button>
          ))}
        </div>
 
        {(filtro === 'todas' || filtro === 'aguardando') && (
          <section className="secao">
            <p className="etiqueta">Atenção necessária</p>
            <h2>Coletas aguardando finalização</h2>
            {aguardando.map((coleta) => (
              <CardColeta key={coleta.id} coleta={coleta} />
            ))}
          </section>
        )}
 
        {(filtro === 'todas' || filtro === 'agendado') && (
          <section className="secao">
            <p className="etiqueta">Agendadas</p>
            <h2>Coletas agendadas</h2>
            {agendadas.map((coleta) => (
              <CardColeta key={coleta.id} coleta={coleta} />
            ))}
          </section>
        )}
 
      </div>
    </main>

  );
}
