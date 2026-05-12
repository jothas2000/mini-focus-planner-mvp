# Estratégia de Testes - Mini Focus Planner

Este documento detalha as decisões técnicas, ferramentas e metodologias aplicadas na implementação da suíte de testes do Mini Focus Planner.

## Decisões Técnicas e Ferramentas

### 1. Ferramentas Utilizadas
- **Vitest:** Escolhido como o test runner principal por sua integração nativa com o ecossistema Vite/Next.js moderno.
- **React Testing Library (RTL):** Utilizada para testes de componentes, focando na interação do usuário em vez de detalhes de implementação.
- **jsdom:** Ambiente que simula o navegador no Node.js, permitindo a renderização de componentes React no terminal, muito eficiente e bom de trabalhar.
- **@testing-library/user-event:** Versão avançada de simulação de eventos que dispara interações mais fiéis ao comportamento humano (como foco e eventos de teclado), sintaxe fácil de entender pois tem padrões comuns.

### 2. Por que essas ferramentas?
A escolha buscou alinhar o projeto às práticas mais modernas de desenvolvimento web. O Vitest substitui o Jest com mais performance, e a RTL garante que os testes não sejam frágeis, permitindo refatorações futuras sem a necessidade de reescrever toda a cadeia de testes.

### 3. Tipos de Comportamento Testados
- **Lógica de Negócio (Store):** CRUD completo, persistência e integridade dos dados (ID único, timestamps).
- **Validação de Formulários:** Feedback visual de erros (Zod/React Hook Form) e limpeza de campos após sucesso.
- **Interação de UI:** Filtros dinâmicos, paginação e alternância de status de tarefas.
- **Acessibilidade:** Verificação de rótulos (aria-labels) e papéis semânticos (roles).

### 4. Partes Fora desta Etapa
- **Testes End-to-End (E2E):** Fluxos complexos em navegadores reais (como Playwright ou Cypress) não foram incluídos nesta fase inicial.
- **Integração com Backend Real:** O projeto utiliza persistência local (`localStorage`), portanto, mocks de API não foram necessários, somente na parte de verificar se estava mostrando a mensagem de carregamento antes da hidratação, fiz um mock reverso, fazendo retornar undefined ao inves de [] ou dados na tela, portanto mostrando a mensagem de carregamento.

### 5. Como Rodar os Testes
- **Modo Watch:** `npm run test`
- **Execução Única:** `npm run test:run`
- **Interface Gráfica:** `npm run test:ui`
- **Relatório de Cobertura:** `npm run test:coverage`

### 6. Dificuldades Encontradas
- **Sincronismo de Datas:** No teste de edição da Store, a velocidade de execução gerou timestamps idênticos, exigindo o uso de `setTimeout` e promessas para garantir a diferença de milissegundos.
- **Teste de Hidratação:** Simular o estado "Carregando tarefas..." exigiu o uso de `vi.spyOn` para mockar o retorno do hook customizado de hidratação, garantindo que o componente lidasse bem com o estado inicial indefinido.
- **O uso de aria-label:** Gerou um pouco de confusão pois tive que adicionar a tag do aria-label para poder usar os emotes, mas no final deu certo.

### 7. Melhorias Percebidas no Código
- **Refatoração de Estado:** Os testes identificaram uma atualização de estado problemática durante a renderização da `TaskList`. O código foi refatorado para usar **Estado Derivado (Calculated Value)**, eliminando renderizações duplicadas e avisos do ESLint, o mau uso do useEffect pode desencadear mensagem de más práticas, e como a de efeito em cascara e de rules of hooks, basicamente o react pedindo para que eu instancie o state dentro do effect, para não gerar efeitos em cascata como foi observado antes, e rules of hooks é chamar os hooks em uma ordem pré-estabelecida, sempre que o componente renderiza eles devem ser carregados na mesma ordem, e como temos um IF isso pode mudar, o que é uma má prática.
- **Acessibilidade:** A dificuldade em encontrar botões de ícones nos testes levou à implementação de `aria-labels`, tornando a aplicação utilizável por tecnologias assistivas.

---

## Respostas Fundamentais

**1. Diferença entre teste unitário, de componente e E2E?**
- **Unitário:** Testa funções isoladas (ex: store).
- **Componente:** Testa a UI e interações em isolamento (ex: botões, inputs).
- **E2E:** Testa o fluxo completo no navegador, do início ao fim.

**2. Por que testar comportamento visível ao usuário?**
Para evitar testes frágeis. Se testarmos variáveis internas, o teste quebra ao mudar o código. Se testarmos o que o usuário vê (texto, botões), podemos mudar a lógica interna e o teste continuará provando que a funcionalidade está de pé.

**3. Diferença entre fireEvent e userEvent?**
`fireEvent` dispara apenas o evento final. `userEvent` simula toda a jornada (ex: clicar, ganhar foco, pressionar teclas), sendo muito mais fiel ao que realmente acontece no navegador.

**4. O que é jsdom?**
É uma simulação de navegador em JavaScript puro que roda dentro do Node.js, permitindo que o Vitest "desenhe" o HTML sem precisar abrir um Chrome ou Firefox real.

**5. Para que serve @testing-library/jest-dom?**
Ele adiciona "superpoderes" ao Vitest, permitindo escrever expectativas legíveis como `.toBeInTheDocument()` ou `.toBeVisible()`.

**6. Como testar componentes que dependem de Zustand?**
Podemos renderizar o componente normalmente; o RTL lerá a Store. O segredo é injetar dados usando `useTaskStore.setState()` antes do `render`.

**7. Como isolar o estado da store entre testes?**
Usando a função `beforeEach` para resetar a Store (`setState({ tasks: [] })`) antes de cada teste, garantindo que uma tarefa criada num teste não apareça no teste seguinte.

**8. Como testar código que usa localStorage?**
O `jsdom` já possui um mock interno do `localStorage`, mas também podemos usar `vi.spyOn` para verificar se dados estão sendo salvos corretamente.

**9. O que torna um teste frágil?**
Testar detalhes de implementação (nomes de variáveis, classes CSS, estrutura interna do HTML) em vez de focar no resultado final para o usuário.

**10. Por que não testar classes Tailwind diretamente?**
Porque classes de estilo mudam constantemente. O teste deve validar se um botão funciona, não se ele é azul ou vermelho, a menos que a cor seja uma regra de negócio crítica.

---
Desenvolvido por **mim** 