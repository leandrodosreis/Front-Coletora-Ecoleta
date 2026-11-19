import './CabecalhoPagina.css';

// Mantém a etiqueta, o título e a descrição das páginas no mesmo padrão.
export function CabecalhoPagina({ etiqueta, titulo, descricao }) {
  return (
    <header className="cabecalho_pagina">
      {etiqueta && <p className="cabecalho_pagina_etiqueta">{etiqueta}</p>}
      <h1 className="cabecalho_pagina_titulo">{titulo}</h1>
      {descricao && <p className="cabecalho_pagina_descricao">{descricao}</p>}
    </header>
  );
}
