import { useState, useEffect } from 'react';
import { getPerfil, atualizarPerfil } from './perfilApi';
import "./Perfil.css"
import { CabecalhoPagina } from '../../components/cabecalhoPagina/CabecalhoPagina';

const perfilInicial = {
  nome: '', cnpj: '', telefone: '', email: '',
  cep: '', logradouro: '', numero: '', estado: '', cidade: '', bairro: ''
};

export function Perfil() {

  const [perfil, setPerfil] = useState(perfilInicial);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [perfilOriginal, setPerfilOriginal] = useState(null);

  useEffect(() => {
  async function carregarDados() {
    let dados = await getPerfil();

    if (dados) {
      setPerfil(dados);
    } else {
      setErro(true);
    }

    setCarregando(false);
  }

  carregarDados();
}, []);

  // Atualiza os campos conforme o usuário digita
function handleChange(event) {
  let { name, value } = event.target;

  setPerfil({
    ...perfil,
    [name]: value
  });
}

// Ativa a edição e guarda os dados originais
function editarPerfil() {
  setPerfilOriginal({ ...perfil });
  setMensagem('');
  setEditando(true);
}

// Cancela a edição e recupera os dados anteriores
function cancelarEdicao() {
  setPerfil(perfilOriginal);
  setEditando(false);
  setMensagem('');
}

// Busca os dados do endereço pelo CEP
async function buscarCEP(cep) {
  let cepLimpo = cep.replace(/\D/g, '');

  if (cepLimpo.length !== 8) return;

  try {
    let response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    let dados = await response.json();

    if (dados.erro) {
      setMensagem('CEP não encontrado.');
      return;
    }

    setPerfil(atual => ({
      ...atual,
      cep: dados.cep,
      logradouro: dados.logradouro,
      bairro: dados.bairro,
      cidade: dados.localidade,
      estado: dados.uf,
      nomeEstado: dados.estado
    }));

    setMensagem('');

  } catch (error) {
    console.error(error);
    setMensagem('Não foi possível consultar o CEP.');
  }
}

// Salva as alterações na API
async function salvarPerfil() {
  setSalvando(true);
  setMensagem('');

  let resultado = await atualizarPerfil(perfil);

  if (resultado.ok) {
    setEditando(false);
    setPerfilOriginal(null);
    setMensagem('Perfil atualizado com sucesso!');
  } else {
    setMensagem(resultado.mensagem);
  }

  setSalvando(false);
}
  return(

    <main className="tela_perfil">
      <div className="conteudo_perfil">
        <CabecalhoPagina etiqueta="PAINEL DA EMPRESA COLETORA" titulo="Perfil da empresa" descricao="Consulte e atualize os dados da sua empresa coletora." />

        {/* Avisos de carregamento e de erro */}
        {carregando && <p className="perfil_aviso">Carregando perfil...</p>}
        {erro && <p className="perfil_aviso">Não foi possível carregar o perfil.</p>}

        {!carregando && !erro && (
          <>

            <section className="perfil_card perfil_resumo">
              <div className="perfil_icone">👤</div>

              <div className="perfil_resumo_texto">
                <h2>{perfil.nome}</h2>
                <p>{perfil.cnpj}</p>
              </div>

              {!editando && (
                <button className="perfil_botao" onClick={editarPerfil}>
                  ✎ Editar perfil
                </button>
              )}
            </section>

            {mensagem && <p className="perfil_aviso">{mensagem}</p>}
            
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
                      <input
                        id="nome"
                        name="nome"
                        value={perfil.nome}
                        onChange={handleChange}
                        readOnly={!editando}
                      />
                    </div>

                    <div className="perfil_campo">
                      <label htmlFor="cnpj">CNPJ</label>
                      <input
                        id="cnpj"
                        value={perfil.cnpj}
                        readOnly
                      />
                    </div>

                    <div className="perfil_campo">
                      <label htmlFor="telefone">Telefone</label>
                      <input
                        id="telefone"
                        name="telefone"
                        value={perfil.telefone}
                        onChange={handleChange}
                        readOnly={!editando}
                      />
                    </div>

                    <div className="perfil_campo">
                      <label htmlFor="email">E-mail</label>
                      <input
                        id="email"
                        name="email"
                        value={perfil.email}
                        onChange={handleChange}
                        readOnly={!editando}
                      />
                    </div>
                  </div>
                </section>

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
                      <input
                        id="cep"
                        name="cep"
                        value={perfil.cep}
                        onChange={handleChange}
                        onBlur={() => buscarCEP(perfil.cep)}
                        readOnly={!editando}
                      />
                  </div>

                  <div className="perfil_campo">
                    <label htmlFor="logradouro">Logradouro</label>
                    <input
                      id="logradouro"
                      name="logradouro"
                      value={perfil.logradouro}
                      onChange={handleChange}
                      readOnly={!editando}
                    />
                  </div>

                  <div className="perfil_campo">
                    <label htmlFor="numero">Número</label>
                    <input
                      id="numero"
                      name="numero"
                      value={perfil.numero}
                      onChange={handleChange}
                      readOnly={!editando}
                    />
                  </div>

                  <div className="perfil_campo">
                    <label htmlFor="estado">Estado</label>
                    <input
                      id="estado"
                      value={perfil.estado}
                      readOnly
                    />
                  </div>

                  <div className="perfil_campo">
                    <label htmlFor="cidade">Cidade</label>
                    <input
                      id="cidade"
                      value={perfil.cidade}
                      readOnly
                    />
                  </div>

                  <div className="perfil_campo">
                    <label htmlFor="bairro">Bairro</label>
                    <input
                      id="bairro"
                      value={perfil.bairro}
                      readOnly
                    />
                  </div>
                </div>
              </section>
            </div>
              {editando && (
                <div className="perfil_acoes">
                  <button
                    className="perfil_botao"
                    onClick={salvarPerfil}
                    disabled={salvando}
                  >
                    {salvando ? 'Salvando...' : 'Salvar alterações'}
                  </button>

                  <button
                    className="perfil_botao"
                    onClick={cancelarEdicao}
                    disabled={salvando}
                  >
                    Cancelar
                  </button>
                </div>
              )}
          </>
        )}
      </div>
    </main>
  );

}
