import { useState } from 'react';
import './Campo.css';

// Os valores entre { } são as PROPS: informações que a tela passa para o componente.
//  label          -> texto acima do campo
//  nome           -> nome do campo (também usado como id)
//  tipo           -> tipo do input (text, email, tel, password...)
//  grande         -> true = o campo ocupa a linha inteira
//  somenteLeitura -> true = o usuário não consegue digitar (campo preenchido sozinho)
//  valores        -> objeto com o valor de todos os campos
//  erros          -> objeto com a mensagem de erro de cada campo
//  aoMudar        -> função chamada a cada letra digitada
//  aoPerderFoco   -> função chamada quando o usuário sai do campo
export function Campo({ label, nome, tipo = 'text', grande, somenteLeitura, valores, erros, aoMudar, aoPerderFoco }) {
  // useState guarda uma informação que, ao mudar, atualiza a tela.
  // 'mostrar' diz se a senha está visível (true) ou escondida (false).
  const [mostrar, setMostrar] = useState(false);

  return (
    // Se for "grande", ganha a classe extra que ocupa a linha toda
    <div className={grande ? 'campo campo_grande' : 'campo'}>
      <label htmlFor={nome}>{label}</label>

      <div className="entrada">
        <input
          id={nome}
          name={nome}
          // Se for campo de senha e "mostrar" for true, vira texto comum para a senha aparecer
          type={tipo === 'password' && mostrar ? 'text' : tipo}
          // valores[nome] pega o valor deste campo dentro do objeto "valores"
          value={valores[nome]}
          onChange={aoMudar}
          onBlur={aoPerderFoco}
          readOnly={somenteLeitura}
        />

        {/* Só os campos de senha ganham o botão do olho */}
        {tipo === 'password' && (
          // Ao clicar, inverte o valor de "mostrar" (true vira false e vice-versa)
          <button type="button" className="botao_olho" onClick={() => setMostrar(!mostrar)}>
          </button>
        )}
      </div>

      <span className="campo_erro">{erros[nome]}</span>
    </div>
  );
}
