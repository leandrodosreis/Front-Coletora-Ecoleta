import { useState } from 'react';
import './Campo.css';

export function Campo({ label, nome, tipo = 'text', opcoes, grande, valores, erros, aoMudar }) {
  const [mostrar, setMostrar] = useState(false);

  return (
    <div className={grande ? 'campo campo_grande' : 'campo'}>
      <label htmlFor={nome}>{label}</label>

      <div className="entrada">
        {opcoes ? (
          <select id={nome} name={nome} value={valores[nome]} onChange={aoMudar}>
            <option value=""></option>
            {opcoes.map((opcao) => (
              <option key={opcao} value={opcao}>{opcao}</option>
            ))}
          </select>
        ) : (
          <input
            id={nome}
            name={nome}
            type={tipo === 'password' && mostrar ? 'text' : tipo}
            value={valores[nome]}
            onChange={aoMudar}
          />
        )}

        {tipo === 'password' && (
          <button type="button" className="botao_olho" onClick={() => setMostrar(!mostrar)}>
            {mostrar ? '🙈' : '👁'}
          </button>
        )}
      </div>

      {/* só tem texto (e aparece) quando existe erro */}
      <span className="campo_erro">{erros[nome]}</span>
    </div>
  );
}
