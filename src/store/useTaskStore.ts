import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task } from '../types';

interface TaskStore {
  tasks: Task[];
  toggleTaskStatus: (id: string) => void;
  addTask: (taskData: Omit<Task, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, updatedData: Partial<Task>) => void; 
}
// zustand store para gerenciamento global das tarefas, com persistência no localStorage para manter os dados mesmo após fechar o navegador
export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      toggleTaskStatus: (id: string) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id
            ? { ...task, status: task.status === 'pending' ? 'done' : 'pending', updatedAt: new Date().toISOString() }
            : task
        ),
      })),
      // a lógica de adição de tarefa, onde criamos um novo objeto de tarefa com os dados fornecidos, geramos um ID único, definimos o status como 'pending' e adicionamos timestamps de criação e atualização
      addTask: (taskData) => set((state) => {
        const newTask: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return { tasks: [newTask, ...state.tasks] };
      }),
      // a lógica de exclusão de tarefa, onde filtramos a lista de tarefas para remover a tarefa com o ID correspondente
      deleteTask: (id: string) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      })),

      // a lógica de edição de tarefa, onde mapeamos a lista de tarefas para encontrar a tarefa com o ID correspondente e atualizamos seus dados com as informações fornecidas, além de atualizar o timestamp de atualização
      editTask: (id: string, updatedData) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id
            ? { ...task, ...updatedData, updatedAt: new Date().toISOString() }
            : task
        ),
      })),
    }),
    {
      name: 'mini-focus-planner-storage',
    }
  )
);