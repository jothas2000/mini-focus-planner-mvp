import { describe, it, expect, beforeEach } from 'vitest';
import { useTaskStore } from './useTaskStore';

describe('useTaskStore', () => {
  // limpa a store antes de cada teste para evitar vazamento de estado
  beforeEach(() => {
    useTaskStore.setState({ tasks: [] });
  });

  it('deve adicionar uma nova tarefa com id, createdAt, updatedAt e status pending', () => {
    // prepara para os testes
    const taskData = {
      title: 'Estudar Vitest',
      description: 'Assistir aula do Otávio',
      category: 'Estudos',
      priority: 'high' as const,
    };

    // adiciona a tarefa na store
    useTaskStore.getState().addTask(taskData);
    const tasks = useTaskStore.getState().tasks;
    const newTask = tasks[0];

    // verifica se a tarefa foi adicionada corretamente, e se os campos automáticos foram gerados (id, createdAt, updatedAt, status)
    expect(tasks).toHaveLength(1);
    expect(newTask.title).toBe('Estudar Vitest');
    expect(newTask.status).toBe('pending');
    expect(newTask.id).toEqual(expect.any(String)); // ID dinamico
    expect(newTask.createdAt).toEqual(expect.any(String));
  });

it('deve alternar o status de uma tarefa entre pending e done', () => {
    // adicionamos duas tarefas
    useTaskStore.getState().addTask({ title: 'Comprar pão', priority: 'low' });
    useTaskStore.getState().addTask({ title: 'Limpar a casa', priority: 'medium' });
    useTaskStore.getState().addTask({ title: 'Estudar para prova', priority: 'high' });
    
    // Vamos alterar a primeira e deixar a segunda intacta
    const tasks = useTaskStore.getState().tasks;
    const taskParaAlterar = tasks[0]; 
    const taskParaAlterar2 = tasks[2]; // Essa é a tarefa que não vamos alterar, para garantir que o toggle nao mexe nela
    
    // marca a primeira como done
    useTaskStore.getState().toggleTaskStatus(taskParaAlterar.id);
    useTaskStore.getState().toggleTaskStatus(taskParaAlterar2.id); // Marca a segunda como done
    useTaskStore.getState().toggleTaskStatus(taskParaAlterar2.id); // Marca a segunda como pending de novo
    
    // verificação dos estados
    expect(useTaskStore.getState().tasks[0].status).toBe('done'); // Passou no ramo verdadeiro
    expect(useTaskStore.getState().tasks[1].status).toBe('pending'); // Passou no ramo falso (: task)
    expect(useTaskStore.getState().tasks[2].status).toBe('pending'); // A terceira tarefa foi alterar duas vezes e voltou para pending
  });

  it('deve editar os dados de uma tarefa existente sem perder os dados antigos', async () => {
    // adicionamos duas tarefas
    useTaskStore.getState().addTask({ title: 'Tarefa Antiga 1', description: 'Desc original 1', priority: 'low' });
    useTaskStore.getState().addTask({ title: 'Tarefa Antiga 2', description: 'Desc original 2', priority: 'high' });
    
    const tasks = useTaskStore.getState().tasks;
    const taskIdParaEditar = tasks[1].id;
    const dataAntiga = tasks[1].updatedAt;

    // nossa pausa para o relógio andar e nao verificar o createdat no mesmo momento
    await new Promise((resolve) => setTimeout(resolve, 10));

    // altera o titulo da primeira tarefa
    useTaskStore.getState().editTask(taskIdParaEditar, { title: 'Tarefa Atualizada' });
    const tasksAtualizadas = useTaskStore.getState().tasks;

    // veriicação  que a tarefa foi realmente atualizada
    expect(tasksAtualizadas[1].title).toBe('Tarefa Atualizada'); // O ramo verdadeiro funcionou
    expect(tasksAtualizadas[1].updatedAt).not.toBe(dataAntiga);
    
    // prova de que o ramo falso funcionou: a tarefa 2 não sofreu alterações
    expect(tasksAtualizadas[0].title).toBe('Tarefa Antiga 2'); 
  });

  it('deve excluir a tarefa correta da lista', () => {
    // Adiciona duas tarefas
    useTaskStore.getState().addTask({ title: 'Tarefa 1', priority: 'low' });
    useTaskStore.getState().addTask({ title: 'Tarefa 2', priority: 'medium' });
    
    const tasksAntes = useTaskStore.getState().tasks;
    const idParaExcluir = tasksAntes[0].id; // vamos excluir a Tarefa 2 (pois ela entra no começo do array)

    // deleta tarefa pelo ID
    useTaskStore.getState().deleteTask(idParaExcluir);
    const tasksDepois = useTaskStore.getState().tasks;

    // verifica se a tarefa realmente foi removida
    expect(tasksDepois).toHaveLength(1);
    expect(tasksDepois[0].id).not.toBe(idParaExcluir); 
  });
});