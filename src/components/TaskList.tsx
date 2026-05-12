"use client";

import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { useStoreHydration } from "../hooks/useStoreHydration";
import { TaskCard } from "./TaskCard";
import { Task } from "../types";

type FilterType = "all" | "pending" | "done";

// limite de itens por paginas
const ITEMS_PER_PAGE = 5; 

export function TaskList() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tasks = useStoreHydration<any, Task[]>(
    useTaskStore, 
    (state) => state.tasks
  );
  
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  
  // começa na primeira
  const [currentPage, setCurrentPage] = useState(1); 

  

  // reseta filtro e paginação ao mudar de filtro, para evitar páginas vazias
  function handleFilterChange(filter: FilterType) {
    setActiveFilter(filter);
    setCurrentPage(1); // reseta para a primeira página quando muda no filtro
  }
  // proteção para quando as tarefas ainda estão sendo carregadas (ex: do localStorage)
  if (!tasks) {
    return <div className="text-center py-10 text-gray-500">Carregando tarefas...</div>;
  }

  // friltra tudo
  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === "all") return true;
    return task.status === activeFilter;
  });

  // calcula o total de páginas normalmente
  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE) || 1;

  // proteção para evitar páginas vazias: se a página atual for maior que o total de páginas, volta para a última página válida
  const validCurrentPage = Math.min(currentPage, totalPages);

  // calcula os índices para fatiar as tarefas filtradas e pegar somente as que devem aparecer na página atual
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 mb-2">
        <button 
          onClick={() => handleFilterChange("all")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          Todas
        </button>
        <button 
          onClick={() => handleFilterChange("pending")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeFilter === "pending" ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          Pendentes
        </button>
        <button 
          onClick={() => handleFilterChange("done")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeFilter === "done" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          Concluídas
        </button>
      </div>
      {filteredTasks.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-white border border-dashed rounded-lg">
          Nenhuma tarefa encontrada para este filtro.
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {paginatedTasks.map((task: Task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 p-4 bg-white border rounded-lg shadow-sm">
              <button 
                disabled={validCurrentPage === 1}
                onClick={() => setCurrentPage(validCurrentPage - 1)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-600 font-medium">
                Página {validCurrentPage} de {totalPages}
              </span>
              <button 
                disabled={validCurrentPage === totalPages}
                onClick={() => setCurrentPage(validCurrentPage + 1)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}