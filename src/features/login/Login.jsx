// TELA DE LOGIN da empresa coletora (entra com CNPJ e senha).
// Como funciona, resumindo:
//  1. O usuário digita o CNPJ e a senha (cada letra fica guardada nos estados).
//  2. Ao clicar em Entrar, conferimos se os campos estão preenchidos corretamente.
//  3. Se estiver tudo certo, enviamos para a API (loginApi.js).
//  4. Se a API aceitar, guardamos o token no navegador e vamos para a tela de Início.
import { useState } from 'react';
// Link troca de tela sem recarregar a página. useNavigate troca de tela pelo código.
import { Link, useNavigate } from 'react-router-dom';
import "./Login.css";

import { loginEmpresa } from './loginApi';
import { salvarToken } from '../../services/API';
import { numeros, formatarCnpj } from '../../utils/formatadores';


export function Login() {
    // useNavigate dá uma função para trocar de tela pelo código
    const navigate = useNavigate();

    // ESTADOS: informações que, ao mudar, atualizam a tela
    const [cnpj, setCnpj] = useState(''); // o que o usuário digitou no CNPJ
    const [senha, setSenha] = useState(''); // o que o usuário digitou na senha
    const [mensagem, setMensagem] = useState(''); // mensagem de erro (vazia = não aparece)
    const [enviando, setEnviando] = useState(false); // true = esperando a resposta da API

    // Roda a cada letra digitada no CNPJ
    const handleInputChange = (event) => {
        setCnpj(event.target.value);
    };

    // Roda quando o usuário clica em Entrar
    async function entrar() {
        // 1. Confere os campos. "return" para a função aqui se tiver erro.
        // (numeros() tira os pontos e traços, para contar só os dígitos do CNPJ)
        if (numeros(cnpj).length !== 14) {
            setMensagem('CNPJ inválido.');
            return;
        }
        if (senha.trim() === '') {
            setMensagem('Informe a senha.');
            return;
        }

        // 2. Limpa a mensagem anterior e envia para a API
        setMensagem('');
        setEnviando(true); // desabilita o botão enquanto espera
        // O banco guarda o CNPJ formatado, então formatamos antes de enviar
        let resultado = await loginEmpresa(formatarCnpj(numeros(cnpj)), senha);
        setEnviando(false);

        // 3. Mostra o resultado
        if (resultado.ok) {
            // Guarda os tokens no navegador e vai para a tela de Início
            salvarToken(resultado.accessToken, resultado.refreshToken);
            navigate('/home');
        } else {
            setMensagem(resultado.mensagem);
        }
    }

    return (
        <>

            <main className="main-login">   

                <div className="card">


                    <div className="login-container">
                        <h1 className='entrar'>Entrar</h1>
                        
                        <div className="card-login">
                            <h1 className="cnpj">CNPJ</h1>
                            {/* value + onChange ligam o campo ao estado "cnpj" */}
                            <input className="campo-login" type="text" value={cnpj} onChange={handleInputChange} />
                        </div>


                        <div className="senha">
                            <h1 className="sua-senha">Senha</h1>
                            <input
                                className="campo-senha"
                                type="password"
                                value={senha}
                                onChange={(event) => setSenha(event.target.value)}
                            />
                            <h2 className='esqueceu-senha'><a href="http://">Esqueceu a senha?</a></h2>


                            {/* Link leva para o Cadastro (rota "/") sem recarregar a página */}
                            <h2 className="cadastro ">Não possui conta? <Link to="/">Cadastre-se</Link></h2>

                            <div className="botao">
                                {/* onClick: roda a função "entrar". disabled: desliga o botão enquanto envia */}
                                <button className="botao-entrar" type="button" onClick={entrar} disabled={enviando}>
                                    <h2 className="login-entrar">{enviando ? 'Entrando...' : 'Entrar'}</h2>
                                </button>
                            </div>

                            {/* A mensagem de erro só aparece quando existe texto nela */}
                            {mensagem && <p className="login-erro">{mensagem}</p>}

                        </div>
                    </div>

                </div>

            </main>



        </>



    );
}