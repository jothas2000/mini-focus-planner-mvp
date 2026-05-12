# 🎯 Mini Focus Planner

O **Mini Focus Planner** é uma aplicação web focada no gerenciamento simples, rápido e eficiente de tarefas diárias. Construído como um **MVP (Minimum Viable Product)**, o projeto prioriza uma experiência de usuário fluida, sem recarregamento de páginas, com organização clara e comportamento previsível.

---

## ✨ Funcionalidades

* ✅ **CRUD Completo**
  Criação, leitura, edição e exclusão de tarefas.

* 📝 **Campos Detalhados**
  Suporte para:

  * título obrigatório
  * descrição
  * categoria
  * prioridade (`Baixa`, `Média`, `Alta`)

* 🔄 **Controle de Status**
  Alternância rápida entre tarefas:

  * `Pendente`
  * `Concluída`

* 🔍 **Filtros Dinâmicos**
  Filtragem de tarefas por status sem recarregar a página.

* 📄 **Paginação Inteligente**
  Navegação entre páginas com proteção contra estados inválidos.

* 💾 **Persistência Local**
  Armazenamento automático via `localStorage`.

* 📱 **Responsividade**
  Interface adaptável para dispositivos móveis e desktops.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido utilizando tecnologias modernas do ecossistema React:

* **Next.js (App Router)** — Framework React para aplicações modernas.
* **TypeScript** — Tipagem estática para maior segurança e previsibilidade.
* **Tailwind CSS v4** — Estilização utilitária e responsiva.
* **Zustand** — Gerenciamento de estado global leve e reativo.
* **React Hook Form + Zod** — Formulários performáticos e validação robusta.
* **Vitest + React Testing Library** — Testes unitários e de componentes.

---

## 🚀 Como Executar o Projeto Localmente

### 📋 Pré-requisitos

Certifique-se de possuir instalado:

* **Node.js** `>= 18`

---

### 📥 Instalação

#### 1. Clone o repositório

```bash
git clone https://github.com/jothas2000/mini-focus-planner-mvp.git
```

#### 2. Acesse a pasta do projeto

```bash
cd mini-focus-planner-mvp
```

#### 3. Instale as dependências

```bash
npm install
```

#### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

---

### 🌐 Acesse no navegador

```txt
http://localhost:3000
```

---

## 🧪 Executando os Testes

O projeto utiliza **Vitest** e **React Testing Library** para a suíte de testes.

### ▶️ Executar testes em modo watch

```bash
npm run test
```

### ⚡ Executar todos os testes uma única vez

```bash
npm run test:run
```

### 🖥️ Abrir interface gráfica do Vitest

```bash
npm run test:ui
```

---

## 📄 Estratégia de Testes

Para detalhes sobre:

* o que testar
* por que testar
* como evitar testes frágeis

consulte o documento:

```txt
docs/testing-strategy.md
```

---

## 📂 Estrutura do Projeto

```plaintext
src/
├── app/              # Rotas, layouts e estilos globais do Next.js
├── components/       # Componentes reutilizáveis da interface
├── hooks/            # Hooks customizados
├── store/            # Estado global com Zustand
└── types/            # Tipagens globais do TypeScript
```

---

## 🎯 Objetivo do Projeto

O objetivo do **Mini Focus Planner** é servir como um MVP moderno e escalável, demonstrando boas práticas em:

* arquitetura frontend
* gerenciamento de estado
* validação de formulários
* persistência local
* testes automatizados
* experiência do usuário

---

---

## 📄 Licença

Este projeto está sob a licença MIT.
