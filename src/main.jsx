// Este é o PRIMEIRO arquivo que o React executa: ele "liga" o app no index.html.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// BrowserRouter permite usar rotas (trocar de tela pela URL sem recarregar a página)
import { BrowserRouter } from 'react-router-dom';
import { Rotas } from './routes';
import './index.css';

// Procura a <div id="root"> do index.html e desenha o app dentro dela
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Tudo que está dentro do BrowserRouter pode usar rotas */}
    <BrowserRouter>
      <Rotas />
    </BrowserRouter>
  </StrictMode>
);
