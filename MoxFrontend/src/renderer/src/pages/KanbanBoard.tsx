import React, { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";

interface Task {
  taskId: number;
  title: string;
  description?: string;
  priority: string;
  isEmergency: boolean;
  dueDate: string;
  completedAt?: string;
  status: string;
  assignedUserId?: string;
}

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetch("http://localhost:5183/api/task")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched tasks:", data);
        setTasks(data);
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const handleDrag = (taskId: number, newStatus: string) => {
    const updatedTasks = tasks.map((task) =>
      task.taskId === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
  };

  const renderColumn = (title: string, status: string) => (
    <div className="kanban-column">
      <h2>{title}</h2>
      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <TaskCard key={task.taskId} task={task} onDrag={handleDrag} />
        ))}
    </div>
  );

  return (
    <div className="kanban-board">
      <h1>Kanban Board</h1>
      <div className="kanban-columns">
        {renderColumn("To Do", "NotStarted")}
        {renderColumn("In Progress", "InProgress")}
        {renderColumn("Done", "Completed")}
      </div>
    </div>
  );
};

export default KanbanBoard;



// import React, { useState, useEffect } from "react";
// import TaskCard from "../components/TaskCard";

// const KanbanBoard: React.FC = () => {
//   const [tasks, setTasks] = useState<any[]>([]);


//   useEffect(() => {
//     fetch("http://localhost:5183/api/task")
//       .then((res) => res.json())
//       .then((data) => setTasks(data))
//       .catch((err) => console.error("Error fetching tasks:", err));
//   }, []);

//   const handleDrag = (taskId: number, newStatus: string) => {
//     const updatedTasks = tasks.map((task) =>
//       task.taskId === taskId ? { ...task, status: newStatus } : task
//     );
//     setTasks(updatedTasks);
//   };

//   return (
//     <div className="kanban-board">
//       <h1>Kanban Board</h1>
//       <div className="kanban-columns">
//         <div className="kanban-column">
//           <h2>To Do</h2>
//           {tasks
//             .filter((task) => task.status === "NotStarted")
//             .map((task) => (
//               <TaskCard key={task.taskId} task={task} onDrag={handleDrag} />
//             ))}
//         </div>
//         <div className="kanban-column">
//           <h2>In Progress</h2>
//           {tasks
//             .filter((task) => task.status === "InProgress")
//             .map((task) => (
//               <TaskCard key={task.taskId} task={task} onDrag={handleDrag} />
//             ))}
//         </div>
//         <div className="kanban-column">
//           <h2>Done</h2>
//           {tasks
//             .filter((task) => task.status === "Completed")
//             .map((task) => (
//               <TaskCard key={task.taskId} task={task} onDrag={handleDrag} />
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default KanbanBoard;
