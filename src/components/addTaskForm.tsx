"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTaskStore } from "../store/useTaskStore";

// categoriza o que é opcional e o que é obrigatório, além de validar os dados do formulário
const createTaskSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
  category: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
});

type CreateTaskData = z.infer<typeof createTaskSchema>;
// componente do formulário de criação de tarefas
export function TaskForm() {
  const addTask = useTaskStore((state) => state.addTask);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      priority: "medium", // Valor padrão para facilitar a vida do usuário
    },
  });

  function onSubmit(data: CreateTaskData) {
    addTask(data);
    reset(); // Limpa todos os campos do formulário após salvar
  }
  // estrutura do formulário, utilizando Tailwind para estilização e react-hook-form para controle dos dados
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 p-4 bg-white border rounded-lg shadow-sm mb-6">
      
      {/* Campo: Título */}
      <div>
        <input
          {...register("title")}
          placeholder="O que precisa ser feito?"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        />
        {errors.title && <span className="text-red-500 text-sm mt-1">{errors.title.message}</span>}
      </div>

      {/* Campo: Descrição (A sua sugestão!) */}
      <textarea
        {...register("description")}
        placeholder="Adicione uma descrição (opcional)"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20 text-sm"
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          {...register("category")}
          placeholder="Categoria (ex: Estudos, Trabalho)"
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />

        <select
          {...register("priority")}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
        >
          <option value="low">Prioridade: Baixa</option>
          <option value="medium">Prioridade: Média</option>
          <option value="high">Prioridade: Alta</option>
        </select>

        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          Adicionar
        </button>
      </div>
    </form>
  );
}