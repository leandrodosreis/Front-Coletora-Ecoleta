import './Abas.css';

// Abas genéricas: este componente não sabe o que está sendo filtrado,
// ele só desenha os botões e avisa qual deles foi clicado.
//  abas     -> lista de { valor, nome } (valor identifica a aba, nome é o texto do botão)
//  ativa    -> valor da aba que está selecionada
//  onChange -> função chamada com o valor da aba clicada
export function Abas({ abas, ativa, onChange }) {
  return (
    <div className="abas">
      {abas.map((aba) => (
        <button
          key={aba.valor}
          className={ativa === aba.valor ? 'aba aba_ativa' : 'aba'}
          onClick={() => onChange(aba.valor)}
        >
          {aba.nome}
        </button>
      ))}
    </div>
  );
}