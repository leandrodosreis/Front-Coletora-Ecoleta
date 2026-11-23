import './EtiquetaStatus.css';

// Define a aparência da etiqueta de acordo com o estado recebido.
export function EtiquetaStatus({ status, children, variante }) {
  let texto = String(status || children || '').trim();
  let normalizado = texto.toLowerCase();
  let tipo = variante;

  if (!tipo) {
    if (['concluída', 'concluido', 'aceita', 'disponível', 'disponivel'].includes(normalizado)) tipo = 'sucesso';
    else if (['pendente', 'aguardando finalização', 'aguardando', 'em análise'].includes(normalizado)) tipo = 'alerta';
    else if (['recusada', 'cancelado', 'cancelada', 'erro'].includes(normalizado)) tipo = 'erro';
    else tipo = 'neutro';
  }

  return <span className={`etiqueta_status etiqueta_${tipo}`}>{children || texto}</span>;
}
