// COMPONENTE GLOBAL: o rodapé, igual em todas as telas do Layout.
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      {/* Esta div limita a largura, para alinhar com o conteúdo das telas */}
      <div className="footer_conteudo">
        <span>Conectando materiais a novos destinos.</span>
        <span>© 2026 Ecoleta</span>
      </div>
    </footer>
  );
}
