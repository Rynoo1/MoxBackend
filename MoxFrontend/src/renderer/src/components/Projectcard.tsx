import React from 'react';
import './styles/Projectcard.css';
import Progressbar from './ProgressBar';
import TaskDetails from '@renderer/pages/TaskDetails';

interface SubTask {
  id: number;
  title: string;
  completed: boolean;
}

interface Task {
  taskId: number;
  title: string;
  description?: string;
  status: number;
  priority: number;
  dueDate?: string;
  projectID: number;
  isEmergency: boolean;
  assignedTo?: string[];
  subTasks?: SubTask[];
}

interface ProjectCardProps {
  ProjectID: number;
  ProjectName: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ ProjectID, ProjectName }) => {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:5183/api/Task/by-project/${ProjectID}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const parsed = Array.isArray(data.$values) ? data.$values : data;
        setTasks(parsed);
        console.log("📦 Loaded tasks:", parsed);
      } catch (err: any) {
        setError(err.message || "Failed to fetch tasks.");
      }
    };
    fetchTasks();
  }, [ProjectID]);

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return "Low";
      case 2: return "Medium";
      case 3: return "High";
      case 4: return "Critical";
      default: return "Unknown";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const allSubtasks = tasks.flatMap(task => task.subTasks || []);
  const completed = allSubtasks.filter(st => st.completed).length;
  const total = allSubtasks.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleBack = () => setSelectedTask(null);

  return (
    <div className="project-card w-full p-4 sm:p-6">
      <h1 className="TitleName mb-4">{ProjectName}</h1>
      {error && <div className="error">{error}</div>}

      {selectedTask ? (
        <TaskDetails task={selectedTask} onBack={handleBack} />
      ) : (
        <div className="overflow-x-auto">
          <table className="task-table">
            <thead>
              <tr>
                <th>Tasks</th>
                <th>Users</th>
                <th>Priority</th>
                <th>Timeline</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody style={{ cursor: "pointer" }}>
              {tasks.map(task => (
                <tr
                  key={task.taskId}
                  onClick={() => setSelectedTask(task)}
                >
                  <td>{task.title}</td>
                  <td>{task.status}</td>
                  <td>{getPriorityLabel(task.priority)}</td>
                  <td>
                    <Progressbar progress={
                      task.subTasks && task.subTasks.length > 0
                        ? Math.round(
                            (task.subTasks.filter(st => st.completed).length / task.subTasks.length) * 100
                          )
                        : 0
                    } />
                  </td>
                  <td>{formatDate(task.dueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="overall-progress mt-4">
        <strong>Project Progress:</strong>
        <Progressbar progress={progress} />
      </div>
    </div>
  );
};

export default ProjectCard;