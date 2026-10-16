import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Header.css';

const itens = [
  { nome: 'Início', rota: '/home', icone: '🍃' },
  { nome: 'Resíduos', rota: '/residuos', icone: '📦' },
  { nome: 'Coletas', rota: '/coletas', icone: '🚚' },
  { nome: 'Histórico', rota: '/historico', icone: '📅' },
  { nome: 'Perfil', rota: '/perfil', icone: '👤' }
];

export function Header() {
  const [aberto, setAberto] = useState(false);
  const navigate = useNavigate();

  function sair() {
    setAberto(false);
    navigate('/');
  }

  return (
    <header className="header">
      <Link to="/home" className="header_logo">
        <span>♻</span> Ecoleta
      </Link>

      <button className="header_hamburguer" onClick={() => setAberto(!aberto)}>
        ☰
      </button>

      {aberto && (
        <>
          {/* área transparente: clicar fora do menu fecha ele */}
          <div className="header_fundo" onClick={() => setAberto(false)}></div>

          <nav className="menu">
            <h2>Navegação</h2>

            {itens.map((item) => (
              <NavLink
                key={item.rota}
                to={item.rota}
                className="menu_item"
                onClick={() => setAberto(false)}
              >
                <span>{item.icone}</span> {item.nome}
              </NavLink>
            ))}

            <hr className="menu_linha" />

            <button className="menu_item menu_sair" onClick={sair}>
              <span>➜</span> Sair
            </button>
          </nav>
        </>
      )}
    </header>
  );
}
