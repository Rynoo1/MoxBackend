import React, { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { WorkStatus, PriorityLevel } from '../../interfaces/TaskEnums';
import { TaskDto } from '../../interfaces/Task';

const DraggableTask = ({ task, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.taskId
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="card bg-base-100 p-4 shadow mb-2"
    >
      <div className="flex justify-between">
        <h3 className="font-bold">{task.title}</h3>
        <div className="space-x-2">
          <button onClick={() => onEdit(task)} className="btn btn-xs btn-info">Edit</button>
          <button onClick={() => onDelete(task.taskId)} className="btn btn-xs btn-error">Delete</button>
        </div>
      </div>
      <p>{task.description}</p>
      <p className="text-xs mt-2">
        Priority: <b>{PriorityLevel[task.priority]}</b> | Due:{" "}
        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
      </p>
    </div>
  );
};

const KanbanBoard = () => {
  const columns = [
    { title: 'To Do', status: WorkStatus.NotStarted },
    { title: 'In Progress', status: WorkStatus.InProgress },
    { title: 'Done', status: WorkStatus.Completed }
  ];

  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<TaskDto | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: WorkStatus.NotStarted,
    priority: PriorityLevel.Low
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const updateProgress = (taskList: TaskDto[]) => {
    const total = taskList.length;
    const done = taskList.filter((t) => t.status === WorkStatus.Completed).length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    setProgress(percent);
  };

  useEffect(() => {
    fetch('http://localhost:5183/api/Project')
      .then((res) => res.json())
      .then((data) => {
        const projectsArray = Array.isArray(data.$values) ? data.$values : [];
        setProjects(projectsArray);
        if (projectsArray.length > 0) {
          setSelectedProjectId(projectsArray[0].projectID);
        }
      });
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;

    fetch(`http://localhost:5183/api/Task/by-project/${selectedProjectId}`)
      .then((res) => res.json())
      .then((data) => {
        const taskArray = Array.isArray(data.$values) ? data.$values : data;
        setTasks(taskArray);
        updateProgress(taskArray);
      })
      .catch((err) => console.error('Error loading tasks:', err));
  }, [selectedProjectId]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTaskId(null);
    if (!over) return;

    const activeTask = tasks.find((t) => t.taskId === active.id);
    const newStatus = Number(over.id);

    if (activeTask && activeTask.status !== newStatus) {
      const updatedTask = { ...activeTask, status: newStatus };
      const updatedTasks = tasks.map((t) =>
        t.taskId === activeTask.taskId ? updatedTask : t
      );
      setTasks(updatedTasks);
      updateProgress(updatedTasks);

      fetch(`http://localhost:5183/api/task/${activeTask.taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
      }).catch(console.error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const res = await fetch(`http://localhost:5183/api/task/${taskId}`, {
          method: 'DELETE'
        });
        if (!res.ok) throw new Error('Delete failed');
        const updated = tasks.filter((t) => t.taskId !== taskId);
        setTasks(updated);
        updateProgress(updated);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleOpenAddModal = () => {
    setEditTask(null);
    setFormData({
      title: '',
      description: '',
      status: WorkStatus.NotStarted,
      priority: PriorityLevel.Low
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (task: TaskDto) => {
    setEditTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      projectID: selectedProjectId,
      dueDate: new Date().toISOString()
    };

    const url = editTask
      ? `http://localhost:5183/api/task/${editTask.taskId}`
      : `http://localhost:5183/api/task`;
    const method = editTask ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();

      const updatedTasks = editTask
        ? tasks.map((t) => (t.taskId === editTask.taskId ? result : t))
        : [...tasks, result];

      setTasks(updatedTasks);
      updateProgress(updatedTasks);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <header className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Kanban Board</h1>
          <p className="text-sm text-gray-500">Track tasks by status</p>
        </div>
        <div className="flex gap-2">
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
          <button onClick={handleOpenAddModal} className="btn btn-primary">
            + Add Task
          </button>
        </div>
      </header>

      <div className="mb-6">
        <span className="text-sm font-semibold">Progress: {progress}%</span>
        <div className="w-full bg-gray-300 rounded-full h-3 mt-1">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(e) => setActiveTaskId(Number(e.active.id))}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {columns.map((column) => {
            const columnTasks = tasks.filter((task) => task.status === column.status);
            return (
              <SortableContext
                key={column.status}
                items={columnTasks.map((t) => t.taskId)}
                strategy={verticalListSortingStrategy}
              >
                <div
                  id={String(column.status)}
                  className="card bg-base-300 p-4 rounded-box grow min-h-[300px]"
                >
                  <h2 className="text-xl font-semibold mb-4">{column.title}</h2>
                  {columnTasks.map((task) => (
                    <DraggableTask
                      key={task.taskId}
                      task={task}
                      onEdit={handleOpenEditModal}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              </SortableContext>
            );
          })}
        </div>
        <DragOverlay>
          {activeTaskId && (
            <div className="card bg-white shadow p-2 text-sm">Dragging...</div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Modal */}
      {showModal && (
        <dialog id="taskModal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {editTask ? 'Edit Task' : 'Add Task'}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                className="input input-bordered w-full"
                placeholder="Title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <select
                className="select select-bordered w-full"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: Number(e.target.value) })
                }
              >
                <option value={PriorityLevel.Low}>Low</option>
                <option value={PriorityLevel.Medium}>Medium</option>
                <option value={PriorityLevel.High}>High</option>
              </select>
              <div className="modal-action">
                <button type="submit" className="btn btn-success">
                  Save
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default KanbanBoard;



//saving files using firebase
// import React, { useEffect, useState } from 'react'
// import { WorkStatus, PriorityLevel } from '../../interfaces/TaskEnums'
// import { TaskDto } from '../../interfaces/Task'
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
// import { storage } from '../firebase'

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
//   const [attachmentFile, setAttachmentFile] = useState<File | null>(null)

//   const [newTask, setNewTask] = useState<TaskDto>({
//     title: '',
//     description: '',
//     priority: PriorityLevel.Low,
//     status: WorkStatus.NotStarted,
//     dueDate: new Date().toISOString().split('T')[0],
//     isEmergency: false,
//     assignedUserId: '',
//     projectID: 0
//   })

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

//   const uploadToFirebase = async (file: File): Promise<string> => {
//     const fileRef = ref(storage, `task-files/${Date.now()}-${file.name}`)
//     await uploadBytes(fileRef, file)
//     return await getDownloadURL(fileRef)
//   }

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

//       if (attachmentFile) {
//         const url = await uploadToFirebase(attachmentFile)
//         console.log('File uploaded to Firebase:', url)
//         // You can POST this URL to your backend or store it in the task if needed
//       }

//       if (editingTask) {
//         setTasks((prev) =>
//           prev.map((task) => (task.taskId === savedTask.taskId ? savedTask : task))
//         )
//       } else {
//         setTasks((prev) => [...prev, savedTask])
//       }

//       setShowModal(false)
//       setEditingTask(null)
//       setAttachmentFile(null)
//     } catch (error) {
//       console.error('Error saving task:', error)
//     }
//   }

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
//     setAttachmentFile(null)
//     setShowModal(true)
//   }

//   const handleOpenEditModal = (task: TaskDto) => {
//     setEditingTask(task)
//     setNewTask({
//       ...task,
//       dueDate: task.dueDate ? task.dueDate.split('T')[0] : new Date().toISOString().split('T')[0]
//     })
//     setAttachmentFile(null)
//     setShowModal(true)
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

//             <input
//               type="file"
//               className="file-input file-input-bordered w-full mb-3"
//               onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
//             />

//             <select
//               className="select select-bordered w-full mb-3"
//               value={newTask.priority}
//               onChange={(e) => setNewTask({ ...newTask, priority: Number(e.target.value) })}
//             >
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
//                   <div key={task.taskId} className="card bg-base-100 p-4 shadow">
//                     <div className="flex justify-between">
//                       <h3 className="font-bold">{task.title}</h3>
//                       <div className="space-x-2">
//                         <button onClick={() => handleOpenEditModal(task)} className="btn btn-xs btn-info">Edit</button>
//                         <button onClick={() => handleDeleteTask(task.taskId!)} className="btn btn-xs btn-error">Delete</button>
//                       </div>
//                     </div>
//                     <p>{task.description}</p>
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
