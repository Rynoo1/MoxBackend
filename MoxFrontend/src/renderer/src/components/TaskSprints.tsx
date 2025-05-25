import React from "react";
import { PersonCircle } from "react-bootstrap-icons";
import "../styles/Tasks.css"

type Props = {
  task: string;
  assigned: (string | number)[];
  status: string;
  priority: string;
  progress: number;
  date: string;
};

const getBadgeColor = (type: string, value: string) => {
  const colors: any = {
    status: {
      "Not Started": "badge-neutral",
      "In Progress": "badge-info",
      "Blocked": "badge-warning",
      "Completed": "badge-success",
    },
    priority: {
      Low: "badge-accent",
      Medium: "badge-warning",
      High: "badge-error",
      Critical: "badge-error",
    },
  };

  return colors[type]?.[value] || "badge-outline";
};

const TaskSprints: React.FC<Props> = ({ task, assigned, status, priority, progress, date }) => (
  <div className="card bg-base-100 shadow-md my-2">
    <div className="card-body p-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{task}</h3>
        <span className={`badge ${getBadgeColor("status", status)}`}>{status}</span>
      </div>

      <div className="flex justify-between mt-2 text-sm">
        <div className="flex gap-2 items-center">
          <span className={`badge ${getBadgeColor("priority", priority)}`}>{priority}</span>
        </div>

        <div className="avatar-group -space-x-2">
          {assigned.length ? assigned.map((_, i) => (
            <div key={i} className="avatar placeholder">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-6">
                <PersonCircle size={14} />
              </div>
            </div>
          )) : <span className="text-xs text-gray-400">Unassigned</span>}
        </div>
      </div>

      <div className="mt-3">
        <progress className="progress progress-primary w-full" value={progress} max="100"></progress>
        <div className="text-right text-xs mt-1">{progress}% complete</div>
      </div>

      <div className="text-xs mt-1 text-right opacity-60">Due: {date}</div>
    </div>
  </div>
);

export default TaskSprints;