import { TaskForm } from "@/components/addTaskForm";
import { TaskList } from "@/components/TaskList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-2xl mx-auto p-6">
        
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">mini focus planner</h1>
        </header>

        <TaskForm />
        
        <section>
          <TaskList />
        </section>

      </div>
    </main>
  );
}