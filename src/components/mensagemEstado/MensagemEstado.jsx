import './MensagemEstado.css';

// Mensagem padronizada para carregamento, erro ou ausência de registros.
export function MensagemEstado({ tipo = 'info', children }) {
  return (
    <p className={`mensagem_estado mensagem_${tipo}`} role={tipo === 'erro' ? 'alert' : 'status'}>
      {children}
    </p>
  );
}
