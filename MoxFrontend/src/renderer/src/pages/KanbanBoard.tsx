// import React, { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import '../styles/dashboard.css'

interface Project {
  projectID: number
  projectName: string
  dueDate: string
}

const Dashboard = () => {
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

  const [date, setDate] = useState<Date | undefined>()
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState<string | null>(null)
  const username = "Tebogo"

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5183/api/Project')
        if (!response.ok) throw new Error(`Error ${response.status}`)
        const data = await response.json()
        const projectsArray = Array.isArray(data.$values)
          ? data.$values
          : Array.isArray(data)
            ? data
            : []
        setProjects(projectsArray)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch projects.')
      }
    }
    fetchProjects()
  }, [])

  const upcomingProjects = projects.filter((project) => {
    const due = new Date(project.dueDate)
    return due >= new Date()
  })

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="bg-base-300 px-6 py-4 shadow-sm rounded-b-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Home</h1>
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <input type="text" placeholder="Search projects..." className="input input-bordered input-sm w-40 md:w-56" />
            <select className="select select-bordered select-sm w-28 md:w-32">
              <option>All</option>
              <option>Ongoing</option>
              <option>Completed</option>
            </select>
            <div className="avatar placeholder">
              <div className="w-10 rounded-full bg-neutral-focus text-neutral-content">
                <span>T</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Greeting */}
      {username && (
        <div className="text-center mt-6">
          <h2 className="text-3xl font-light">{getGreeting()}, {username}</h2>
        </div>
      )}

      {/* Stats */}
      <div className="stats shadow w-full overflow-x-auto mt-10 mb-10">
        <div className="stat">
          <div className="stat-title">Tasks Completed</div>
          <div className="stat-value text-primary">12</div>
          <div className="stat-desc">+21% this week</div>
        </div>
        <div className="stat">
          <div className="stat-title">Collaborators</div>
          <div className="stat-value text-secondary">4</div>
          <div className="stat-desc">+2 new this month</div>
        </div>
        <div className="stat">
          <div className="stat-title">Progress</div>
          <div className="stat-value text-primary">86%</div>
          <div className="stat-desc text-gray-500">31 tasks remaining</div>
        </div>
      </div>

      {/* Main Section */}
      <main className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 shadow rounded">
            <h3 className="text-xl font-semibold mb-2">Activity Log</h3>
            <p>Recent updates (placeholder)</p>
          </div>

          <div className="bg-white p-4 shadow rounded">
            <h3 className="text-xl font-semibold mb-2">Upcoming Deadlines</h3>
            {error && <p className="text-red-500">{error}</p>}
            {upcomingProjects.length === 0 ? (
              <p>No upcoming projects.</p>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                {upcomingProjects.slice(0, 5).map((project) => (
                  <li key={project.projectID}>
                    {project.projectName} – due {new Date(project.dueDate).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card bg-base-100 shadow-sm w-full">
            <div className="card-body">
              <h3 className="card-title">Calendar</h3>
              <DayPicker
                mode="single"
                selected={date}
                onSelect={setDate}
                className="react-day-picker"
              />
            </div>
          </div>

          <div className="card bg-white shadow rounded">
            <div className="card-body">
              <h3 className="card-title">Weekly Progress</h3>
              <div className="text-success text-3xl font-bold">67%</div>
              <progress className="progress progress-success w-full" value="67" max="100"></progress>
              <p className="text-sm text-gray-500">8 of 12 tasks done</p>
            </div>
          </div>

          <div className="stat bg-white p-4 shadow rounded">
            <div className="stat-title text-error">Emergency Tasks</div>
            <div className="stat-value text-error">3</div>
            <div className="stat-desc">Handle immediately</div>
          </div>

          <div className="stat bg-white p-4 shadow rounded">
            <div className="stat-title">Most Active Project</div>
            <div className="stat-value">Kanban UX</div>
            <div className="stat-desc">14 updates this week</div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard


//CODE  INCLUDES DUMMY TEXT & TESTING WORKS
// import React, { useEffect, useState } from "react";

// interface Task {
//   taskId: number;
//   title: string;
//   description?: string;
//   priority: string;
//   isEmergency: boolean;
//   dueDate: string;
//   completedAt?: string;
//   status: string;
//   assignedUserId?: string;
//   totalSubtasks?: number;
//   completedSubtasks?: number;
// }

// const KanbanBoard = () => {
//   const colum                      <div key={task.taskId} className="bg-base-100 rounded-box shadow p-4">
// ns = [
//     { title: "To Do", status: "NotStarted" },
//     { title: "In Progress", status: "InProgress" },
//     { title: "Done", status: "Completed" },
//   ];

//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const [newTask, setNewTask] = useState({
//     title: "",
//     priority: "1",
//     status: "NotStarted",
//   });

//   const dummyTasks: Task[] = [
//     {
//       taskId: 1,
//       title: "Create Wireframes",
//       priority: "4",
//       status: "NotStarted",
//       dueDate: "2025-06-05",
//       isEmergency: false,
//       assignedUserId: "Tebogo",
//       totalSubtasks: 3,
//       completedSubtasks: 1,
//     },
//     {
//       taskId: 2,
//       title: "Build Kanban UI",
//       priority: "3",
//       status: "InProgress",
//       dueDate: "2025-06-08",
//       isEmergency: false,
//       assignedUserId: "Tebogo",
//       totalSubtasks: 5,
//       completedSubtasks: 3,
//     },
//     {
//       taskId: 3,
//       title: "Finish Task Logic",
//       priority: "2",
//       status: "Completed",
//       dueDate: "2025-06-01",
//       isEmergency: false,
//       assignedUserId: "Tebogo",
//       totalSubtasks: 2,
//       completedSubtasks: 2,
//     },
//   ];

//   useEffect(() => {
//     fetch("http://localhost:5183/api/task")
//       .then((res) => res.json())
//       .then((data) => {
//         console.log("Fetched tasks:", data);
//         setTasks(data);
//       })
//       .catch((err) => {
//         console.error("Error fetching tasks:", err);
//         setTasks([]);
//       });
//   }, []);

//   const handleAddTask = () => {
//     console.log("New Task:", newTask);

//     const taskToAdd: Task = {
//       taskId: Date.now(),
//       title: newTask.title,
//       priority: newTask.priority,
//       status: newTask.status,
//       isEmergency: false,
//       dueDate: new Date().toISOString().split("T")[0],
//       assignedUserId: "Tebogo",
//       totalSubtasks: 3,
//       completedSubtasks: 0,
//     };

//     setTasks((prev) => [...prev, taskToAdd]);
//     setShowModal(false);
//     setNewTask({ title: "", priority: "1", status: "NotStarted" });
//   };

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       <header className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Kanban Board</h1>
//         <div className="space-x-4">
//           <button className="btn">Dark Mode</button>
//           <button className="btn btn-primary" onClick={() => setShowModal(true)}>
//             + Add Task
//           </button>
//         </div>
//       </header>

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded shadow w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">New Task</h2>
//             <input
//               type="text"
//               placeholder="Title"
//               className="input input-bordered w-full mb-3"
//               value={newTask.title}
//               onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
//             />
//             <select
//               className="select select-bordered w-full mb-3"
//               value={newTask.priority}
//               onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
//             >
//               <option value="1">Priority 1</option>
//               <option value="2">Priority 2</option>
//               <option value="3">Priority 3</option>
//               <option value="4">Priority 4</option>
//               <option value="5">Priority 5</option>
//             </select>
//             <select
//               className="select select-bordered w-full mb-3"
//               value={newTask.status}
//               onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
//             >
//               <option value="NotStarted">To Do</option>
//               <option value="InProgress">In Progress</option>
//               <option value="Completed">Done</option>
//             </select>
//             <div className="flex justify-end space-x-2">
//               <button className="btn btn-ghost" onClick={() => setShowModal(false)}>
//                 Cancel
//               </button>
//               <button className="btn btn-primary" onClick={handleAddTask}>
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Dummy Tasks Layout */}
//       <section className="mb-12">
//         <h2 className="text-lg font-semibold mb-4">Dummy Tasks</h2>
//         <div className="flex w-full flex-col lg:flex-row items-start gap-4">
//           {columns.map((column, index) => (
//             <React.Fragment key={column.status}>
//               <div className="card bg-base-300 rounded-box grow p-4 min-h-[200px]">
//                 <h2 className="text-xl font-semibold mb-4">{column.title}</h2>
//                 <div className="space-y-4">
//                   {dummyTasks
//                     .filter((task) => task.status === column.status)
//                     .map((task) => (
//                       <div key={task.taskId} className="bg-base-100 rounded-box shadow p-4">
//                         <h3 className="font-bold text-lg">{task.title}</h3>
//                         <p className="text-sm text-gray-500">
//                           Priority: {task.priority} • Due: {task.dueDate}
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           Assigned to: {task.assignedUserId || "Unassigned"}
//                         </p>
//                         <progress
//                           className="progress progress-primary w-full mt-2"
//                           value={task.completedSubtasks || (task.completedAt ? 1 : 0)}
//                           max={task.totalSubtasks || 1}
//                         ></progress>
//                         <p className="text-xs text-right text-gray-500">
//                           {task.completedSubtasks !== undefined && task.totalSubtasks !== undefined
//                             ? `${task.completedSubtasks}/${task.totalSubtasks} subtasks done`
//                             : task.completedAt
//                             ? "Complete"
//                             : "Not Started"}
//                         </p>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//               {index < columns.length - 1 && (
//                 <div className="divider lg:divider-horizontal">OR</div>
//               )}
//             </React.Fragment>
//           ))}
//         </div>
//       </section>

//       {/* API Tasks Layout */}
//       <section>
//         <h2 className="text-lg font-semibold mb-4">API Tasks</h2>
//         <div className="flex w-full flex-col lg:flex-row items-start gap-4">
//           {columns.map((column, index) => (
//             <React.Fragment key={column.status}>
//               <div className="card bg-base-300 rounded-box grow p-4 min-h-[200px]">
//                 <h2 className="text-xl font-semibold mb-4">{column.title}</h2>
//                 <div className="space-y-4">
//                   {tasks
//                     .filter((task) => task.status === column.status)
//                     .map((task) => (
//                       <div key={task.taskId} className="bg-base-100 rounded-box shadow p-4">
//                         <h3 className="font-bold text-lg">{task.title}</h3>
//                         <p className="text-sm text-gray-500">
//                           Priority: {task.priority} • Due: {task.dueDate}
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           Assigned to: {task.assignedUserId || "Unassigned"}
//                         </p>
//                         <progress
//                           className="progress progress-primary w-full mt-2"
//                           value={task.completedSubtasks || (task.completedAt ? 1 : 0)}
//                           max={task.totalSubtasks || 1}
//                         ></progress>
//                         <p className="text-xs text-right text-gray-500">
//                           {task.completedSubtasks !== undefined && task.totalSubtasks !== undefined
//                             ? `${task.completedSubtasks}/${task.totalSubtasks} subtasks done`
//                             : task.completedAt
//                             ? "Complete"
//                             : "Not Started"}
//                         </p>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//               {index < columns.length - 1 && (
//                 <div className="divider lg:divider-horizontal">OR</div>
//               )}
//             </React.Fragment>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default KanbanBoard;

// import React, { useEffect, useState } from "react";
// import TaskCard from "../components/TaskCard";

// interface Task {
//   taskId: number;
//   title: string;
//   description?: string;
//   priority: string;
//   isEmergency: boolean;
//   dueDate: string;
//   completedAt?: string;
//   status: string;
//   assignedUserId?: string;
// }

// const KanbanBoard: React.FC = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);

//   useEffect(() => {
//     fetch("http://localhost:5183/api/task")
//       .then((res) => res.json())
//       .then((data) => {
//         console.log("Fetched tasks:", data);
//         setTasks(data);
//       })
//       .catch((err) => console.error("Error fetching tasks:", err));
//   }, []);

//   const handleDrag = (taskId: number, newStatus: string) => {
//     const updatedTasks = tasks.map((task) =>
//       task.taskId === taskId ? { ...task, status: newStatus } : task
//     );
//     setTasks(updatedTasks);
//   };

//   const renderColumn = (title: string, status: string) => (
//     <div className="kanban-column">
//       <h2>{title}</h2>
//       {tasks
//         .filter((task) => task.status === status)
//         .map((task) => (
//           <TaskCard key={task.taskId} task={task} onDrag={handleDrag} />
//         ))}
//     </div>
//   );

//   return (
//     <div className="kanban-board">
//       <h1>Kanban Board</h1>
//       <div className="kanban-columns">
//         {renderColumn("To Do", "NotStarted")}
//         {renderColumn("In Progress", "InProgress")}
//         {renderColumn("Done", "Completed")}
//       </div>
//     </div>
//   );
// };

// export default KanbanBoard;

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
