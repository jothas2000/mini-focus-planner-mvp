import {render, screen} from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { TaskList } from './TaskList';
import { useTaskStore } from '../store/useTaskStore';
import userEvent from '@testing-library/user-event';
import * as hydrationHook from '../hooks/useStoreHydration'; 

// o TaskList é um componente que depende da store para mostrar as tarefas, então precisamos limpar a store antes de cada teste para garantir que eles sejam independentes
describe('TaskList', () => {
  beforeEach(() => {
    useTaskStore.setState({ tasks: [] });
  });

  // teste para verificar se a mensagem de lista vazia aparece quando não há tarefas
  it('deve renderizar a mensagem de lista vazia quando não houver tarefas', () => {
    render(<TaskList />);
    const emptyMessage = screen.getByText('Nenhuma tarefa encontrada para este filtro.');
    expect(emptyMessage).toBeInTheDocument();
  });

  // teste para verificar se as tarefas são renderizadas corretamente
  it('deve renderizar as tarefas corretamente', () => {
    // bota alguns testes como default
    useTaskStore.setState({
      tasks: [
        { id: '1', title: 'Tarefa 1', description: '', category: '', priority: 'low' , status: 'pending', createdAt: '', updatedAt: ''},
        { id: '2', title: 'Tarefa 2', description: '', category: '', priority: 'medium' , status: 'pending', createdAt: '', updatedAt: ''},
      ],
    });

    render(<TaskList />);

    // verifica se as labels das tarefas estão aparecendo na tela
    const task1 = screen.getByText('Tarefa 1');
    const task2 = screen.getByText('Tarefa 2');
    expect(task1).toBeInTheDocument();
    expect(task2).toBeInTheDocument();
  });

  it('deve filtrar as tarefas ao clicar nos botões de filtro', async () => {
    // 1. Arrange: Preparamos a store com uma tarefa pendente e uma concluída
    const user = userEvent.setup();
    useTaskStore.setState({
      tasks: [
        { id: '1', title: 'Tarefa Pendente', status: 'pending', priority: 'low', category: '', description: '', createdAt: '', updatedAt: '' },
        { id: '2', title: 'Tarefa Concluída', status: 'done', priority: 'high', category: '', description: '', createdAt: '', updatedAt: '' }
      ]
    });

    render(<TaskList />);

    // 2. Act: O usuário clica no botão de filtro "Concluídas"
    const btnConcluidas = screen.getByRole('button', { name: 'Concluídas' });
    await user.click(btnConcluidas);

    // 3. Assert: A concluída deve aparecer, e a pendente deve sumir
    expect(screen.getByText('Tarefa Concluída')).toBeInTheDocument();
    
    // verifica se a tarefa pendente sumiu da tela, usando queryByText, que retorna null se não encontrar, e esperamos que seja null (ou seja, que não esteja mais no documento)
    expect(screen.queryByText('Tarefa Pendente')).not.toBeInTheDocument(); 

    // 4. Act/Assert: Testa o botão "Pendentes"
    const btnPendentes = screen.getByRole('button', { name: 'Pendentes' });
    await user.click(btnPendentes);
    expect(screen.getByText('Tarefa Pendente')).toBeInTheDocument();
    expect(screen.queryByText('Tarefa Concluída')).not.toBeInTheDocument();

    // 5. Act/Assert: Testa o botão "Todas"
    const btnTodas = screen.getByRole('button', { name: 'Todas' });
    await user.click(btnTodas);
    expect(screen.getByText('Tarefa Pendente')).toBeInTheDocument();
    expect(screen.getByText('Tarefa Concluída')).toBeInTheDocument();
  });

  it('deve exibir apenas o limite de itens por página e permitir a navegação', async () => {
    // preparamos 6 tarefas como o limite é 5, nossa lista vai quebrar e criar a paginação
    const user = userEvent.setup();
    
    // mocando as tasks
    const mockTasks = Array.from({ length: 6 }).map((_, index) => ({
      id: String(index),
      title: `Tarefa de Teste ${index + 1}`,
      status: 'pending' as const,
      priority: 'low' as const,
      category: '', description: '', createdAt: '', updatedAt: ''
    }));

    useTaskStore.setState({ tasks: mockTasks });
    render(<TaskList />);

    // Tarefa 1 deve estar na tela, mas a Tarefa 6 (da pág 2) NÃO pode estar
    expect(screen.getByText('Tarefa de Teste 1')).toBeInTheDocument();
    expect(screen.queryByText('Tarefa de Teste 6')).not.toBeInTheDocument();

    // usuário clica no botão de "Próxima" página
    const btnProxima = screen.getByRole('button', { name: 'Próxima' });
    await user.click(btnProxima);

    // agora a Tarefa 6 deve estar visível, e a Tarefa 1 deve ter sumido
    expect(screen.getByText('Tarefa de Teste 6')).toBeInTheDocument();
    expect(screen.queryByText('Tarefa de Teste 1')).not.toBeInTheDocument();

    // usuário clica no botão "Anterior" para voltar
    const btnAnterior = screen.getByRole('button', { name: 'Anterior' });
    await user.click(btnAnterior);

    // tarefa 1 deve voltar a aparecer, e a Tarefa 6 deve sumir novamente
    expect(screen.getByText('Tarefa de Teste 1')).toBeInTheDocument();
    expect(screen.queryByText('Tarefa de Teste 6')).not.toBeInTheDocument();
  });

  it('deve exibir mensagem de carregamento antes da hidratação', () => {
    // Espionamos o nosso hook de hidratação e forçamos ele a retornar 'undefined' só neste teste para que o componente acredite que ainda está carregando as tarefas
    vi.spyOn(hydrationHook, 'useStoreHydration').mockReturnValue(undefined);

    render(<TaskList />);
    expect(screen.getByText('Carregando tarefas...')).toBeInTheDocument();

    // Limpamos o espião para não quebrar os outros testes
    vi.restoreAllMocks();
  });
});