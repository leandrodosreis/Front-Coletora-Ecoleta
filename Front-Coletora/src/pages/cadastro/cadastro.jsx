import { useState } from "react";
import "./Cadastro.css";

const ESTADOS = ["SP", "RJ", "MG"];
const CIDADES = ["São Paulo", "Campinas"];

function Campo({ label, id, type = "text", children, className = "" }) {
  return (
    <div className={`campo ${className}`}>
      <label htmlFor={id}>{label}</label>
      {children ?? <input id={id} name={id} type={type} />}
      <span className="campo__erro">* Campo de preenchimento obrigatório</span>
    </div>
  );
}

function Select({ id, label, opcoes }) {
  return (
    <Campo label={label} id={id}>
      <div className="select">
        <select id={id} name={id} defaultValue="">
          <option value="" disabled hidden />
          {opcoes.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <svg className="select__seta" viewBox="0 0 20 12" aria-hidden="true">
          <path d="M1 1h18L10 11z" />
        </svg>
      </div>
    </Campo>
  );
}

function CampoSenha({ id, label }) {
  const [visivel, setVisivel] = useState(false);
  return (
    <Campo label={label} id={id}>
      <div className="senha">
        <input id={id} name={id} type={visivel ? "text" : "password"} />
        <button
          type="button"
          className="senha__olho"
          onClick={() => setVisivel(!visivel)}
          aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5C6 5 2 12 2 12s4 7 10 7 10-7 10-7-4-7-10-7z" />
            <circle cx="12" cy="12" r="3.2" />
            {!visivel && <path d="M3 3l18 18" />}
          </svg>
        </button>
      </div>
    </Campo>
  );
}

export default function Cadastro() {
  return (
    <main className="cadastro">
      <section className="cadastro__card">
        <header className="cadastro__titulo">
          <h1>CADASTRE-SE</h1>
          <p>
            Realize as coletas para melhorar o meio ambiente, através da rede
            Ecoleta.
          </p>
        </header>

        <form className="cadastro__form" noValidate>
          <Campo label="Nome da empresa" id="empresa" className="col-2" />
          <Campo label="CNPJ" id="cnpj" />
          <Campo label="CEP" id="cep" />
          <Campo label="Logradouro" id="logradouro" className="col-2" />
          <Campo label="Bairro" id="bairro" />
          <Select label="Cidade" id="cidade" opcoes={CIDADES} />
          <Select label="Estado" id="estado" opcoes={ESTADOS} />
          <Campo label="Número do local" id="numero" />
          <Campo label="Email" id="email" type="email" />
          <Campo label="Telefone" id="telefone" type="tel" />
          <CampoSenha label="Senha" id="senha" />
          <CampoSenha label="Confirmar senha" id="confirmar" />

          <div className="cadastro__acoes col-2">
            <button type="button" className="btn btn--sair">Sair</button>
            <button type="submit" className="btn btn--cadastrar">Cadastrar</button>
          </div>
        </form>
      </section>
    </main>
  );
}