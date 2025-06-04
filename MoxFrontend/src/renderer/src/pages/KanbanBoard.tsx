import React, { useEffect, useState } from 'react'
import { WorkStatus, PriorityLevel } from '../../interfaces/TaskEnums'
import { TaskDto } from '../../interfaces/Task'

const KanbanBoard = () => {
  const columns = [
    { title: 'To Do', status: WorkStatus.NotStarted },
    { title: 'In Progress', status: WorkStatus.InProgress },
    { title: 'Done', status: WorkStatus.Completed }
  ]

  const [tasks, setTasks] = useState<TaskDto[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: PriorityLevel.Low,
    status: WorkStatus.NotStarted,
    dueDate: new Date().toISOString().split('T')[0],
    isEmergency: false
  })

  useEffect(() => {
    fetch('http://localhost:5183/api/Project')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.$values)) {
          setProjects(data.$values)
          if (data.$values.length > 0) {
            setSelectedProjectId(data.$values[0].projectID)
          }
        }
      })
  }, [])

  const handleAddTask = async () => {
    if (!selectedProjectId) {
      alert('Please select a project.')
      return
    }

    try {
      const taskDto = {
        projectID: selectedProjectId,
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: newTask.status,
        dueDate: new Date(newTask.dueDate).toISOString(),
        isEmergency: newTask.isEmergency
        // assignedUserId: 'Tebogo' // <- add back if backend expects this as string
      }

      const response = await fetch('http://localhost:5183/api/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskDto)
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`HTTP ${response.status}: ${error}`)
      }

      const createdTask = await response.json()
      setTasks((prev) => [...prev, createdTask])
      setShowModal(false)
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <div className="space-x-4">
          <select
            className="select select-bordered"
            value={selectedProjectId ?? ''}
            onChange={(e) => setSelectedProjectId(Number(e.target.value))}
          >
            <option disabled value="">
              Select Project
            </option>
            {projects.map((project) => (
              <option key={project.projectID} value={project.projectID}>
                {project.projectName}
              </option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Task
          </button>
        </div>
      </header>

      {showModal && (
        <dialog id="my_modal_4" className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl relative">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            <h3 className="text-lg font-bold">Create New Task</h3>
            <div className="py-4">
              <input
                type="text"
                className="input input-bordered w-full mb-3"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
              <textarea
                className="textarea textarea-bordered w-full mb-3"
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
              <input
                type="date"
                className="input input-bordered w-full mb-3"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
              <select
                className="select select-bordered w-full mb-3"
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: Number(e.target.value) })}
              >
                <option value={0}>Low</option>
                <option value={1}>Medium</option>
                <option value={2}>High</option>
                <option value={3}>Critical</option>
              </select>
              <select
                className="select select-bordered w-full mb-3"
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: Number(e.target.value) })}
              >
                <option value={0}>To Do</option>
                <option value={1}>In Progress</option>
                <option value={2}>Done</option>
              </select>

              <label className="label cursor-pointer justify-start space-x-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={newTask.isEmergency}
                  onChange={(e) => setNewTask({ ...newTask, isEmergency: e.target.checked })}
                />
                <span className="label-text">Mark as Emergency</span>
              </label>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddTask}>
                Save
              </button>
            </div>
          </div>
        </dialog>
      )}

      <div className="flex flex-col lg:flex-row gap-4">
        {columns.map((column) => (
          <div key={column.status} className="card bg-base-300 p-4 rounded-box grow">
            <h2 className="text-xl font-semibold mb-4">{column.title}</h2>
            <div className="space-y-4">
              {tasks
                .filter((task) => task.status === column.status)
                .map((task) => (
                  <div key={task.taskId} className="bg-base-100 p-4 rounded shadow">
                    <h3 className="font-bold">{task.title}</h3>
                    {task.description && <p className="text-sm">{task.description}</p>}
                    <p className="text-sm">
                      Priority: {PriorityLevel[task.priority]} | Due: {task.dueDate.split('T')[0]}
                    </p>
                    <p className="text-sm">Emergency: {task.isEmergency ? 'Yes' : 'No'}</p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default KanbanBoard


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
