import { useState } from "react";
import _tasks from "../data/tasks.json";
import type { Task } from "../types/tasks";

const Kanban = () => {
  const [tasks, setTasks] = useState<Task[]>(_tasks as Task[]);

  const columns: { title: string; status: Task["status"]; color: string }[] = [
    { title: "TODO", status: "TODO", color: "text-amber-400" },
    { title: "IN PROGRESS", status: "IN_PROGRESS", color: "text-blue-400" },
    { title: "DONE", status: "DONE", color: "text-green-400" },
  ];

  return (
    <div className="container mx-auto px-6">
      <h1 className="text-center py-8 text-3xl font-bold text-zinc-100">
        Kanban Board
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <div
            key={col.status}
            className="rounded-xl bg-zinc-800/60 backdrop-blur-sm"
          >
            <h2
              className={`text-center text-xl py-3 font-semibold border-b border-zinc-700 ${col.color}`}
            >
              {col.title}
            </h2>
            <div className="flex flex-col gap-4 p-4">
              {(tasks as Task[])
                .filter((task) => task.status === col.status)
                .map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 shadow-sm hover:shadow-md hover:bg-zinc-700/80 transition"
                  >
                    <h3 className="text-lg font-medium text-zinc-100">
                      {task.title}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      {task.description.length > 45
                        ? `${task.description.slice(0, 45)}...`
                        : task.description}
                    </p>
                    <div className="mt-2 flex justify-between text-sm text-zinc-300">
                      <span>
                        Assigned to:{" "}
                        <span className="text-zinc-200 font-medium">
                          {task.assignedTo.name}
                        </span>
                      </span>
                      <span>{new Date(task.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kanban;
