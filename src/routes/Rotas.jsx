import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/sidebar/Sidebar';
import { Cadastro } from '../features/cadastro/Cadastro';
import { Coletas } from '../features/coletas/Coletas';
import { Perfil } from '../features/perfil/Perfil';
import { Home } from '../features/home/Home';
import { Historico } from '../features/historico/Historico';
import { Residuos } from '../features/residuos/Residuos';
import { Login } from '../features/login/Login';
import { pegarToken } from '../services/API';
import { Estabelecimentos } from '../features/estabelecimentos/Estabelecimentos';

function Layout() {
  if (!pegarToken()) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="app_layout">
      <Sidebar />
      <div className="app_area">
        <Outlet />
      </div>
    </div>
  );
}

export function Rotas() {
  return (
    <Routes>
      {/* Telas públicas: não exibem a navegação administrativa. */}
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* Telas autenticadas: compartilham a mesma sidebar. */}
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/residuos" element={<Residuos />} />
        <Route path="/estabelecimento" element={<Estabelecimentos />} />
        <Route path="/coletas" element={<Coletas />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/perfil" element={<Perfil />} />
      </Route>
    </Routes>
  );
}
