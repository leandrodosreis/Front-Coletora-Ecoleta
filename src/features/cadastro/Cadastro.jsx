import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Campo } from '../../components/campo/Campo';
import { cadastrarEmpresa, getCep } from './cadastroApi';
import './Cadastro.css';

// Valores iniciais: todos os campos começam vazios
const valoresIniciais = {
  nome: '', cnpj: '', cep: '', logradouro: '', bairro: '', cidade: '',
  estado: '', numero: '', email: '', telefone: '', senha: '', confirmar: ''
};

// Dados que chegam da busca do CEP e vão junto no cadastro (o usuário não digita)
const localInicial = { id_cidade: null, latitude: null, longitude: null };

// Deixa só os números de um texto. Exemplo: '12.345-678' vira '12345678'
function numeros(texto) {
  return texto.replace(/\D/g, '');
}

// O banco guarda o CNPJ formatado: 12.345.678/0001-90
// slice(home, fim) corta um pedaço do texto
function formatarCnpj(cnpj) {
  return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12)}`;
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
  if (!erros.numero && numeros(valores.numero) !== valores.numero.trim()) erros.numero = '* Digite apenas números';
  if (!erros.telefone && numeros(valores.telefone).length < 10) erros.telefone = '* Telefone inválido';
  if (!erros.email && !valores.email.includes('@')) erros.email = '* Email inválido';
  if (!erros.senha && valores.senha.length < 8) erros.senha = '* Mínimo de 8 caracteres';
  if (!erros.confirmar && valores.senha !== valores.confirmar) erros.confirmar = '* As senhas não coincidem';


  if (erros.cidade) erros.cidade = '* Informe o CEP para carregar';
  if (erros.estado) erros.estado = '* Informe o CEP para carregar';

  return erros;
}

export function Cadastro() {
  const navigate = useNavigate();

  // ESTADOS: informações que, ao mudar, atualizam a tela
  const [valores, setValores] = useState(valoresIniciais); // o que o usuário digitou
  const [local, setLocal] = useState(localInicial); // dados do CEP (id da cidade, latitude, longitude)
  const [erros, setErros] = useState({}); // mensagens de erro de cada campo
  const [mensagem, setMensagem] = useState(''); // mensagem geral (sucesso ou erro da API)
  const [sucesso, setSucesso] = useState(false); // true = a mensagem é de sucesso
  const [enviando, setEnviando] = useState(false); // true = esperando a resposta da API

  // Roda a cada letra digitada em qualquer campo
  function mudar(evento) {
    let { name, value } = evento.target;

    if (name === 'cep') {
      setValores({ ...valores, cep: value, cidade: '', estado: '' });
      setLocal(localInicial);
    } else {
      setValores({ ...valores, [name]: value });
    }

    // Apaga o erro do campo que o usuário está corrigindo
    setErros({ ...erros, [name]: '' });
  }

  async function buscarCep() {
    let cep = numeros(valores.cep);
    if (cep.length !== 8) return; 

    let dados = await getCep(cep);

    if (dados) {
      // Preenche os campos com o que veio da API
      setValores({
        ...valores,
        logradouro: dados.logradouro || valores.logradouro, // se a API não mandar, mantém o que já estava
        bairro: dados.bairro || valores.bairro,
        cidade: dados.nome_cidade,
        estado: dados.sigla_estado
      });
      // Guarda os dados que serão enviados no cadastro
      setLocal({ id_cidade: dados.id_cidade, latitude: dados.latitude, longitude: dados.longitude });
      setErros({ ...erros, cep: '', cidade: '', estado: '' });
    } else {
      setErros({ ...erros, cep: '* CEP não encontrado' });
    }
  }

  // Roda quando o usuário clica em Cadastrar
  async function enviar(evento) {
    evento.preventDefault(); // impede a página de recarregar ao enviar o formulário

    // 1. Valida os campos
    let novosErros = validar(valores);
    setErros(novosErros);
    // Object.keys lista os campos com erro. Se tiver algum, para aqui.
    if (Object.keys(novosErros).length > 0) return;

    // 2. Monta o objeto no formato que a API espera
    let dados = {
      nome: valores.nome,
      cnpj: formatarCnpj(numeros(valores.cnpj)),
      email: valores.email,
      telefone: numeros(valores.telefone),
      senha: valores.senha,
      endereco: {
        cep: numeros(valores.cep),
        logradouro: valores.logradouro,
        numero: Number(valores.numero), 
        bairro: valores.bairro,
        id_cidade: local.id_cidade,
        latitude: local.latitude,
        longitude: local.longitude
      }
    };

    // 3. Envia para a API e espera a resposta (await)
    setEnviando(true);
    let resultado = await cadastrarEmpresa(dados);
    setEnviando(false);

    // 4. Mostra o resultado na tela
    if (resultado.ok) {
      setSucesso(true);
      setMensagem('Cadastro realizado com sucesso!');
      setValores(valoresIniciais);
      setLocal(localInicial);
    } else {
      setSucesso(false);
      setMensagem(resultado.mensagem);
    }
  }

  // Props que todos os Campos recebem. Em vez de repetir em cada um,
  // guardamos aqui e usamos {...props}, que espalha esses três itens no componente.
  const props = { valores, erros, aoMudar: mudar };

  return (
    <main className="tela_cadastro">
      <section className="container_cadastro">
        <header className="card_titulo">
          <h1>CADASTRE-SE</h1>
          <p>Realize as coletas para melhorar o meio ambiente, através da rede Ecoleta.</p>
        </header>

        {/* onSubmit: roda a função "enviar" quando o formulário é enviado */}
        <form className="formulario" onSubmit={enviar}>
          <Campo label="Nome da empresa" nome="nome" grande {...props} />
          <Campo label="CNPJ" nome="cnpj" {...props} />
          <Campo label="CEP" nome="cep" aoPerderFoco={buscarCep} {...props} />
          <Campo label="Logradouro" nome="logradouro" grande {...props} />
          <Campo label="Bairro" nome="bairro" {...props} />
          <Campo label="Cidade" nome="cidade" somenteLeitura {...props} />
          <Campo label="Estado" nome="estado" somenteLeitura {...props} />
          <Campo label="Número do local" nome="numero" {...props} />
          <Campo label="Email" nome="email" tipo="email" {...props} />
          <Campo label="Telefone" nome="telefone" tipo="tel" {...props} />
          <Campo label="Senha" nome="senha" tipo="password" {...props} />
          <Campo label="Confirmar senha" nome="confirmar" tipo="password" {...props} />

          {/* A mensagem geral só aparece se existir (verde = sucesso, vermelha = erro) */}
          {mensagem && (
            <p className={sucesso ? 'mensagem mensagem_sucesso' : 'mensagem mensagem_erro'}>
              {mensagem}
            </p>
          )}

          <div className="botoes">
            <button type="button" className="botao botao_sair" onClick={() => navigate('/')}>
              Sair
            </button>
            {/* disabled: o botão fica desligado enquanto envia, evitando clique duplo */}
            <button type="submit" className="botao botao_cadastrar" disabled={enviando}>
              {enviando ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
