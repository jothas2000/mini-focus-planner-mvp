# Estratégia de Testes - Mini Focus Planner

## Respostas Fundamentais

**1. Qual é a diferença entre teste unitário, teste de componente e teste end-to-end?**
- **Unitário:** Testa uma função, hook ou regra de negócio isolada (ex: testar se a função `addTask` do Zustand adiciona um item ao array).
- **Componente:** Testa um pedaço da interface renderizado de forma isolada, simulando interações do usuário (ex: testar se clicar no botão de `TaskCard` chama a função de deletar).
- **End-to-End (E2E):** Testa o fluxo completo em um navegador real, do frontend ao banco de dados, como se fosse o usuário final.

**2. Por que React Testing Library incentiva testar comportamento visível ao usuário?**
Para evitar testes frágeis. O usuário não se importa se usamos `useState` ou `useReducer`, ele se importa se ao clicar em "Salvar" a tarefa aparece na tela. Se testarmos o comportamento, podemos refatorar o código interno sem quebrar os testes.

**3. Qual é a diferença entre fireEvent e userEvent?**
- `fireEvent` dispara eventos do DOM diretamente (forma mais bruta).
- `userEvent` simula a interação real do usuário, acionando todos os eventos secundários (ex: ao digitar, ele dispara `keyDown`, `keyPress`, `keyUp`, focos, etc), sendo muito mais fiel à realidade.

**4. O que é jsdom e por que ele é usado em testes de front-end?**
O Vitest roda em Node.js, que não tem uma tela, não tem a tag `<div>` nem `document`. O `jsdom` é uma simulação de um navegador dentro do Node, permitindo renderizar nossos componentes React e interagir com eles no terminal.

**5. Para que serve @testing-library/jest-dom?**
Ele adiciona "matchers" (verificadores) específicos para o DOM, deixando o código legível. Em vez de escrever `expect(elemento.className.includes('hidden')).toBe(false)`, escrevemos `expect(elemento).toBeVisible()`.

**6. Como testar componentes que dependem de Zustand?**
Podemos renderizar o componente normalmente com a RTL. Como o Zustand funciona fora do ciclo de vida tradicional do React, o componente consegue ler a store durante o teste. O segredo está em garantir que a store seja limpa antes de cada teste.

**7. Como isolar o estado da store entre testes?**
O Zustand mantém o estado em memória. Se um teste criar uma tarefa, o teste seguinte verá essa tarefa. Para isolar, precisamos criar uma função utilitária ou usar as configurações do Vitest (`beforeEach`) para resetar o estado inicial da store antes de cada teste (`useTaskStore.setState({ tasks: [] })`).

**8. Como testar código que usa localStorage?**
O `jsdom` possui uma API mockada do `localStorage`. Porém, para garantir testes puros, muitas vezes é melhor mockar o `localStorage` com o Vitest (`vi.spyOn(Storage.prototype, 'setItem')`) ou limpar o storage manualmente entre os testes.

**9. O que torna um teste frágil?**
Testar detalhes de implementação. Exemplo: testar o nome de uma variável interna, ou selecionar um botão testando uma classe CSS específica (que pode mudar num redesign) ao invés de buscar o botão pelo texto ou atributo acessível (`aria-label` ou `role`).

**10. Por que testar classes Tailwind diretamente normalmente é uma má ideia?**
Se você testar `expect(elemento).toHaveClass('bg-red-500')`, e amanhã o designer decidir mudar para `bg-red-600`, seu teste falha, mesmo a funcionalidade de erro continuando perfeita. A classe CSS não garante o comportamento lógico.