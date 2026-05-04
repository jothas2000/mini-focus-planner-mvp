export type TaskStatus = "pending" | "done";
export type TaskPriority = "low" | "medium" | "high";
// definição do tipo Task, que representa a estrutura de uma tarefa no sistema, incluindo campos como id, título, descrição, categoria, prioridade, status e timestamps de criação e atualização
export type Task = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};