import { render, screen } from '@testing-library/react'; // Ferramentas visuais
import userEvent from '@testing-library/user-event'; // Simulador de usuário
import { describe, it, expect, beforeEach } from 'vitest';
import { TaskForm } from './addTaskForm'; // Confirme se o nome exportado no seu arquivo é TaskForm ou AddTaskForm
import { useTaskStore } from '../store/useTaskStore';

describe('AddTaskForm', () => {
  // Como o formulário salva dados na Store, precisamos limpar ela antes de cada teste!
  beforeEach(() => {
    useTaskStore.setState({ tasks: [] });
  });

  // TESTE 1: Renderização (Garante que o usuário vê os campos)
  it('deve renderizar os campos de título, descrição, categoria, prioridade e o botão', () => {
    // 1. Arrange: Desenhamos o componente na tela virtual
    render(<TaskForm />); 

    // 2. Act & Assert: Procuramos os elementos e esperamos que eles estejam no documento
    
    // Procura o input de título pelo texto do placeholder
    const titleInput = screen.getByPlaceholderText('O que precisa ser feito?');
    expect(titleInput).toBeInTheDocument(); // Verifica se ele realmente apareceu

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

  // MISSÃO 2: Criação de tarefa com sucesso
  it('deve adicionar uma tarefa válida na store ao preencher e enviar', async () => {

    const user = userEvent.setup();
    render(<TaskForm />);
    
    // Encontre o input de título e digite algo
    const titleInput = screen.getByPlaceholderText('O que precisa ser feito?');
    await user.type(titleInput, 'Minha nova tarefa');

    // Encontre o botão de enviar e clique
    const submitButton = screen.getByRole('button', { name: 'Adicionar' });
    await user.click(submitButton);

    // Verifique a Store! useTaskStore.getState().tasks deve ter length 1 e o title da task[0] deve bater.
    const tasks = useTaskStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Minha nova tarefa');
  });

  // MISSÃO 3: Limpeza do formulário
  it('deve limpar os campos do formulário após a criação com sucesso', async () => {
    const user = userEvent.setup();
    render(<TaskForm />);

    // Encontre o input de título e digite algo
    const titleInput = screen.getByPlaceholderText('O que precisa ser feito?');
    await user.type(titleInput, 'Minha nova tarefa');

    // Encontre o botão de enviar e clique
    const submitButton = screen.getByRole('button', { name: 'Adicionar' });
    await user.click(submitButton);

    // Verifique a Store! useTaskStore.getState().tasks deve ter length 1 e o title da task[0] deve bater.
    const tasks = useTaskStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Minha nova tarefa');
    expect(titleInput).toHaveValue(''); // O input de título deve estar vazio após o envio
    
  });

});