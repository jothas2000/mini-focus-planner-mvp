// src/components/TaskList.tsx
import { Task } from "../types";
import { TaskCard } from "./TaskCard"; // Importando o novo componente!

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return <div className="text-center py-10 text-gray-500">Nenhuma tarefa encontrada.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {tasks.map((task) => (
        // Renderizando o card dinâmico passando a prop
        <TaskCard key={task.id} task={task} /> 
      ))}
    </div>
  );
}