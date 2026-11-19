import { CardColeta } from '../cardColeta/CardColeta';
import './SecaoColetas.css';

// Um bloco da tela de Coletas: etiqueta + título + a lista de cards.
//  etiqueta    -> texto pequeno acima do título
//  titulo      -> título da seção
//  coletas     -> lista de coletas (cada uma vira um card)
//  onFinalizar -> função do botão "Finalizar coleta" dos cards (opcional)
export function SecaoColetas({ etiqueta, titulo, coletas, onFinalizar }) {
  return (
    <section className="secao">
      <p className="secao_etiqueta">{etiqueta}</p>

      <h2>{titulo}</h2>

      {coletas.map((coleta) => (
        <CardColeta
          key={coleta.id_coleta}
          coleta={coleta}
          onFinalizar={onFinalizar}
        />
      ))}
    </section>
  );
}