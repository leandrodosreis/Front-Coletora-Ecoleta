import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { removerToken } from '../../services/API';

// Ícones em SVG para manter o mesmo estilo visual em toda a navegação.
function Icone({ tipo }) {
  const propriedades = {
    width: 23,
    height: 23,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true
  };

  const desenhos = {
    folha: <><path d="M20 4C11 4 5 7 4 14c-.5 3.5 2 6 5.5 5.5C16.5 18.5 20 12 20 4Z" /><path d="M3 21c3-6 7-9 13-12" /></>,
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    perfil: <><circle cx="12" cy="8" r="4" /><path d="M4 21c.5-4.2 3.5-6.5 8-6.5s7.5 2.3 8 6.5" /></>,
    residuos: <><path d="m12 2 9 5v10l-9 5-9-5V7l9-5Z" /><path d="m3.5 7.3 8.5 5 8.5-5M12 22V12.3M7.5 4.5l9 5" /></>,
    coletas: <><path d="M3 6h11v12H3z" /><path d="M14 10h4l3 4v4h-7z" /><circle cx="7" cy="19" r="2" /><circle cx="17" cy="19" r="2" /></>,
    empresas: <><path d="M12 21s7-7.1 7-12a7 7 0 1 0-14 0c0 4.9 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></>,
    historico: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" /></>,
    sair: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></>
  };

  return <svg {...propriedades}>{desenhos[tipo]}</svg>;
}

const itens = [
  { nome: 'Dashboard', rota: '/home', icone: 'dashboard' },
  { nome: 'Meu perfil', rota: '/perfil', icone: 'perfil' },
  { nome: 'Resíduos', rota: '/residuos', icone: 'residuos' },
  { nome: 'Coletas', rota: '/coletas', icone: 'coletas' },
  { nome: 'Empresas', rota: '/estabelecimento', icone: 'empresas' },
  { nome: 'Histórico', rota: '/historico', icone: 'historico' }
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
          <span className="sidebar_logo_icone"><Icone tipo="folha" /></span>
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
          <span className="sidebar_logo_icone"><Icone tipo="folha" /></span>
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
                <Icone tipo={item.icone} />
              </span>
              <span>{item.nome}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar_sair_area">
          <button className="sidebar_link sidebar_botao_sair" type="button" onClick={sair}>
            <span className="sidebar_link_icone" aria-hidden="true"><Icone tipo="sair" /></span>
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
