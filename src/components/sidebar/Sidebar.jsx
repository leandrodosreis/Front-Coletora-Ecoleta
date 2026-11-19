import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { removerToken } from '../../services/API';

const itens = [
  { nome: 'Dashboard', rota: '/home', icone: '▦' },
  { nome: 'Meu perfil', rota: '/perfil', icone: '○' },
  { nome: 'Resíduos', rota: '/residuos', icone: '◇' },
  { nome: 'Coletas', rota: '/coletas', icone: '⇄' },
  { nome: 'Empresas', rota: '/estabelecimento', icone: '▤' },
  { nome: 'Histórico', rota: '/historico', icone: '◷' }
];

export function Sidebar() {
  const [aberto, setAberto] = useState(false);
  const navigate = useNavigate();

  function sair() {
    removerToken();
    navigate('/', { replace: true });
  }

  function fecharMenu() {
    setAberto(false);
  }

  return (
    <>
      <header className="sidebar_mobile_topo">
        <button
          className="sidebar_mobile_marca"
          onClick={() => navigate('/home')}
          aria-label="Ir para o dashboard"
        >
          <span className="sidebar_logo_icone">♻</span>
          <span>Ecoleta</span>
        </button>

        <button
          className="sidebar_menu_botao"
          type="button"
          onClick={() => setAberto(!aberto)}
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={aberto}
          aria-controls="navegacao-principal"
        >
          {aberto ? '✕' : '☰'}
        </button>
      </header>

      {aberto && (
        <button
          className="sidebar_fundo_mobile"
          onClick={fecharMenu}
          aria-label="Fechar menu"
        />
      )}

      <aside className={`sidebar ${aberto ? 'sidebar_aberta' : ''}`}>
        <button
          className="sidebar_marca"
          type="button"
          onClick={() => {
            navigate('/home');
            fecharMenu();
          }}
        >
          <span className="sidebar_logo_icone">♻</span>
          <span>Ecoleta</span>
        </button>

        <div className="sidebar_divisor" />
        <p className="sidebar_secao">MENU PRINCIPAL</p>

        <nav className="sidebar_navegacao" id="navegacao-principal" aria-label="Navegação principal">
          {itens.map((item) => (
            <NavLink
              key={item.rota}
              to={item.rota}
              end={item.rota === '/home'}
              className={({ isActive }) =>
                isActive ? 'sidebar_link sidebar_link_ativo' : 'sidebar_link'
              }
              onClick={fecharMenu}
            >
              <span className="sidebar_link_icone" aria-hidden="true">
                {item.icone}
              </span>
              <span>{item.nome}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar_sair_area">
          <button className="sidebar_link sidebar_botao_sair" type="button" onClick={sair}>
            <span className="sidebar_link_icone" aria-hidden="true">⇥</span>
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
