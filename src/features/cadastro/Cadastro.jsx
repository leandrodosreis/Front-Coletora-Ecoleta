import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Campo } from '../../components/campo/Campo';
import { cadastrarEmpresa } from './cadastroApi';
import './Cadastro.css';

const valoresIniciais = {
  nome: '', cnpj: '', cep: '', logradouro: '', bairro: '', cidade: '',
  estado: '', numero: '', email: '', telefone: '', senha: '', confirmar: ''
};

const estados = ['SP', 'RJ', 'MG'];
const cidades = ['São Paulo', 'Campinas'];

// deixa só os números de um texto: '12.345-678' vira '12345678'
function numeros(texto) {
  return texto.replace(/\D/g, '');
}

function validar(valores) {
  let erros = {};

  for (let campo in valores) {
    if (valores[campo].trim() === '') {
      erros[campo] = '* Campo de preenchimento obrigatório';
    }
  }

  if (!erros.cnpj && numeros(valores.cnpj).length !== 14) erros.cnpj = '* CNPJ inválido';
  if (!erros.cep && numeros(valores.cep).length !== 8) erros.cep = '* CEP inválido';
  if (!erros.telefone && numeros(valores.telefone).length < 10) erros.telefone = '* Telefone inválido';
  if (!erros.email && !valores.email.includes('@')) erros.email = '* Email inválido';
  if (!erros.senha && valores.senha.length < 8) erros.senha = '* Mínimo de 8 caracteres';
  if (!erros.confirmar && valores.senha !== valores.confirmar) erros.confirmar = '* As senhas não coincidem';

  return erros;
}

export function Cadastro() {
  const navigate = useNavigate();
  const [valores, setValores] = useState(valoresIniciais);
  const [erros, setErros] = useState({});
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);

  function mudar(evento) {
    let { name, value } = evento.target;
    setValores({ ...valores, [name]: value }); // atualiza só o campo digitado
    setErros({ ...erros, [name]: '' });        // some o erro desse campo
  }

  async function enviar(evento) {
    evento.preventDefault();

    let novosErros = validar(valores);
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    let dados = {
      nome: valores.nome,
      cnpj: numeros(valores.cnpj),
      cep: numeros(valores.cep),
      logradouro: valores.logradouro,
      bairro: valores.bairro,
      cidade: valores.cidade,
      estado: valores.estado,
      numero: valores.numero,
      email: valores.email,
      telefone: numeros(valores.telefone),
      senha: valores.senha
    };

    setEnviando(true);
    let resultado = await cadastrarEmpresa(dados);
    setEnviando(false);

    if (resultado.ok) {
      setSucesso(true);
      setMensagem('Cadastro realizado com sucesso!');
      setValores(valoresIniciais);
    } else {
      setSucesso(false);
      setMensagem(resultado.mensagem);
      setErros(resultado.campos || {});
    }
  }

  const props = { valores, erros, aoMudar: mudar };

  return (
    <main className="tela_cadastro">
      <section className="container_cadastro">
        <header className="card_titulo">
          <h1>CADASTRE-SE</h1>
          <p>Realize as coletas para melhorar o meio ambiente, através da rede Ecoleta.</p>
        </header>

        <form className="formulario" onSubmit={enviar}>
          <Campo label="Nome da empresa" nome="nome" grande {...props} />
          <Campo label="CNPJ" nome="cnpj" {...props} />
          <Campo label="CEP" nome="cep" {...props} />
          <Campo label="Logradouro" nome="logradouro" grande {...props} />
          <Campo label="Bairro" nome="bairro" {...props} />
          <Campo label="Cidade" nome="cidade" opcoes={cidades} {...props} />
          <Campo label="Estado" nome="estado" opcoes={estados} {...props} />
          <Campo label="Número do local" nome="numero" {...props} />
          <Campo label="Email" nome="email" tipo="email" {...props} />
          <Campo label="Telefone" nome="telefone" tipo="tel" {...props} />
          <Campo label="Senha" nome="senha" tipo="password" {...props} />
          <Campo label="Confirmar senha" nome="confirmar" tipo="password" {...props} />

          {mensagem && (
            <p className={sucesso ? 'mensagem mensagem_sucesso' : 'mensagem mensagem_erro'}>
              {mensagem}
            </p>
          )}

          <div className="botoes">
            <button type="button" className="botao botao_sair" onClick={() => navigate('/')}>
              Sair
            </button>
            <button type="submit" className="botao botao_cadastrar" disabled={enviando}>
              {enviando ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
