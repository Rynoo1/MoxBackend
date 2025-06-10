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
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null)

  const [newTask, setNewTask] = useState<TaskDto>({
    title: '',
    description: '',
    priority: PriorityLevel.Low,
    status: WorkStatus.NotStarted,
    dueDate: new Date().toISOString().split('T')[0],
    isEmergency: false,
    assignedUserId: '',
    projectID: 0
  })

  const [editingTask, setEditingTask] = useState<TaskDto | null>(null)

  useEffect(() => {
    fetch('http://localhost:5183/api/Project')
      .then((res) => res.json())
      .then((data) => {
        const projectsArray = Array.isArray(data.$values) ? data.$values : []
        setProjects(projectsArray)
        if (projectsArray.length > 0) {
          setSelectedProjectId(projectsArray[0].projectID)
        }
      })
  }, [])

  useEffect(() => {
    if (!selectedProjectId) return

    fetch(`http://localhost:5183/api/Task/by-project/${selectedProjectId}`)
      .then((res) => res.json())
      .then((data) => {
        const taskArray = Array.isArray(data.$values) ? data.$values : data
        setTasks(taskArray)
      })
      .catch((err) => console.error('Error loading tasks:', err))
  }, [selectedProjectId])

  const handleFileUpload = async (taskId: number, file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(`http://localhost:5183/api/task/${taskId}/upload`, {
      method: 'POST',
      body: formData
    })

    if (!res.ok) {
      console.error('File upload failed')
      return
    }

    const data = await res.json()
    console.log('File uploaded at:', data.filePath)
  }

  const handleOpenModal = () => {
    setNewTask({
      title: '',
      description: '',
      priority: PriorityLevel.Low,
      status: WorkStatus.NotStarted,
      dueDate: new Date().toISOString().split('T')[0],
      isEmergency: false,
      assignedUserId: '',
      projectID: selectedProjectId ?? 0
    })
    setAttachmentFile(null)
    setEditingTask(null)
    setShowModal(true)
  }

  const handleOpenEditModal = (task: TaskDto) => {
    setEditingTask(task)
    setNewTask({
      ...task,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : new Date().toISOString().split('T')[0]
    })
    setAttachmentFile(null)
    setShowModal(true)
  }

  const handleSaveTask = async () => {
    if (!selectedProjectId) {
      alert('Please select a project.')
      return
    }

    try {
      const taskDto = {
        ...newTask,
        projectID: selectedProjectId,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : null
      }

      const response = editingTask
        ? await fetch(`http://localhost:5183/api/task/${editingTask.taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskDto)
          })
        : await fetch('http://localhost:5183/api/task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskDto)
          })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`HTTP ${response.status}: ${error}`)
      }

      const savedTask = await response.json()

      if (attachmentFile) {
        await handleFileUpload(savedTask.taskId, attachmentFile)
      }

      if (editingTask) {
        setTasks((prev) =>
          prev.map((task) => (task.taskId === savedTask.taskId ? savedTask : task))
        )
      } else {
        setTasks((prev) => [...prev, savedTask])
      }

      setShowModal(false)
      setEditingTask(null)
      setAttachmentFile(null)
    } catch (error) {
      console.error('Error saving task:', error)
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`http://localhost:5183/api/task/${taskId}`, {
          method: 'DELETE'
        })
        if (!response.ok) throw new Error(`Failed to delete task ${taskId}`)
        setTasks((prev) => prev.filter((t) => t.taskId !== taskId))
      } catch (err) {
        console.error(err)
        alert('Failed to delete task')
      }
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
          <button className="btn btn-primary" onClick={handleOpenModal}>
            + Add Task
          </button>
        </div>
      </header>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>

            <input
              type="text"
              className="input input-bordered w-full mb-3"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />

            <textarea
              className="textarea textarea-bordered w-full mb-3"
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />

            <select
              className="select select-bordered w-full mb-3"
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: Number(e.target.value) })}
              required
            >
              <option value="">Select Priority</option>
              <option value={PriorityLevel.Low}>Low</option>
              <option value={PriorityLevel.Medium}>Medium</option>
              <option value={PriorityLevel.High}>High</option>
              <option value={PriorityLevel.Critical}>Critical</option>
              <option value={PriorityLevel.Urgent}>Urgent</option>
            </select>

            <label className="label cursor-pointer justify-start gap-2">
              <span className="label-text">Is Emergency?</span>
              <input
                type="checkbox"
                className="toggle"
                checked={newTask.isEmergency}
                onChange={(e) => setNewTask({ ...newTask, isEmergency: e.target.checked })}
              />
            </label>

            <input
              type="date"
              className="input input-bordered w-full mb-3"
              value={newTask.dueDate || ''}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />

            <select
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: Number(e.target.value) })}
              className="select select-bordered w-full mb-3"
            >
              <option value={WorkStatus.NotStarted}>To Do</option>
              <option value={WorkStatus.InProgress}>In Progress</option>
              <option value={WorkStatus.Completed}>Done</option>
            </select>

            <input
              type="text"
              className="input input-bordered w-full mb-3"
              placeholder="Assigned User ID (optional)"
              value={newTask.assignedUserId}
              onChange={(e) => setNewTask({ ...newTask, assignedUserId: e.target.value })}
            />

            <input
              type="file"
              className="file-input file-input-bordered w-full mb-3"
              onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
            />

            <div className="flex justify-end space-x-2">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setShowModal(false)
                  setEditingTask(null)
                  setAttachmentFile(null)
                }}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveTask}>
                {editingTask ? 'Update Task' : 'Save Task'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4">
        {columns.map((column) => (
          <div key={column.status} className="card bg-base-300 p-4 rounded-box grow">
            <h2 className="text-xl font-semibold mb-4">{column.title}</h2>
            <div className="space-y-4">
              {tasks
                .filter((task) => task.status === column.status)
                .map((task) => (
                  <div
                    key={task.taskId}
                    className="card bg-base-100 p-4 rounded-md shadow cursor-pointer hover:shadow-lg"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold">{task.title}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(task)}
                          className="btn btn-xs btn-info"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.taskId!)}
                          className="btn btn-xs btn-error"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-sm">{task.description}</p>
                    <p className="text-xs mt-2">
                      Priority: <b>{PriorityLevel[task.priority]}</b> | Due:{' '}
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                    </p>
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


// IMPLEMENTS CRUD FUNCTIONALITY
// import React, { useEffect, useState } from 'react'
// import { WorkStatus, PriorityLevel } from '../../interfaces/TaskEnums'
// import { TaskDto } from '../../interfaces/Task'

// const KanbanBoard = () => {
//   const columns = [
//     { title: 'To Do', status: WorkStatus.NotStarted },
//     { title: 'In Progress', status: WorkStatus.InProgress },
//     { title: 'Done', status: WorkStatus.Completed }
//   ]

//   const [tasks, setTasks] = useState<TaskDto[]>([])
//   const [projects, setProjects] = useState<any[]>([])
//   const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
//   const [showModal, setShowModal] = useState(false)

//   // New/Edit task state
//   const [newTask, setNewTask] = useState<TaskDto>({
//     title: '',
//     description: '',
//     priority: PriorityLevel.Low,
//     status: WorkStatus.NotStarted,
//     dueDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
//     isEmergency: false,
//     assignedUserId: '',
//     projectID: 0
//   })

//   // Track if editing or creating new task
//   const [editingTask, setEditingTask] = useState<TaskDto | null>(null)

//   useEffect(() => {
//     fetch('http://localhost:5183/api/Project')
//       .then((res) => res.json())
//       .then((data) => {
//         const projectsArray = Array.isArray(data.$values) ? data.$values : []
//         setProjects(projectsArray)
//         if (projectsArray.length > 0) {
//           setSelectedProjectId(projectsArray[0].projectID)
//         }
//       })
//   }, [])

//   useEffect(() => {
//     if (!selectedProjectId) return

//     fetch(`http://localhost:5183/api/Task/by-project/${selectedProjectId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         const taskArray = Array.isArray(data.$values) ? data.$values : data
//         setTasks(taskArray)
//       })
//       .catch((err) => console.error('Error loading tasks:', err))
//   }, [selectedProjectId])

//   // Open modal for creating new task
//   const handleOpenModal = () => {
//     setNewTask({
//       title: '',
//       description: '',
//       priority: PriorityLevel.Low,
//       status: WorkStatus.NotStarted,
//       dueDate: new Date().toISOString().split('T')[0],
//       isEmergency: false,
//       assignedUserId: '',
//       projectID: selectedProjectId ?? 0
//     })
//     setEditingTask(null)
//     setShowModal(true)
//   }

//   // Open modal for editing existing task
//   const handleOpenEditModal = (task: TaskDto) => {
//     setEditingTask(task)
//     setNewTask({
//       ...task,
//       dueDate: task.dueDate ? task.dueDate.split('T')[0] : new Date().toISOString().split('T')[0],
//     })
//     setShowModal(true)
//   }

//   // Save new or edited task
//   const handleSaveTask = async () => {
//     if (!selectedProjectId) {
//       alert('Please select a project.')
//       return
//     }

//     try {
//       const taskDto = {
//         ...newTask,
//         projectID: selectedProjectId,
//         dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : null
//       }

//       const response = editingTask
//         ? await fetch(`http://localhost:5183/api/task/${editingTask.taskId}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(taskDto)
//           })
//         : await fetch('http://localhost:5183/api/task', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(taskDto)
//           })

//       if (!response.ok) {
//         const error = await response.text()
//         throw new Error(`HTTP ${response.status}: ${error}`)
//       }

//       const savedTask = await response.json()

//       if (editingTask) {
//         // Update task in list
//         setTasks((prev) =>
//           prev.map((task) => (task.taskId === savedTask.taskId ? savedTask : task))
//         )
//       } else {
//         // Add new task
//         setTasks((prev) => [...prev, savedTask])
//       }

//       setShowModal(false)
//       setEditingTask(null)
//     } catch (error) {
//       console.error('Error saving task:', error)
//     }
//   }

//   // Delete task handler
//   const handleDeleteTask = async (taskId: number) => {
//     if (window.confirm('Are you sure you want to delete this task?')) {
//       try {
//         const response = await fetch(`http://localhost:5183/api/task/${taskId}`, {
//           method: 'DELETE'
//         })
//         if (!response.ok) throw new Error(`Failed to delete task ${taskId}`)
//         setTasks((prev) => prev.filter((t) => t.taskId !== taskId))
//       } catch (err) {
//         console.error(err)
//         alert('Failed to delete task')
//       }
//     }
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       <header className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Kanban Board</h1>
//         <div className="space-x-4">
//           <select
//             className="select select-bordered"
//             value={selectedProjectId ?? ''}
//             onChange={(e) => setSelectedProjectId(Number(e.target.value))}
//           >
//             <option disabled value="">
//               Select Project
//             </option>
//             {projects.map((project) => (
//               <option key={project.projectID} value={project.projectID}>
//                 {project.projectName}
//               </option>
//             ))}
//           </select>
//           <button className="btn btn-primary" onClick={handleOpenModal}>
//             + Add Task
//           </button>
//         </div>
//       </header>

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded shadow w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">
//               {editingTask ? 'Edit Task' : 'Create New Task'}
//             </h2>

//             <input
//               type="text"
//               className="input input-bordered w-full mb-3"
//               placeholder="Task Title"
//               value={newTask.title}
//               onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
//               required
//             />

//             <textarea
//               className="textarea textarea-bordered w-full mb-3"
//               placeholder="Task Description"
//               value={newTask.description}
//               onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
//             />

//             <select
//               className="select select-bordered w-full mb-3"
//               value={newTask.priority}
//               onChange={(e) => setNewTask({ ...newTask, priority: Number(e.target.value) })}
//               required
//             >
//               <option value="">Select Priority</option>
//               <option value={PriorityLevel.Low}>Low</option>
//               <option value={PriorityLevel.Medium}>Medium</option>
//               <option value={PriorityLevel.High}>High</option>
//               <option value={PriorityLevel.Critical}>Critical</option>
//               <option value={PriorityLevel.Urgent}>Urgent</option>
//             </select>

//             <label className="label cursor-pointer justify-start gap-2">
//               <span className="label-text">Is Emergency?</span>
//               <input
//                 type="checkbox"
//                 className="toggle"
//                 checked={newTask.isEmergency}
//                 onChange={(e) => setNewTask({ ...newTask, isEmergency: e.target.checked })}
//               />
//             </label>

//             <input
//               type="date"
//               className="input input-bordered w-full mb-3"
//               value={newTask.dueDate || ''}
//               onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
//             />

//             <select
//               value={newTask.status}
//               onChange={(e) => setNewTask({ ...newTask, status: Number(e.target.value) })}
//               className="select select-bordered w-full mb-3"
//             >
//               <option value={WorkStatus.NotStarted}>To Do</option>
//               <option value={WorkStatus.InProgress}>In Progress</option>
//               <option value={WorkStatus.Completed}>Done</option>
//             </select>

//             <input
//               type="text"
//               className="input input-bordered w-full mb-3"
//               placeholder="Assigned User ID (optional)"
//               value={newTask.assignedUserId}
//               onChange={(e) => setNewTask({ ...newTask, assignedUserId: e.target.value })}
//             />

//             <div className="flex justify-end space-x-2">
//               <button
//                 className="btn btn-ghost"
//                 onClick={() => {
//                   setShowModal(false)
//                   setEditingTask(null)
//                 }}
//               >
//                 Cancel
//               </button>
//               <button className="btn btn-primary" onClick={handleSaveTask}>
//                 {editingTask ? 'Update Task' : 'Save Task'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex flex-col lg:flex-row gap-4">
//         {columns.map((column) => (
//           <div key={column.status} className="card bg-base-300 p-4 rounded-box grow">
//             <h2 className="text-xl font-semibold mb-4">{column.title}</h2>
//             <div className="space-y-4">
//               {tasks
//                 .filter((task) => task.status === column.status)
//                 .map((task) => (
//                   <div
//                     key={task.taskId}
//                     className="card bg-base-100 p-4 rounded-md shadow cursor-pointer hover:shadow-lg"
//                   >
//                     <div className="flex justify-between items-start">
//                       <h3 className="font-bold">{task.title}</h3>
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => handleOpenEditModal(task)}
//                           className="btn btn-xs btn-info"
//                           title="Edit Task"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDeleteTask(task.taskId!)}
//                           className="btn btn-xs btn-error"
//                           title="Delete Task"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                     <p className="text-sm">{task.description}</p>
//                     <p className="text-xs mt-2">
//                       Priority: <b>{PriorityLevel[task.priority]}</b> | Due:{' '}
//                       {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
//                     </p>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default KanbanBoard


//saves on db but no crud
// import React, { useEffect, useState } from 'react'
// import { WorkStatus, PriorityLevel } from '../../interfaces/TaskEnums'
// import { TaskDto } from '../../interfaces/Task'

// const KanbanBoard = () => {
//   const columns = [
//     { title: 'To Do', status: WorkStatus.NotStarted },
//     { title: 'In Progress', status: WorkStatus.InProgress },
//     { title: 'Done', status: WorkStatus.Completed }
//   ]

//   const [tasks, setTasks] = useState<TaskDto[]>([])
//   const [projects, setProjects] = useState<any[]>([])
//   const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
//   const [showModal, setShowModal] = useState(false)

//   const [newTask, setNewTask] = useState<TaskDto>({
//     title: '',
//     description: '',
//     priority: PriorityLevel.Low,
//     status: WorkStatus.NotStarted,
//     dueDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
//     isEmergency: false,
//     assignedUserId: '',
//     projectID: 0
//   })

//   useEffect(() => {
//     fetch('http://localhost:5183/api/Project')
//       .then((res) => res.json())
//       .then((data) => {
//         const projectsArray = Array.isArray(data.$values) ? data.$values : []
//         setProjects(projectsArray)
//         if (projectsArray.length > 0) {
//           setSelectedProjectId(projectsArray[0].projectID)
//         }
//       })
//   }, [])

//   useEffect(() => {
//     if (!selectedProjectId) return

//     fetch(`http://localhost:5183/api/Task/by-project/${selectedProjectId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         const taskArray = Array.isArray(data.$values) ? data.$values : data
//         setTasks(taskArray)
//       })
//       .catch((err) => console.error('Error loading tasks:', err))
//   }, [selectedProjectId])

//   const handleOpenModal = () => {
//     setNewTask({
//       title: '',
//       description: '',
//       priority: PriorityLevel.Low,
//       status: WorkStatus.NotStarted,
//       dueDate: new Date().toISOString().split('T')[0],
//       isEmergency: false,
//       assignedUserId: '',
//       projectID: selectedProjectId ?? 0
//     })
//     setShowModal(true)
//   }

//   const handleAddTask = async () => {
//     if (!selectedProjectId) {
//       alert('Please select a project.')
//       return
//     }

//     try {
//       const taskDto = {
//         ...newTask,
//         projectID: selectedProjectId,
//         dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : null
//       }

//       const response = await fetch('http://localhost:5183/api/task', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(taskDto)
//       })

//       if (!response.ok) {
//         const error = await response.text()
//         throw new Error(`HTTP ${response.status}: ${error}`)
//       }

//       const createdTask = await response.json()
//       setTasks((prev) => [...prev, createdTask])
//       setShowModal(false)
//     } catch (error) {
//       console.error('Error creating task:', error)
//     }
//   }

//   return (
//     <div className="p-6 bg-base-100 min-h-screen">
//       <header className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Kanban Board</h1>
//         <div className="space-x-4">
//           <select
//             className="select select-bordered"
//             value={selectedProjectId ?? ''}
//             onChange={(e) => setSelectedProjectId(Number(e.target.value))}
//           >
//             <option disabled value="">
//               Select Project
//             </option>
//             {projects.map((project) => (
//               <option key={project.projectID} value={project.projectID}>
//                 {project.projectName}
//               </option>
//             ))}
//           </select>
//           <button className="btn btn-primary" onClick={handleOpenModal}>
//             + Add Task
//           </button>
//         </div>
//       </header>

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded shadow w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">Create New Task</h2>

//             <input
//               type="text"
//               className="input input-bordered w-full mb-3"
//               placeholder="Task Title"
//               value={newTask.title}
//               onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
//               required
//             />

//             <textarea
//               className="textarea textarea-bordered w-full mb-3"
//               placeholder="Task Description"
//               value={newTask.description}
//               onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
//             />

//             <select
//               className="select select-bordered w-full mb-3"
//               value={newTask.priority}
//               onChange={(e) => setNewTask({ ...newTask, priority: Number(e.target.value) })}
//               required
//             >
//               <option value="">Select Priority</option>
//               <option value={PriorityLevel.Low}>Low</option>
//               <option value={PriorityLevel.Medium}>Medium</option>
//               <option value={PriorityLevel.High}>High</option>
//               <option value={PriorityLevel.Critical}>Critical</option>
//               <option value={PriorityLevel.Urgent}>Urgent</option>
//             </select>

//             <label className="label cursor-pointer justify-start gap-2">
//               <span className="label-text">Is Emergency?</span>
//               <input
//                 type="checkbox"
//                 className="toggle"
//                 checked={newTask.isEmergency}
//                 onChange={(e) => setNewTask({ ...newTask, isEmergency: e.target.checked })}
//               />
//             </label>

//             <input
//               type="date"
//               className="input input-bordered w-full mb-3"
//               value={newTask.dueDate || ''}
//               onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
//             />

//             <select
//               value={newTask.status}
//               onChange={(e) => setNewTask({ ...newTask, status: Number(e.target.value) })}
//               className="select select-bordered w-full mb-3"
//             >
//               <option value={WorkStatus.NotStarted}>To Do</option>
//               <option value={WorkStatus.InProgress}>In Progress</option>
//               <option value={WorkStatus.Completed}>Done</option>
//             </select>

//             <input
//               type="text"
//               className="input input-bordered w-full mb-3"
//               placeholder="Assigned User ID (optional)"
//               value={newTask.assignedUserId}
//               onChange={(e) => setNewTask({ ...newTask, assignedUserId: e.target.value })}
//             />

//             <div className="flex justify-end space-x-2">
//               <button className="btn btn-ghost" onClick={() => setShowModal(false)}>
//                 Cancel
//               </button>
//               <button className="btn btn-primary" onClick={handleAddTask}>
//                 Save Task
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex flex-col lg:flex-row gap-4">
//         {columns.map((column) => (
//           <div key={column.status} className="card bg-base-300 p-4 rounded-box grow">
//             <h2 className="text-xl font-semibold mb-4">{column.title}</h2>
//             <div className="space-y-4">
//               {tasks
//                 .filter((task) => task.status === column.status)
//                 .map((task) => (
//                   <div key={task.taskId} className="bg-base-100 p-4 rounded shadow">
//                     <h3 className="font-bold">{task.title}</h3>
//                     {task.description && <p className="text-sm">{task.description}</p>}
//                     <p className="text-sm">
//                       Due:{' '}
//                       {task.dueDate &&
//                         new Date(task.dueDate).toLocaleDateString(undefined, {
//                           day: '2-digit',
//                           month: 'long',
//                           year: 'numeric'
//                         })}
//                     </p>
//                     <p className="text-sm">Emergency: {task.isEmergency ? 'Yes' : 'No'}</p>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default KanbanBoard
