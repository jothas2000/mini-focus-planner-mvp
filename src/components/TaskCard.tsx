"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Task } from "../types";
import { useTaskStore } from "../store/useTaskStore";

const editTaskSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
});

type EditTaskData = z.infer<typeof editTaskSchema>;

interface TaskCardProps {
  task: Task;
}
// componente do cartão de tarefa, responsável por exibir as informações da tarefa e permitir ações como marcar como feita, editar e excluir
export function TaskCard({ task }: TaskCardProps) {
  const toggleTaskStatus = useTaskStore((state) => state.toggleTaskStatus);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const editTask = useTaskStore((state) => state.editTask);

  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<EditTaskData>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      priority: task.priority as any,
    },
  });

  const isDone = task.status === "done";

  const priorityConfig = {
    low: { label: "Baixa", color: "bg-blue-100 text-blue-800" },
    medium: { label: "Média", color: "bg-yellow-100 text-yellow-800" },
    high: { label: "Alta", color: "bg-red-100 text-red-800" },
  };

  const currentPriority = priorityConfig[task.priority as keyof typeof priorityConfig];

  function onSave(data: EditTaskData) {
    editTask(task.id, data);
    setIsEditing(false);
  }
  // se estiver no modo de edição, renderiza o formulário de edição, caso contrário, renderiza o cartão da tarefa com as informações e ações disponíveis
  if (isEditing) {
    return (
      <form onSubmit={handleSubmit(onSave)} className="p-4 border rounded-lg shadow-sm bg-yellow-50 border-yellow-200 flex flex-col gap-3">
        <input 
          {...register("title")} 
          className="w-full p-2 border rounded bg-white" 
          placeholder="Título da tarefa"
        />
        {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}

        <textarea 
          {...register("description")} 
          className="w-full p-2 border rounded text-sm bg-white" 
          placeholder="Descrição (opcional)"
        />

        <div className="flex gap-2 justify-between">
          <select {...register("priority")} className="p-2 border rounded text-sm bg-white">
            <option value="low">Prioridade: Baixa</option>
            <option value="medium">Prioridade: Média</option>
            <option value="high">Prioridade: Alta</option>
          </select>

          <div className="flex gap-2">
            <button type="button" onClick={() => setIsEditing(false)} 
            className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded">
              Cancelar
            </button>
            <button type="submit" 
            aria-label="Salvar"
            className="px-3 py-1 bg-green-600 text-white hover:bg-green-700 rounded font-bold">
              Salvar
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className={`p-4 border rounded-lg shadow-sm transition-all flex items-center gap-4 ${isDone ? "bg-green-50 border-green-200" : "bg-white border-gray-200"}`}>
      <input
        type="checkbox"
        className="w-6 h-6 cursor-pointer accent-green-600"
        checked={isDone}
        onChange={() => toggleTaskStatus(task.id)}
      />

      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center gap-2">
          <p className={`font-bold text-lg ${isDone ? "text-green-800 line-through opacity-70" : "text-gray-900"}`}>
            {task.title}
          </p>
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${currentPriority.color}`}>
            {currentPriority.label}
          </span>
        </div>
        {task.description && (
          <p className={isDone ? "text-green-700 opacity-70" : "text-gray-600"}>
            {task.description}
          </p>
        )}
        {task.category && (
          <p className={"text-gray-600"}>
            {task.category}
          </p>
        )}
      </div>

      <div className="flex gap-1">
        <button onClick={() => setIsEditing(true)} 
        aria-label="Editar"
        className="text-gray-400 hover:text-blue-500 transition-colors p-2" title="Editar tarefa">
          ✏️
        </button>
        <button onClick={() => deleteTask(task.id)} 
        aria-label="Excluir"
        className="text-gray-400 hover:text-red-500 transition-colors p-2" title="Excluir tarefa">
          🗑️
        </button>
      </div>
    </div>
  );
}