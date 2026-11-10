// TELA DE CADASTRO da empresa coletora.
// Como funciona, resumindo:
//  1. O usuário digita e cada letra é guardada no estado "valores".
//  2. Ao sair do campo CEP, buscamos logradouro, bairro, cidade e estado no ViaCEP.
//  3. Ao clicar em Cadastrar, validamos os campos.
//  4. Se estiver tudo certo, enviamos os dados para a API.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Campo } from '../../components/campo/Campo';
import { cadastrarEmpresa, getCep } from './cadastroApi';
import { nomesEstados } from '../../utils/estados';
import './Cadastro.css';

// Valores iniciais: todos os campos começam vazios
const valoresIniciais = {
  nome: '', cnpj: '', cep: '', logradouro: '', bairro: '', cidade: '',
  estado: '', numero: '', email: '', telefone: '', senha: '', confirmar: ''
};

// Deixa só os números de um texto. Exemplo: '12.345-678' vira '12345678'
// (o \D significa "qualquer coisa que NÃO seja número", e trocamos por vazio)
function numeros(texto) {
  return texto.replace(/\D/g, '');
}

// O banco guarda o CNPJ formatado: 12.345.678/0001-90
// slice(inicio, fim) corta um pedaço do texto
function formatarCnpj(cnpj) {
  return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12)}`;
}

// O banco guarda o CEP formatado: 06401-000
function formatarCep(cep) {
  return `${cep.slice(0, 5)}-${cep.slice(5)}`;
}

// Confere todos os campos e devolve um objeto com os erros encontrados.
// Exemplo de retorno: { cnpj: '* CNPJ inválido', email: '* Email inválido' }
// Se o objeto voltar vazio, não tem nenhum erro.
function validar(valores) {
  let erros = {};

  // for...in percorre cada campo do objeto "valores".
  // Se o campo estiver vazio (trim tira os espaços), é obrigatório.
  for (let campo in valores) {
    if (valores[campo].trim() === '') {
      erros[campo] = '* Campo de preenchimento obrigatório';
    }
  }

  // Validações específicas. O "!erros.cnpj" garante que só validamos
  // o formato se o campo não estiver vazio.
  if (!erros.cnpj && numeros(valores.cnpj).length !== 14) erros.cnpj = '* CNPJ inválido';
  if (!erros.cep && numeros(valores.cep).length !== 8) erros.cep = '* CEP inválido';
  // Se, tirando as letras, o texto mudou, é porque tinha letras no número
  if (!erros.numero && numeros(valores.numero) !== valores.numero.trim()) erros.numero = '* Digite apenas números';
  // A API só aceita número do local a partir de 1
  if (!erros.numero && Number(valores.numero) < 1) erros.numero = '* Número inválido';
  if (!erros.telefone && numeros(valores.telefone).length < 10) erros.telefone = '* Telefone inválido';
  if (!erros.email && !valores.email.includes('@')) erros.email = '* Email inválido';
  // A API aceita senha de 8 a 30 caracteres
  if (!erros.senha && valores.senha.length < 8) erros.senha = '* Mínimo de 8 caracteres';
  if (!erros.senha && valores.senha.length > 30) erros.senha = '* Máximo de 30 caracteres';
  if (!erros.confirmar && valores.senha !== valores.confirmar) erros.confirmar = '* As senhas não coincidem';

  // Cidade e estado são preenchidos pelo CEP, então a mensagem é outra
  if (erros.cidade) erros.cidade = '* Informe o CEP para carregar';
  if (erros.estado) erros.estado = '* Informe o CEP para carregar';

  return erros;
}

export function Cadastro() {
  // useNavigate dá uma função para trocar de tela pelo código
  const navigate = useNavigate();

  // ESTADOS: informações que, ao mudar, atualizam a tela
  const [valores, setValores] = useState(valoresIniciais); // o que o usuário digitou
  const [erros, setErros] = useState({}); // mensagens de erro de cada campo
  const [mensagem, setMensagem] = useState(''); // mensagem geral (sucesso ou erro da API)
  const [sucesso, setSucesso] = useState(false); // true = a mensagem é de sucesso
  const [enviando, setEnviando] = useState(false); // true = esperando a resposta da API

  // Roda a cada letra digitada em qualquer campo
  function mudar(evento) {
    // "name" é o nome do campo e "value" é o texto digitado
    let { name, value } = evento.target;

    if (name === 'cep') {
      // Se o CEP mudou, apagamos cidade e estado do CEP anterior
      setValores({ ...valores, cep: value, cidade: '', estado: '' });
    } else {
      // {...valores} copia todos os valores atuais, e [name]: value troca só o campo digitado.
      // (os colchetes usam o conteúdo da variável "name" como nome do campo)
      setValores({ ...valores, [name]: value });
    }

    // Apaga o erro do campo que o usuário está corrigindo
    setErros({ ...erros, [name]: '' });
  }

  // Roda quando o usuário SAI do campo CEP: busca o endereço no ViaCEP
  async function buscarCep() {
    let cep = numeros(valores.cep);
    if (cep.length !== 8) return; // CEP incompleto, não busca

    let dados = await getCep(cep);

    if (dados) {
      // Preenche os campos com o que veio do ViaCEP
      setValores({
        ...valores,
        logradouro: dados.logradouro || valores.logradouro, // se não vier, mantém o que já estava
        bairro: dados.bairro || valores.bairro,
        cidade: dados.localidade, // o ViaCEP chama a cidade de "localidade"
        estado: dados.uf // sigla do estado (SP)
      });
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

    // 2. Monta o objeto no formato que a API espera (os nomes vêm do swagger)
    let dados = {
      nome_empresa: valores.nome,
      cnpj: formatarCnpj(numeros(valores.cnpj)),
      cep: formatarCep(numeros(valores.cep)),
      logradouro: valores.logradouro,
      bairro: valores.bairro,
      cidade: valores.cidade,
      nome_estado: nomesEstados[valores.estado], // pega o nome pela sigla: SP vira São Paulo
      sigla_estado: valores.estado,
      numero_local: Number(valores.numero), // a API espera número, não texto
      email: valores.email,
      telefone: numeros(valores.telefone), // só números
      senha: valores.senha,
      confirmar_senha: valores.confirmar
    };

    // 3. Envia para a API e espera a resposta (await)
    setEnviando(true); // desabilita o botão enquanto envia
    let resultado = await cadastrarEmpresa(dados);
    setEnviando(false);

    // 4. Mostra o resultado na tela
if (resultado.ok) {
  setSucesso(true);
  setMensagem('Cadastro realizado com sucesso! Redirecionando para o login...');
  setValores(valoresIniciais); // limpa o formulário

  // setTimeout espera 2000 ms (2 s) e só então roda a função.
  // Esse tempo dá para o usuário LER a mensagem antes da troca de tela.
  setTimeout(() => navigate('/'), 2000);
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
        {/* Caixa do título */}
        <header className="card_titulo">
          <h1>CADASTRE-SE</h1>
          <p>Realize as coletas para melhorar o meio ambiente, através da rede Ecoleta.</p>
        </header>

        {/* onSubmit: roda a função "enviar" quando o formulário é enviado */}
        <form className="formulario" onSubmit={enviar}>
          <Campo label="Nome da empresa" nome="nome" grande {...props} />
          <Campo label="CNPJ" nome="cnpj" {...props} />
          {/* aoPerderFoco: quando sai do CEP, busca o endereço */}
          <Campo label="CEP" nome="cep" aoPerderFoco={buscarCep} {...props} />
          <Campo label="Logradouro" nome="logradouro" grande {...props} />
          <Campo label="Bairro" nome="bairro" {...props} />
          {/* somenteLeitura: preenchidos pelo CEP, o usuário não digita */}
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