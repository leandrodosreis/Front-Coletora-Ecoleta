import './Botao.css';

// Botão reutilizável para manter o mesmo padrão visual nas telas.
export function Botao({ children, tipo = 'button', variante = 'primario', className = '', ...props }) {
  return (
    <button type={tipo} className={`botao_padrao botao_${variante} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
