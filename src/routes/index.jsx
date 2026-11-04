import { Routes, Route, Outlet } from 'react-router-dom';
import { Header } from '../components/header/Header';
import { Footer } from '../components/footer/Footer';
import { Cadastro } from '../features/cadastro/Cadastro';
import { Coletas } from '../features/coletas/Coletas';
import { Perfil } from '../features/perfil/Perfil';
import { Home } from '../features/home/Home';
import { Historico } from '../features/historico/Historico';
import { Residuos } from '../features/residuos/Residuos';
import { Login } from '../features/login/Login';
import { pegarToken } from '../services/API';


function Layout() {
  if (!pegarToken()) {
    return <Navigate to="/" replace />;
  }
 
  return (
    <div className="layout">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export function Rotas() {
  return (
    <Routes>
      {/* Telas SEM Header e Footer */}
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* Telas COM Header e Footer (dentro do Layout) */}
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/residuos" element={<Residuos />} />
        <Route path="/coletas" element={<Coletas />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/perfil" element={<Perfil/>} />
      </Route>
    </Routes>
  );
}
