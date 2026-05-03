// src/app/page.tsx
import { TaskList } from "@/components/TaskList";
import { mockTasks } from "@/mocks/tasks";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-2xl mx-auto p-6">
        
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mini Focus Planner</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
            Nova Tarefa
          </button>
        </header>

        {/* Nossa lista agora recebe os dados reais (mockados) via props! */}
        <section>
          <TaskList tasks={mockTasks} />
        </section>

      </div>
    </main>
  );
}