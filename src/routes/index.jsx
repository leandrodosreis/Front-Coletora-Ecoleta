import { Routes, Route, Outlet } from 'react-router-dom';
import { Header } from '../components/header/Header';
import { Cadastro } from '../features/cadastro/Cadastro';
import { Home } from '../features/home/Home';
import { Coletas } from '../features/coletas/Coletas';


// tela provisória: troque pelas telas de verdade quando criá-las
function EmBreve({ titulo }) {
  return <h1 style={{ padding: 24 }}>{titulo}</h1>;
}

// as telas dentro deste layout ganham o Header
function LayoutComHeader() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export function Rotas() {
  return (
    <Routes>
      {/* sem header */}
      <Route path="/" element={<Cadastro />} />

      {/* com header */}
      <Route element={<LayoutComHeader />}>
        <Route path="/home" element={<Home />} />
        <Route path="/residuos" element={<EmBreve titulo="Resíduos" />} />
        <Route path="/coletas" element={<Coletas />} />
        <Route path="/historico" element={<EmBreve titulo="Histórico" />} />
        <Route path="/perfil" element={<EmBreve titulo="Perfil" />} />
      </Route>
    </Routes>
  );
}
