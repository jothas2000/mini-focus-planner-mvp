"use client";
import { Task } from "../types";

interface TaskCardProps {
  task: Task; // props para o taskcard, que recebe um objeto do tipo task, que é como se fosse nosso "DTO"
}

export function TaskCard({ task }: TaskCardProps) {
  // resultado fica guardado em uma variável booleana, tornando mais prático
  const isDone = task.status === "done";

  return (
    <div
      className={`p-4 border rounded-lg shadow-sm transition-all flex items-center gap-4 ${
        isDone ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
      }`}
    >
      
        <input
            type="checkbox"
            className="w-6 h-6 cursor-pointer accent-green-600"
            checked={isDone}
            // Por enquanto, apenas logamos no console para testar o clique.
            // Logo mais, isso chamará a nossa função da Store.
            onChange={() => console.log(`Clicou para alterar o status da tarefa: ${task.id}`)}
        />
        
    {/* Usamos flex-1 para esta div ocupar todo o espaço restante do meio */}
      <div className="flex flex-col gap-1 flex-1">
        <p
          className={`font-bold text-lg ${
            isDone ? "text-green-800 line-through opacity-70" : "text-yellow-900"
          }`}
        >
          {task.title}
        </p>
        
        {task.description && (
          <p className={isDone ? "text-green-700 opacity-70" : "text-yellow-700"}>
            {task.description}
          </p>
        )}
      </div>

      {/* emote pq deixa com aspecto agradável ao usuário */}
      <div className="text-2xl" title={isDone ? "Concluída" : "Pendente"}>
        {isDone ? "✅" : "⏳"}
      </div>
    </div>
  );
}