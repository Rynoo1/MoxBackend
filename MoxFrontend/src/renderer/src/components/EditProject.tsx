import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { HiPencilAlt, HiOutlineX, HiTrash, HiCheck, HiX } from 'react-icons/hi'
import './styles/Projects.css'

type User = { id: string; userName: string }
type Subtask = {
  id: number
  name: string
  description?: string
  dueDate?: string
  priority?: string
  users?: User[]
}
type Task = {
  id: number
  title: string
  description?: string
  dueDate?: string
  priority?: string
  subtasks: Subtask[]
}
type Project = { id: number; name: string; dueDate?: string; tasks: Task[] }

const priorityColor: Record<string, string> = {
  Low: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  High: 'bg-red-100 text-red-700',
  Critical: 'bg-red-200 text-red-900 font-bold'
}

const priorityMap: Record<number, string> = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
  4: 'Critical'
}
const priorityReverseMap: Record<string, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  Critical: 4
}

function toDateTimeLocal(dateString?: string) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function EditProject() {
  const location = useLocation()
  const navigate = useNavigate()
  const incoming = location.state
  const initialProject: Project = {
    id: incoming?.project?.ProjectID ?? incoming?.project?.id ?? 1,
    name: incoming?.project?.ProjectName ?? incoming?.project?.name ?? 'Sample Project',
    dueDate: incoming?.project?.ProjectDueDate ?? incoming?.project?.dueDate ?? '',
    tasks: Array.isArray(incoming?.tasks)
      ? incoming.tasks.map((task: any) => ({
          id: task.id ?? task.taskId,
          title: task.title ?? task.TaskName ?? '',
          description: task.description ?? '',
          dueDate: task.dueDate ?? '',
          priority:
            typeof task.priority === 'number' ? priorityMap[task.priority] : (task.priority ?? ''),
          subtasks: Array.isArray(task.subTasks)
            ? task.subTasks.map((sub: any) => ({
                id: sub.id ?? sub.subTaskID,
                name: sub.title ?? sub.SubtaskName ?? '',
                description: sub.description ?? '',
                dueDate: sub.dueDate ?? '',
                priority:
                  typeof sub.priority === 'number'
                    ? priorityMap[sub.priority]
                    : (sub.priority ?? ''),
                users: sub.assignedUsers?.$values || sub.assignedUsers || []
              }))
            : []
        }))
      : []
  }

  const [project, setProject] = useState<Project>(initialProject)
  const [editingProjectName, setEditingProjectName] = useState(false)
  const [projectNameInput, setProjectNameInput] = useState(project.name)
  const [projectDueDateInput, setProjectDueDateInput] = useState(toDateTimeLocal(project.dueDate))
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showSubtaskModal, setShowSubtaskModal] = useState(false)
  const [currentTask, setCurrentTask] = useState({
    name: '',
    description: '',
    dueDate: '',
    priority: ''
  })
  const [taskNameError, setTaskNameError] = useState(false)
  const [taskDueDateError, setTaskDueDateError] = useState(false)
  const [taskPriorityError, setTaskPriorityError] = useState(false)

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [editingSubtaskId, setEditingSubtaskId] = useState<number | null>(null)
  const [taskEdit, setTaskEdit] = useState<any>({})
  const [subtaskEdit, setSubtaskEdit] = useState<any>({})

  const [currentSubtask, setCurrentSubtask] = useState({
    name: '',
    description: '',
    dueDate: '',
    priority: '',
    users: [] as User[],
    userSearch: ''
  })
  const [subtaskNameError, setSubtaskNameError] = useState(false)
  const [subtaskParentTaskId, setSubtaskParentTaskId] = useState<number | null>(null)

  const [users, setUsers] = useState<User[]>([])
  useEffect(() => {
    fetch('http://localhost:5183/api/User')
      .then((res) => res.json())
      .then((data) => setUsers(data?.$values || []))
      .catch(() => setUsers([]))
  }, [])

  function deleteTask(taskId: number) {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId)
    }))
  }

  function deleteSubtask(taskId: number, subtaskId: number) {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== subtaskId) } : t
      )
    }))
  }

  function saveProjectName() {
    setProject((prev) => ({ ...prev, name: projectNameInput, dueDate: projectDueDateInput }))
    setEditingProjectName(false)
  }

  function startEditTask(task: Task) {
    setEditingTaskId(task.id)
    setTaskEdit({
      name: task.title,
      description: task.description || '',
      dueDate: task.dueDate || '',
      priority: task.priority || ''
    })
  }
  function saveEditTask(taskId: number) {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              title: taskEdit.name,
              description: taskEdit.description,
              dueDate: taskEdit.dueDate,
              priority: taskEdit.priority
            }
          : t
      )
    }))
    setEditingTaskId(null)
    setTaskEdit({})
  }

  function startEditSubtask(taskId: number, sub: Subtask) {
    setEditingSubtaskId(sub.id)
    setSubtaskEdit({
      name: sub.name,
      description: sub.description || '',
      dueDate: sub.dueDate || '',
      priority: sub.priority || '',
      users: sub.users || [],
      userSearch: ''
    })
    setSubtaskParentTaskId(taskId)
  }
  function saveEditSubtask(taskId: number, subtaskId: number) {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) =>
                s.id === subtaskId
                  ? {
                      ...s,
                      name: subtaskEdit.name,
                      description: subtaskEdit.description,
                      dueDate: subtaskEdit.dueDate,
                      priority: subtaskEdit.priority,
                      users: subtaskEdit.users
                    }
                  : s
              )
            }
          : t
      )
    }))
    setEditingSubtaskId(null)
    setSubtaskEdit({})
    setSubtaskParentTaskId(null)
    setShowSubtaskModal(false)
  }

  function openAddTaskModal() {
    setCurrentTask({ name: '', description: '', dueDate: '', priority: '' })
    setTaskNameError(false)
    setTaskDueDateError(false)
    setTaskPriorityError(false)
    setShowTaskModal(true)
  }

  function handleTaskNext() {
    let hasError = false
    if (!currentTask.name.trim()) {
      setTaskNameError(true)
      hasError = true
    }
    if (!currentTask.dueDate) {
      setTaskDueDateError(true)
      hasError = true
    }
    if (!currentTask.priority) {
      setTaskPriorityError(true)
      hasError = true
    }
    if (hasError) return

    setProject((prev: Project) => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        {
          id: 0,
          title: currentTask.name,
          description: currentTask.description,
          dueDate: currentTask.dueDate,
          priority: currentTask.priority,
          subtasks: []
        }
      ]
    }))
    setShowTaskModal(false)
    setCurrentTask({ name: '', description: '', dueDate: '', priority: '' })
  }

  function openSubtaskModal(taskId: number) {
    setCurrentSubtask({
      name: '',
      description: '',
      dueDate: '',
      priority: '',
      users: [],
      userSearch: ''
    })
    setSubtaskNameError(false)
    setSubtaskParentTaskId(taskId)
    setShowSubtaskModal(true)
  }

  function handleSubtaskNext() {
    if (!currentSubtask.name.trim()) {
      setSubtaskNameError(true)
      return
    }
    if (subtaskParentTaskId === null) return

    setProject((prev: Project) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === subtaskParentTaskId
          ? {
              ...t,
              subtasks: [
                ...t.subtasks,
                {
                  id: 0,
                  name: currentSubtask.name,
                  description: currentSubtask.description,
                  dueDate: currentSubtask.dueDate,
                  priority: currentSubtask.priority,
                  users: currentSubtask.users
                }
              ]
            }
          : t
      )
    }))
    setShowSubtaskModal(false)
    setCurrentSubtask({
      name: '',
      description: '',
      dueDate: '',
      priority: '',
      users: [],
      userSearch: ''
    })
    setSubtaskParentTaskId(null)
  }

  async function saveProject() {
    // If a subtask is being edited, save it first
    if (editingSubtaskId !== null && subtaskParentTaskId !== null) {
      saveEditSubtask(subtaskParentTaskId, editingSubtaskId)
    }

    // Wait a tick to ensure state is updated
    await new Promise((resolve) => setTimeout(resolve, 0))

    const dto = {
      ProjectID: project.id,
      ProjectName: project.name,
      DueDate: project.dueDate ? project.dueDate : null,
      Tasks: project.tasks.map((t) => ({
        TaskId: t.id,
        Title: t.title,
        Description: t.description,
        DueDate: t.dueDate,
        Priority: t.priority ? (priorityReverseMap[t.priority as string] ?? 1) : 1,
        SubTasks: t.subtasks.map((s) => ({
          Title: s.name,
          Description: s.description,
          DueDate: s.dueDate,
          Priority: s.priority ? (priorityReverseMap[s.priority as string] ?? 1) : 1,
          AssignedUserIds: Array.from(new Set((s.users || []).map((u) => u.id)))
        }))
      }))
    }

    const res = await fetch(`http://localhost:5183/api/Project/${project.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto)
    })
    if (res.ok) {
      navigate('/')
    } else {
      const text = await res.text()
      alert('Failed to save project: ' + text)
    }
  }

  async function deleteProject() {
    if (!window.confirm('Are you sure you want to delete this project and all its tasks/subtasks?'))
      return
    const res = await fetch(`http://localhost:5183/api/Project/${project.id}`, {
      method: 'DELETE'
    })
    if (res.status === 204) {
      alert('Project deleted.')
      navigate('/')
    } else {
      const text = await res.text()
      alert('Failed to delete project: ' + text)
    }
  }

  const taskModalRef = useRef<HTMLDialogElement>(null)
  const subtaskModalRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (showTaskModal) {
      taskModalRef.current?.showModal()
    } else {
      taskModalRef.current?.close()
    }
  }, [showTaskModal])
  useEffect(() => {
    if (showSubtaskModal) {
      subtaskModalRef.current?.showModal()
    } else {
      subtaskModalRef.current?.close()
    }
  }, [showSubtaskModal])
  useEffect(() => {
    setProjectDueDateInput(toDateTimeLocal(project.dueDate))
  }, [project.dueDate])

  useEffect(() => {
    if (!project || !project.tasks) return

    const fetchAssignedUsers = async () => {
      const updatedTasks = await Promise.all(
        project.tasks.map(async (task) => {
          const updatedSubtasks = await Promise.all(
            task.subtasks.map(async (sub) => {
              if (!sub.id || sub.id === 0) return sub
              const res = await fetch(`http://localhost:5183/api/SubTask/${sub.id}/users`)
              const users = res.ok ? await res.json() : []
              return {
                ...sub,
                users: Array.isArray(users.$values) ? users.$values : users
              }
            })
          )
          return { ...task, subtasks: updatedSubtasks }
        })
      )
      setProject((prev) => ({ ...prev, tasks: updatedTasks }))
    }

    fetchAssignedUsers()
  }, [])

  return (
    <div className="min-h-screen w-full mt-4 flex flex-col overflow-x-hidden overflow-y-auto scrollbar-hide bg-gray-50">
      <div
        className="w-full max-w-5xl mx-auto p-4 sm:p-6 flex-1 overflow-auto scrollbar-hide"
        style={{ maxHeight: 'calc(100vh - 4rem)' }}
      >
        <div className="mb-6 flex flex-wrap items-center gap-4 scrollbar-hide">
          {editingProjectName ? (
            <>
              <input
                className="input input-bordered input-lg text-lg !text-black"
                value={projectNameInput}
                onChange={(e) => setProjectNameInput(e.target.value)}
                autoFocus
              />
              <input
                type="datetime-local"
                className="input input-bordered input-lg text-lg !text-black"
                value={projectDueDateInput}
                onChange={(e) => setProjectDueDateInput(e.target.value)}
                style={{ minWidth: 220 }}
              />
              <button
                className="btn btn-lg btn-success text-lg text-white !shadow-md shadow-black/30"
                onClick={saveProjectName}
              >
                <HiCheck size={28} />
              </button>
              <button
                className="btn btn-lg text-lg text-white bg-red-500 hover:bg-white hover:text-black border-2 border-red-500 hover:border-red-600 !shadow-md shadow-black/30"
                onClick={() => setEditingProjectName(false)}
              >
                <HiX size={28} />
              </button>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold break-words">
                  {project.name}
                </h2>
                {project.dueDate && (
                  <div className="ml-1 mt-5 text-lg font-semibold text-xl ">
                    <span className="text-2xl sm:text-3xl font-bold"> Due: </span>
                    {new Date(project.dueDate).toLocaleString()}
                  </div>
                )}
              </div>
              <button
                className="btn btn-lg ml-4 text-lg bg-[#1e3a8a] text-white hover:bg-white hover:text-[#1e3a8a] border-2 border-[#1e3a8a] !shadow-md shadow-black/30"
                onClick={() => {
                  setEditingProjectName(true)
                  setProjectDueDateInput(toDateTimeLocal(project.dueDate))
                }}
              >
                <HiPencilAlt size={28} />
              </button>
              <button
                className="btn btn-lg btn-error ml-4 text-white bg-red-500 text-lg hover:bg-white hover:text-red-500 border-2 border-red-500 hover:border-red-500 !shadow-md shadow-black/30"
                onClick={deleteProject}
              >
                <HiTrash size={28} />
              </button>
            </>
          )}
        </div>
        <button
          className="btn btn-primary btn-lg bg-[#1e3a8a] mb-6 text-lg hover:bg-white hover:text-[#1e3a8a] border-2 border-[#1e3a8a] !shadow-md shadow-black/30 w-full sm:w-auto"
          onClick={openAddTaskModal}
        >
          Add Task
        </button>

        {/* Task Cards */}
        <div className="grid gap-8 md:grid-cols-2 items-start">
          {project.tasks.map((task) => (
            <div
              key={task.id}
              className="bg-[#1e3a8a] rounded-2xl !shadow-md shadow-black/30 border border-[#1e3a8a] p-4 sm:p-8 flex flex-col scrollbar-hide"
              style={{ height: 'auto' }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  {editingTaskId === task.id ? (
                    <div className="flex flex-col gap-2 scrollbar-hide">
                      <div className="flex gap-2">
                        <input
                          className="input input-bordered input-lg !text-black text-lg mb-2 bg-white"
                          value={taskEdit.name}
                          onChange={(e) => setTaskEdit({ ...taskEdit, name: e.target.value })}
                          autoFocus
                        />
                        <button
                          className="btn btn-md btn-success text-lg"
                          onClick={() => saveEditTask(task.id)}
                        >
                          <HiCheck size={28} />
                        </button>
                        <button
                          className="btn btn-md text-lg text-white bg-red-500 hover:bg-white hover:text-black border-2 border-red-500 hover:border-red-600"
                          onClick={() => setEditingTaskId(null)}
                        >
                          <HiX size={28} />
                        </button>
                      </div>
                      <input
                        type="datetime-local"
                        className="input input-bordered input-lg !text-black text-lg mb-2 bg-white"
                        value={toDateTimeLocal(taskEdit.dueDate)}
                        onChange={(e) => setTaskEdit({ ...taskEdit, dueDate: e.target.value })}
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold text-white">{task.title}</h1>
                      {task.dueDate && (
                        <p className="text-lg text-white mt-2">
                          Due: {new Date(task.dueDate).toLocaleString()}
                        </p>
                      )}
                    </>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {editingTaskId !== task.id && (
                    <>
                      <div className="flex flex-row gap-2 ml-2 scrollbar-hide">
                        <button
                          className="btn btn-md text-lg bg-[#6D28D9] text-white hover:bg-white hover:text-[#6D28D9] border-2 border-[#6D28D9] !shadow-md shadow-black/30"
                          onClick={() => startEditTask(task)}
                        >
                          <HiPencilAlt size={28} />
                        </button>
                        <button
                          className="btn btn-md btn-error text-lg text-white bg-red-500 hover:bg-white hover:text-red-500 border-2 border-red-500 hover:border-red-500 !shadow-md shadow-black/30"
                          onClick={() => deleteTask(task.id)}
                          title="Delete Task"
                        >
                          <HiTrash size={28} />
                        </button>
                      </div>
                      <div className="flex justify-end">
                        <button
                          className="btn btn-md text-lg bg-[#6D28D9] text-white hover:bg-white hover:text-[#6D28D9] border-2 border-[#6D28D9] !shadow-md shadow-black/30"
                          style={{ width: '8.5rem', minWidth: '3.5rem' }}
                          onClick={() => openSubtaskModal(task.id)}
                        >
                          +Subtask
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 font-bold text-xl text-white inline-block relative scrollbar-hide">
                  Description
                  <span className="block h-1 !bg-white rounded-lg mt-1" style={{ width: '100%' }} />
                </h2>
                {editingTaskId === task.id ? (
                  <textarea
                    className="textarea textarea-bordered w-full text-lg mb-2 bg-white text-black scrollbar-hide"
                    value={taskEdit.description}
                    onChange={(e) => setTaskEdit({ ...taskEdit, description: e.target.value })}
                  />
                ) : (
                  <p className="text-white text-base leading-relaxed whitespace-pre-line">
                    {task.description || 'No description provided.'}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-white mb-6">
                <div>
                  <span className="block text-white font-semibold text-xl text-sm mb-2">
                    Priority
                  </span>
                  {editingTaskId === task.id ? (
                    <select
                      className="select select-bordered w-full bg-white text-black"
                      value={taskEdit.priority}
                      onChange={(e) => setTaskEdit({ ...taskEdit, priority: e.target.value })}
                    >
                      <option value="">Priority</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-block px-4 py-2 rounded-lg text-base font-medium ${priorityColor[task.priority as keyof typeof priorityColor] || ''}`}
                    >
                      {task.priority}
                    </span>
                  )}
                </div>
                <div>
                  <span className="block text-white text-xl font-semibold text-sm mb-2">Users</span>
                  <span className="text-base">
                    {task.subtasks
                      .flatMap((sub) => sub.users || [])
                      .reduce<User[]>((acc, user) => {
                        if (!acc.some((u) => u.id === user.id)) acc.push(user)
                        return acc
                      }, []).length > 0 ? (
                      <ul className="list-disc list-inside">
                        {task.subtasks
                          .flatMap((sub) => sub.users || [])
                          .reduce<User[]>((acc, user) => {
                            if (!acc.some((u) => u.id === user.id)) acc.push(user)
                            return acc
                          }, [])
                          .map((user) => (
                            <li key={user.id}>{user.userName}</li>
                          ))}
                      </ul>
                    ) : (
                      <span>—</span>
                    )}
                  </span>
                </div>
              </div>
              {/* Subtasks as cards */}
              {task.subtasks.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-2xl font-bold text-white mb-2 ml-1 inline-block relative">
                    Subtasks
                    <span
                      className="block h-1 !bg-white rounded-lg mb-1"
                      style={{ width: '100%' }}
                    />
                  </h3>
                  <div className="grid gap-6">
                    {task.subtasks.map((sub) =>
                      editingSubtaskId === sub.id && subtaskParentTaskId === task.id ? (
                        <div
                          key={sub.id}
                          className="bg-[#6D28D9] rounded-xl shadow border border-[#233876] p-6 flex flex-col"
                        >
                          <input
                            className="input input-bordered input-lg text-lg !bg-white !text-black mb-2"
                            value={subtaskEdit.name}
                            onChange={(e) =>
                              setSubtaskEdit({ ...subtaskEdit, name: e.target.value })
                            }
                            autoFocus
                          />
                          <textarea
                            className="textarea textarea-bordered w-full text-lg !bg-white text-black mb-2"
                            value={subtaskEdit.description}
                            onChange={(e) =>
                              setSubtaskEdit({ ...subtaskEdit, description: e.target.value })
                            }
                          />
                          <input
                            type="datetime-local"
                            className="input input-bordered input-lg text-lg !bg-white !text-black mb-2"
                            value={toDateTimeLocal(subtaskEdit.dueDate)}
                            onChange={(e) =>
                              setSubtaskEdit({ ...subtaskEdit, dueDate: e.target.value })
                            }
                          />
                          <select
                            className="select select-bordered w-full text-lg !bg-white text-black mb-2"
                            value={subtaskEdit.priority}
                            onChange={(e) =>
                              setSubtaskEdit({ ...subtaskEdit, priority: e.target.value })
                            }
                          >
                            <option value="">Priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                          </select>
                          {/* Users edit UI */}
                          <label className="block mb-2 font-semibold text-lg text-white">
                            Assign users
                          </label>
                          <div className="mb-3">
                            <input
                              type="text"
                              className="input input-bordered w-full text-lg !bg-white font-semibold placeholder-black text-black"
                              placeholder="Type to search users..."
                              value={subtaskEdit.userSearch || ''}
                              onChange={(e) =>
                                setSubtaskEdit({ ...subtaskEdit, userSearch: e.target.value })
                              }
                            />
                            {subtaskEdit.userSearch && (
                              <div className="bg-white border rounded shadow w-full mt-1 max-h-48 overflow-auto scrollbar-hide z-40">
                                {users
                                  .filter(
                                    (u) =>
                                      u.userName
                                        .toLowerCase()
                                        .includes(subtaskEdit.userSearch.toLowerCase()) &&
                                      !(subtaskEdit.users || []).some(
                                        (sel: User) => sel.id === u.id
                                      )
                                  )
                                  .map((user) => (
                                    <div
                                      key={user.id}
                                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() => {
                                        if (
                                          !(subtaskEdit.users || []).some((u) => u.id === user.id)
                                        ) {
                                          setSubtaskEdit({
                                            ...subtaskEdit,
                                            users: [...(subtaskEdit.users || []), user],
                                            userSearch: ''
                                          })
                                        }
                                      }}
                                    >
                                      {user.userName}
                                    </div>
                                  ))}
                                {users.filter(
                                  (u) =>
                                    u.userName
                                      .toLowerCase()
                                      .includes(subtaskEdit.userSearch.toLowerCase()) &&
                                    !(subtaskEdit.users || []).some((sel: User) => sel.id === u.id)
                                ).length === 0 && (
                                  <div className="px-3 py-2 text-gray-400">No users found</div>
                                )}
                              </div>
                            )}
                            <div className="flex flex-wrap gap-2 mt-2">
                              {(subtaskEdit.users || []).map((user: User) => (
                                <span
                                  key={user.id}
                                  className="badge badge-primary gap-2 flex items-center"
                                >
                                  {user.userName}
                                  <button
                                    type="button"
                                    className="ml-1 text-white bg-red-500 rounded-full px-2"
                                    onClick={() => {
                                      setSubtaskEdit({
                                        ...subtaskEdit,
                                        users: (subtaskEdit.users || []).filter(
                                          (u: User) => u.id !== user.id
                                        )
                                      })
                                    }}
                                  >
                                    <HiOutlineX />
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button
                              className="btn btn-md btn-success text-lg"
                              onClick={() => saveEditSubtask(task.id, sub.id)}
                            >
                              <HiCheck />
                            </button>
                            <button
                              className="btn btn-md text-lg"
                              onClick={() => setEditingSubtaskId(null)}
                            >
                              <HiX size={28} />
                            </button>
                            <button
                              className="btn btn-md btn-error text-lg"
                              onClick={() => deleteSubtask(task.id, sub.id)}
                              title="Delete Subtask"
                            >
                              <HiTrash />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={sub.id}
                          className="bg-[#6D28D9] rounded-2xl !shadow-md shadow-black/30 border border-[#1e3a8a] p-4 flex flex-col"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <span className="text-2xl font-bold text-white">{sub.name}</span>
                              {sub.dueDate && (
                                <span className="block text-sm text-white mt-2">
                                  Due: {new Date(sub.dueDate).toLocaleString()}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                className="btn btn-s ml-2 text-lg bg-[#1e3a8a] text-white hover:bg-white hover:text-[#1e3a8a] border-2 border-[#1e3a8a] !shadow-md shadow-black/30"
                                onClick={() => {
                                  setEditingSubtaskId(sub.id)
                                  setSubtaskEdit({
                                    name: sub.name,
                                    description: sub.description || '',
                                    dueDate: sub.dueDate || '',
                                    priority: sub.priority || '',
                                    users: sub.users || [],
                                    userSearch: ''
                                  })
                                  setSubtaskParentTaskId(task.id)
                                }}
                              >
                                <HiPencilAlt size={28} />
                              </button>
                              <button
                                className="btn btn-s btn-error text-lg text-white bg-red-500 hover:bg-white hover:text-red-500 border-2 border-red-500 hover:border-red-500 !shadow-md shadow-black/30"
                                onClick={() => deleteSubtask(task.id, sub.id)}
                                title="Delete Subtask"
                              >
                                <HiTrash size={28} />
                              </button>
                            </div>
                          </div>
                          <div className="mb-2">
                            <span className="block text-white mt-1 text-xl font-semibold text-base mb-1 inline-block relative">
                              Description:
                              <span
                                className="block h-1 !bg-white rounded-lg mt-1"
                                style={{ width: '100%' }}
                              />
                            </span>
                            <p className="text-white text-sm mt-2 whitespace-pre-line">
                              {sub.description || 'No description provided.'}
                            </p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
                            <div>
                              <span className="block text-xl mt-2 text-white font-semibold text-sm mb-1">
                                Priority
                              </span>
                              <span
                                className={`inline-block mt-1 px-3 py-1 rounded-lg text-sm font-medium ${priorityColor[sub.priority as keyof typeof priorityColor] || ''}`}
                              >
                                {sub.priority}
                              </span>
                            </div>
                            <div>
                              <span className="block text-xl mt-2 text-white font-semibold text-sm mb-1">
                                Users
                              </span>
                              {sub.users && sub.users.length > 0 ? (
                                <ul className="list-disc mt-2 list-inside text-sm">
                                  {sub.users.map((u) => (
                                    <li key={u.id}>{u.userName}</li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-sm">—</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="btn btn-success mt-10 w-full text-lg py-4" onClick={saveProject}>
          Save Project
        </button>
      </div>

      {/* DaisyUI Add Task Modal */}
      <dialog ref={taskModalRef} id="add_task_modal" className="modal">
        <div className="modal-box bg-[#EDF2F7] w-full max-w-lg">
          <form method="dialog">
            <button
              className="btn btn-sm btn-square btn-ghost border-2 text-center border-red-500 bg-red-500 hover:bg-white hover:text-red-500 font-light absolute right-2 top-2"
              style={{ fontSize: 30 }}
              onClick={() => setShowTaskModal(false)}
            >
              <HiOutlineX />
            </button>
          </form>
          <h2 className="text-center text-black font-bold text-3xl mb-8">Add Task</h2>
          <input
            placeholder="Task name"
            value={currentTask.name}
            onChange={(e) => {
              setCurrentTask({ ...currentTask, name: e.target.value })
              if (taskNameError) setTaskNameError(false)
            }}
            className={`input input-bordered w-full my-3 text-lg placeholder-black bg-white text-black ${taskNameError ? 'input-error placeholder-error' : ''}`}
          />
          <textarea
            placeholder="Task description"
            value={currentTask.description}
            onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
            className="textarea textarea-bordered w-full my-3 text-lg placeholder-black bg-white text-black"
          />
          <input
            type="datetime-local"
            value={currentTask.dueDate}
            onChange={(e) => {
              setCurrentTask({ ...currentTask, dueDate: e.target.value })
              if (taskDueDateError) setTaskDueDateError(false)
            }}
            className={`input input-bordered w-full my-3 text-lg placeholder-black bg-white text-black ${taskDueDateError ? 'input-error placeholder-error' : ''}`}
          />
          <select
            value={currentTask.priority}
            onChange={(e) => {
              setCurrentTask({ ...currentTask, priority: e.target.value })
              if (taskPriorityError) setTaskPriorityError(false)
            }}
            className={`select select-bordered w-full my-3 text-lg placeholder-black bg-white text-black ${taskPriorityError ? 'input-error placeholder-error' : ''}`}
          >
            <option value="">Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          <div className="flex justify-between mt-6">
            <button
              className="btn text-lg text-white border-2 border-white bg-[#6D28D9] hover:bg-white hover:border-[#6D28D9] hover:text-[#1E3A8A] shadow-none px-6"
              type="button"
              onClick={() => setShowTaskModal(false)}
            >
              Back
            </button>
            <button
              className="btn text-lg text-white border-2 border-white bg-[#1E3A8A] hover:bg-white hover:border-[#1E3A8A] hover:text-[#1E3A8A] shadow-none px-6"
              type="button"
              onClick={handleTaskNext}
            >
              Save
            </button>
          </div>
        </div>
      </dialog>

      {/* DaisyUI Add Subtask Modal */}
      <dialog ref={subtaskModalRef} id="add_subtask_modal" className="modal">
        <div className="modal-box bg-[#EDF2F7] w-full max-w-lg">
          <form method="dialog">
            <button
              className="btn btn-sm btn-square btn-ghost border-2 text-center border-red-500 bg-red-500 hover:bg-white hover:text-red-500 font-light absolute right-2 top-2"
              style={{ fontSize: 30 }}
              onClick={() => setShowSubtaskModal(false)}
            >
              <HiOutlineX />
            </button>
          </form>
          <h2 className="text-center text-black font-bold text-3xl mb-8">Add Subtask</h2>
          <input
            placeholder="Subtask name"
            value={currentSubtask.name}
            onChange={(e) => {
              setCurrentSubtask({ ...currentSubtask, name: e.target.value })
              if (subtaskNameError) setSubtaskNameError(false)
            }}
            className={`input input-bordered w-full my-3 text-lg placeholder-black bg-white text-black ${subtaskNameError ? 'input-error placeholder-error' : ''}`}
          />
          <textarea
            placeholder="Subtask description"
            value={currentSubtask.description}
            onChange={(e) => setCurrentSubtask({ ...currentSubtask, description: e.target.value })}
            className="textarea textarea-bordered w-full my-3 text-lg placeholder-black bg-white text-black"
          />
          <input
            type="datetime-local"
            value={currentSubtask.dueDate || ''}
            onChange={(e) => setCurrentSubtask({ ...currentSubtask, dueDate: e.target.value })}
            className="input input-bordered w-full my-3 text-lg placeholder-black bg-white text-black"
            placeholder="Due date"
          />
          <select
            value={currentSubtask.priority || ''}
            onChange={(e) => setCurrentSubtask({ ...currentSubtask, priority: e.target.value })}
            className="select select-bordered w-full my-3 text-lg placeholder-black bg-white text-black"
          >
            <option value="">Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          <label className="block mb-2 font-semibold text-lg">Assign users</label>
          <div className="mb-3">
            <input
              type="text"
              className="input input-bordered w-full text-lg bg-white text-black"
              placeholder="Type to search users..."
              value={currentSubtask.userSearch}
              onChange={(e) => setCurrentSubtask({ ...currentSubtask, userSearch: e.target.value })}
            />
            {currentSubtask.userSearch && (
              <div className="bg-white border rounded shadow w-full mt-1 max-h-48 overflow-auto scrollbar-hide z-40">
                {users
                  .filter(
                    (u) =>
                      u.userName.toLowerCase().includes(currentSubtask.userSearch.toLowerCase()) &&
                      !(currentSubtask.users || []).some((sel) => sel.id === u.id)
                  )
                  .map((user) => (
                    <div
                      key={user.id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        // Prevent duplicate user assignment
                        if (!(currentSubtask.users || []).some((u) => u.id === user.id)) {
                          setCurrentSubtask({
                            ...currentSubtask,
                            users: [...(currentSubtask.users || []), user],
                            userSearch: ''
                          })
                        }
                      }}
                    >
                      {user.userName}
                    </div>
                  ))}
                {users.filter(
                  (u) =>
                    u.userName.toLowerCase().includes(currentSubtask.userSearch.toLowerCase()) &&
                    !(currentSubtask.users || []).some((sel) => sel.id === u.id)
                ).length === 0 && <div className="px-3 py-2 text-gray-400">No users found</div>}
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {(currentSubtask.users || []).map((user) => (
                <span key={user.id} className="badge badge-primary gap-2 flex items-center">
                  {user.userName}
                  <button
                    type="button"
                    className="ml-1 text-white bg-red-500 rounded-full px-2"
                    onClick={() => {
                      setCurrentSubtask({
                        ...currentSubtask,
                        users: (currentSubtask.users || []).filter((u) => u.id !== user.id)
                      })
                    }}
                  >
                    <HiOutlineX />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button
              className="btn text-lg text-white border-2 border-white bg-[#6D28D9] hover:bg-white hover:border-[#6D28D9] hover:text-[#1E3A8A] shadow-none px-6"
              type="button"
              onClick={() => setShowSubtaskModal(false)}
            >
              Back
            </button>
            <button
              className="btn text-lg text-white border-2 border-white bg-[#1E3A8A] hover:bg-white hover:border-[#1E3A8A] hover:text-[#1E3A8A] shadow-none px-6"
              type="button"
              onClick={handleSubtaskNext}
            >
              Save
            </button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
