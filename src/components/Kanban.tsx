import { useState } from "react";
import _tasks from "../data/tasks.json";
import type { Task } from "../types/tasks";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// ItemTypes for DnD
const ItemTypes = {
  CARD: "card",
};

// Status badge colors
const statusColors: Record<Task["status"], string> = {
  TODO: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  IN_PROGRESS: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  DONE: "bg-green-500/20 text-green-400 border border-green-500/30",
};

// Task Card Component
const TaskCard = ({ task }: { task: Task }) => {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: { id: task.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [task.id]
  );

  return (
    <div
      ref={dragRef as any}
      className="relative p-4 bg-zinc-800 rounded-lg border border-zinc-700 shadow-sm hover:shadow-md hover:bg-zinc-700/80 transition"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {/* Status Badge */}
      <span
        className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-medium rounded-full ${
          statusColors[task.status]
        }`}
      >
        {task.status.replace("_", " ")}
      </span>

      <h3 className="text-lg font-medium text-zinc-100">{task.title}</h3>
      <p className="text-sm text-zinc-400 mt-1">
        {task.description.length > 45
          ? `${task.description.slice(0, 45)}...`
          : task.description}
      </p>
      <div className="mt-3 flex justify-between text-sm text-zinc-300">
        <span>
          👤{" "}
          <span className="text-zinc-200 font-medium">
            {task.assignedTo.name}
          </span>
        </span>
        <span>🕒 {new Date(task.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
};

// Column Component
const Column = ({
  title,
  status,
  color,
  tasks,
  moveTask,
}: {
  title: string;
  status: Task["status"];
  color: string;
  tasks: Task[];
  moveTask: (id: string, newStatus: Task["status"]) => void;
}) => {
  const [, dropRef] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      drop: (item: { id: string }) => moveTask(item.id, status),
    }),
    [status]
  );

  return (
    <div
      ref={dropRef as any}
      className="rounded-xl bg-zinc-800/60 backdrop-blur-sm min-h-[300px] border border-zinc-700"
    >
      <h2
        className={`text-center text-xl py-3 font-semibold border-b border-zinc-700 ${color}`}
      >
        {title} <span className="text-zinc-400 text-sm">({tasks.length})</span>
      </h2>
      <div className="flex flex-col gap-4 p-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

// Main Kanban Component
const Kanban = () => {
  const [tasks, setTasks] = useState<Task[]>(_tasks as Task[]);

  const moveTask = (id: string, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

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
      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col) => (
            <Column
              key={col.status}
              title={col.title}
              status={col.status}
              color={col.color}
              tasks={tasks.filter((task) => task.status === col.status)}
              moveTask={moveTask}
            />
          ))}
        </div>
      </DndProvider>
    </div>
  );
};

export default Kanban;
