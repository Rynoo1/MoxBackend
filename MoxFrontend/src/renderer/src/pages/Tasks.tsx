import React, { useEffect, useState } from "react";
import { fetchAllTasks } from "../services/api";
import TaskSprints from "../components/TaskSprints";

type Task = {
  task: string;
  assigned: (string | number)[];
  status: string;
  priority: string;
  progress: number;
  date: string;
};

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const all = await fetchAllTasks();
        const statusLabels = ["Not Started", "In Progress", "Blocked", "Completed"];
        const priorityLabels = ["Low", "Medium", "High", "Critical"];

        const formatted = all.map((t: any) => ({
          task: t.title,
          assigned: t.assignedUserId ? [t.assignedUserId] : [],
          status: statusLabels[t.status] ?? "Unknown",
          priority: priorityLabels[t.priority - 1] ?? "N/A",
          progress: t.completedAt ? 100 : 0,
          date: new Date(t.dueDate).toLocaleDateString("en-ZA", {
            day: "2-digit", month: "2-digit", year: "numeric",
          }),
        }));

        setTasks(formatted);
      } catch (err) {
        console.error("Failed to load tasks", err);
      }
    };

    loadTasks();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Sprint #001</h1>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="grid grid-cols-6 bg-base-200 font-semibold px-4 py-2 text-sm text-blue-900">
          <div>Task</div>
          <div>Assigned</div>
          <div>Status</div>
          <div>Priority</div>
          <div>Timeline</div>
          <div className="text-right">Date</div>
        </div>

        {tasks.map((t, i) => (
          <TaskSprints key={i} {...t} />
        ))}
      </div>
    </div>
  );
};

export default Tasks;