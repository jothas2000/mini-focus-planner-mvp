import { render, screen } from '@testing-library/react'; // Ferramentas visuais
import userEvent from '@testing-library/user-event'; // Simulador de usuário
import { describe, it, expect, beforeEach } from 'vitest';
import { TaskForm } from './addTaskForm';
import { useTaskStore } from '../store/useTaskStore';

describe('AddTaskForm', () => {
  beforeEach(() => {
    useTaskStore.setState({ tasks: [] });
  });

  it('deve renderizar os campos de título, descrição, categoria, prioridade e o botão', () => {
    // 1. Arrange: Desenhamos o componente na tela virtual
    render(<TaskForm />); 

    // 2. Act & Assert: Procuramos os elementos e esperamos que eles estejam no documento
    
    // procura o input de título pelo texto do placeholder
    const titleInput = screen.getByPlaceholderText('O que precisa ser feito?');
    expect(titleInput).toBeInTheDocument(); // espera que ele tenha aparecido na telaq

    // Procura o textarea de descrição
    const descInput = screen.getByPlaceholderText('Adicione uma descrição (opcional)');
    expect(descInput).toBeInTheDocument();

    // Procura o input de categoria
    const categoryInput = screen.getByPlaceholderText('Categoria (ex: Estudos, Trabalho)');
    expect(categoryInput).toBeInTheDocument();

    // Procura o select (aqui usamos getByRole, que busca pelo tipo do elemento no HTML)
    const prioritySelect = screen.getByRole('combobox'); 
    expect(prioritySelect).toBeInTheDocument();

    // Procura o botão (também por Role, e especificamos o texto dentro dele)
    const submitButton = screen.getByRole('button', { name: 'Adicionar' });
    expect(submitButton).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro se tentar enviar sem preencher o título', async () => {
    const user = userEvent.setup();
    render(<TaskForm />);
    const submitButton = screen.getByRole('button', { name: 'Adicionar' });
    await user.click(submitButton); // Simula o clique no botão de enviar sem preencher nada

    // Agora precisamos verificar se a mensagem de erro apareceu na tela
    const errorMessage = await screen.findByText('O título é obrigatório');
    expect(errorMessage).toBeInTheDocument();
  });

  it('deve adicionar uma tarefa válida na store ao preencher e enviar', async () => {

    const user = userEvent.setup();
    render(<TaskForm />); // "renderiza" o componente para que possamos interagir com ele
  
    const titleInput = screen.getByPlaceholderText('O que precisa ser feito?');
    await user.type(titleInput, 'Minha nova tarefa'); // simula o usuário digitando um título válido

    // encontra o botão de enviar e clique
    const submitButton = screen.getByRole('button', { name: 'Adicionar' });
    await user.click(submitButton);

    // verifica a store, se está vazia e se o tamanho é 1, e se o título da primeira tarefa é o que digitamos
    const tasks = useTaskStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Minha nova tarefa');
  });

  // limpeza do formulário após a criação com sucesso
  it('deve limpar os campos do formulário após a criação com sucesso', async () => {
    const user = userEvent.setup();
    render(<TaskForm />);

    // Encontra o input de título e digite algo
    const titleInput = screen.getByPlaceholderText('O que precisa ser feito?');
    await user.type(titleInput, 'Minha nova tarefa');

    // encontra o botão de enviar e clique
    const submitButton = screen.getByRole('button', { name: 'Adicionar' });
    await user.click(submitButton);

    // mesmo coisa da outra lógica, verifica se tem somente uma tarefa, se o título é o que digitamos, e se o input de título foi limpo (está vazio)
    const tasks = useTaskStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Minha nova tarefa');
    expect(titleInput).toHaveValue(''); // input vazio
    
  });

});