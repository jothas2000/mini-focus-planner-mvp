// src/mocks/tasks.ts
import { Task } from "../types";

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Estudar Next.js",
    description: "Ler a documentação sobre Server Components",
    priority: "high",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Comprar café",
    priority: "medium",
    status: "done",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];