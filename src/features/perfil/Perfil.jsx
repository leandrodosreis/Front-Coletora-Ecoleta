// TELA MEU PERFIL da empresa coletora.
// Como funciona, resumindo:
//  1. Quando a tela abre, buscamos o perfil na API (useEffect).
//  2. Guardamos os dados no estado "perfil".
//  3. Cada card é uma <section> com os dados escritos dentro dos campos.
// Os cards NÃO são componentes: ficam direto aqui, porque só esta tela usa.

import "./Perfil.css"
import { useState, useEffect } from 'react';
import { getPerfil } from './perfilApi';

// Valores iniciais: tudo vazio. Assim os campos já existem antes de a API responder.
const perfilInicial = {
  nome: '', cnpj: '', telefone: '', email: '',
  cep: '', logradouro: '', numero: '', estado: '', cidade: '', bairro: ''
};

export function Perfil(){
  // ESTADOS (informações que, ao mudar, atualizam a tela)
  const [perfil, setPerfil] = useState(perfilInicial); // dados da empresa
  const [carregando, setCarregando] = useState(true); // true = ainda buscando na API
  const [erro, setErro] = useState(false); // true = a API falhou

  // useEffect roda código quando a tela aparece.
  // O [] no final significa: "rode uma vez só, quando a tela abrir".
  useEffect(() => {
    async function carregarDados() {
      let dados = await getPerfil(); // espera a resposta da API

      if (dados) {
        setPerfil(dados);
      } else {
        setErro(true);
      }
      setCarregando(false); // terminou de carregar
    }

    carregarDados();
  }, []);

    return(

    <main className="tela_perfil">
      <div className="conteudo_perfil">
        <p className="etiqueta">PAINEL DA EMPRESA COLETORA</p>
        <h1 className="titulo_perfil">Perfil</h1>
        <p className="subtitulo">Gerencie e acompanhe suas operações na Ecoleta.</p>

        {/* Avisos de carregamento e de erro */}
        {carregando && <p className="perfil_aviso">Carregando perfil...</p>}
        {erro && <p className="perfil_aviso">Não foi possível carregar o perfil.</p>}

        {/* Os cards só aparecem depois de carregar, e se não deu erro.
            O <> </> agrupa vários elementos sem criar uma div extra. */}
        {!carregando && !erro && (
          <>
            {/* ===== CARD 1: RESUMO (ícone, nome, CNPJ e botão) ===== */}
            <section className="perfil_card perfil_resumo">
              <div className="perfil_icone">👤</div>

              <div className="perfil_resumo_texto">
                <h2>{perfil.nome}</h2>
                <p>{perfil.cnpj}</p>
              </div>

              <button className="perfil_botao">✎ Editar perfil</button>
            </section>

            {/* Esta div organiza os outros cards em 2 colunas */}
            <div className="perfil_grade">
              {/* Coluna da esquerda: Dados da empresa + Segurança, um embaixo do outro */}
              <div className="perfil_coluna">
                {/* ===== CARD 2: DADOS DA EMPRESA ===== */}
                <section className="perfil_card">
                  <h3 className="perfil_secao">DADOS DA EMPRESA</h3>

                  {/* Os campos ficam numa grade de 2 colunas.
                      "readOnly" = o usuário só enxerga, não consegue digitar. */}
                  <div className="perfil_campos">
                    <div className="perfil_campo">
                      <label htmlFor="nome">Nome da empresa</label>
                      <input id="nome" value={perfil.nome} readOnly />
                    </div>

                    <div className="perfil_campo">
                      <label htmlFor="cnpj">CNPJ</label>
                      <input id="cnpj" value={perfil.cnpj} readOnly />
                    </div>

                    <div className="perfil_campo">
                      <label htmlFor="telefone">Telefone</label>
                      <input id="telefone" value={perfil.telefone} readOnly />
                    </div>

                    <div className="perfil_campo">
                      <label htmlFor="email">E-mail</label>
                      <input id="email" value={perfil.email} readOnly />
                    </div>
                  </div>
                </section>

                {/* ===== CARD 3: SEGURANÇA ===== */}
                <section className="perfil_card perfil_card_seguranca">
                  <h3 className="perfil_secao">SEGURANÇA</h3>

                  <p className="perfil_label">Senha</p>
                  {/* A API nunca devolve a senha, então mostramos só os pontinhos */}
                  <p className="perfil_senha">••••••••</p>

                  <button className="perfil_botao perfil_botao_centro">Alterar senha</button>
                </section>
              </div>

              {/* ===== CARD 4: ENDEREÇO (coluna da direita) ===== */}
              <section className="perfil_card">
                <h3 className="perfil_secao">ENDEREÇO</h3>

                <div className="perfil_campos">
                  <div className="perfil_campo">
                    <label htmlFor="cep">CEP</label>
                    <input id="cep" value={perfil.cep} readOnly />
                  </div>

                  <div className="perfil_campo">
                    <label htmlFor="logradouro">Logradouro</label>
                    <input id="logradouro" value={perfil.logradouro} readOnly />
                  </div>

                  <div className="perfil_campo">
                    <label htmlFor="numero">Número</label>
                    <input id="numero" value={perfil.numero} readOnly />
                  </div>

                  <div className="perfil_campo">
                    <label htmlFor="estado">Estado</label>
                    <input id="estado" value={perfil.estado} readOnly />
                  </div>

                  <div className="perfil_campo">
                    <label htmlFor="cidade">Cidade</label>
                    <input id="cidade" value={perfil.cidade} readOnly />
                  </div>

                  <div className="perfil_campo">
                    <label htmlFor="bairro">Bairro</label>
                    <input id="bairro" value={perfil.bairro} readOnly />
                  </div>
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </main>
  );
}