import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PencilSquare } from "react-bootstrap-icons";
import { PriorityLevel } from "../models/TaskEnums";
import ProgressBar from "../components/ProgressBar";

interface TaskDto {
  taskId?: number;
  title: string;
  description?: string;
  projectID: number;
  assignedTo?: string[];
  priority: PriorityLevel;
  status: number;
  deadline?: string;
  isEmergency: boolean;
}

function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState<TaskDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!taskId) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`http://localhost:5183/api/Task/${taskId}`);
        if (!res.ok) throw new Error("Task not found.");
        const data = await res.json();
        setTask(data);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    })();
  }, [taskId]);

  const priorityColor = {
    [PriorityLevel.Low]: "bg-green-100 text-green-700",
    [PriorityLevel.Medium]: "bg-yellow-100 text-yellow-700",
    [PriorityLevel.High]: "bg-red-100 text-red-700",
    [PriorityLevel.Critical]: "bg-red-200 text-red-900 font-bold",
  };

  return (
    <div className="min-h-screen bg-[#f4f7fc] p-6 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-md border border-gray-200 p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-xl font-bold text-blue-900 font-[Manrope]">
              {task?.title || "No Task Found"}
            </h1>
            {task?.deadline && (
              <p className="text-sm text-gray-400 mt-1">
                📅 Due: {new Date(task.deadline).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center text-blue-500 text-sm">Loading...</div>
        )}

        {!loading && error && (
          <div className="text-center bg-red-100 text-red-700 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        {!loading && task && (
          <>
            <div className="mb-6">
              <h2 className="text-md font-semibold text-blue-900 mb-1 font-[Manrope]">
                📝 Description
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {task.description || "No description provided."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-6">
              <div>
                <span className="block text-gray-400 text-xs mb-1">Priority</span>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${priorityColor[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
              <div>
                <span className="block text-gray-400 text-xs mb-1">Progress</span>
                <ProgressBar progress={task.status} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskDetails;