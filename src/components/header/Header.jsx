// COMPONENTE GLOBAL: o cabeçalho com o menu hambúrguer.
// Ele aparece em todas as telas que estão dentro do Layout (veja routes/index.jsx).
import { useState } from 'react';
// Link e NavLink trocam de tela sem recarregar a página.
// useNavigate permite trocar de tela pelo código (usado no botão Sair).
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Header.css';

// Lista dos itens do menu. Para adicionar uma tela nova ao menu,
// basta incluir mais uma linha aqui (e a rota em routes/index.jsx).
const itens = [
  { nome: 'home', rota: '/home', icone: '🍃' },
  { nome: 'Resíduos', rota: '/residuos', icone: '📦' },
  { nome: 'Coletas', rota: '/coletas', icone: '🚚' },
  { nome: 'Histórico', rota: '/historico', icone: '📅' },
  { nome: 'Perfil', rota: '/perfil', icone: '👤' }
];

export function Header() {
  // 'aberto' diz se o menu está aberto (true) ou fechado (false)
  const [aberto, setAberto] = useState(false);
  const navigate = useNavigate();

  // Fecha o menu e volta para a tela inicial do site
  function sair() {
    setAberto(false);
    navigate('/');
  }

  return (
    <header className="header">
      {/* Logo: ao clicar, vai para a tela de home */}
      <Link to="/home" className="header_logo">
        <span>♻</span> Ecoleta
      </Link>

      {/* Botão hambúrguer: abre e fecha o menu (inverte o valor de "aberto") */}
      <button className="header_hamburguer" onClick={() => setAberto(!aberto)}>
        ☰
      </button>

      {/* O menu só é desenhado quando "aberto" é true */}
      {aberto && (
        <>
          {/* Área transparente que cobre a tela: clicar fora do menu fecha ele */}
          <div className="header_fundo" onClick={() => setAberto(false)}></div>

          <nav className="menu">
            <h2>Navegação</h2>

            {/* map percorre a lista "itens" e cria um link para cada item.
                O "key" ajuda o React a identificar cada item da lista. */}
            {itens.map((item) => (
              // O NavLink coloca sozinho a classe "active" no link da tela atual
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
