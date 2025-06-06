import React, { useState, useEffect } from 'react'
import '../components/styles/Projectcard.css'
import { HiTrash } from 'react-icons/hi'

type User = { id: number; userName: string; profilePicUrl: string }
type Subtask = {
  name: string
  description: string
  dueDate?: string
  priority?: string
  users?: User[]
}
type Task = {
  name: string
  description: string
  dueDate: string
  priority: string
  subtasks: Subtask[]
}

interface CreateProjectProps {
  onClose?: () => void
}

const priorityColor: Record<string, string> = {
  Low: 'bg-green-200 text-green-800',
  Normal: 'bg-yellow-200 text-yellow-800',
  High: 'bg-orange-200 text-orange-800',
  Critical: 'bg-red-500 text-white'
}

const priorityMap: Record<string, number> = {
  Low: 1,
  Normal: 2,
  High: 3,
  Critical: 4
}

const CreateProject: React.FC<CreateProjectProps> = ({ onClose }) => {
  const [step, setStep] = useState(1)
  const [projectName, setProjectName] = useState('')
  const [projectDueDate, setProjectDueDate] = useState('')
  const [projectNameError, setProjectNameError] = useState(false)
  const [projectDueDateError, setProjectDueDateError] = useState(false)
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | null>(null)
  const [taskNameError, setTaskNameError] = useState(false)
  const [taskDueDateError, setTaskDueDateError] = useState(false)
  const [taskPriorityError, setTaskPriorityError] = useState(false)
  const [subtaskNameError, setSubtaskNameError] = useState(false)
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [subtaskDueDateError, setSubtaskDueDateError] = useState(false)
  const [subtaskPriorityError, setSubtaskPriorityError] = useState(false)

  const [currentTask, setCurrentTask] = useState<Task>({
    name: '',
    description: '',
    dueDate: '',
    priority: '',
    subtasks: []
  })
  const [currentSubtask, setCurrentSubtask] = useState<Subtask>({
    name: '',
    description: '',
    dueDate: '',
    priority: '',
    users: []
  })
  const [userSearch, setUserSearch] = useState('')

  useEffect(() => {
    fetch('http://localhost:5183/api/User')
      .then((res) => res.json())
      .then((data) => setAllUsers(data.$values || data))
      .catch(() => setAllUsers([]))
  }, [])

  const next = () => setStep((s) => s + 1)
  const back = () => setStep((s) => s - 1)

  const handleProjectNext = () => {
    let hasError = false
    if (!projectName) {
      setProjectNameError(true)
      hasError = true
    }
    if (!projectDueDate) {
      setProjectDueDateError(true)
      hasError = true
    }
    if (!hasError) {
      setProjectNameError(false)
      setProjectDueDateError(false)
      next()
    }
  }

  const handleTaskNext = () => {
    let hasError = false
    if (!currentTask.name) {
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
    if (!hasError) {
      setTaskNameError(false)
      setTaskDueDateError(false)
      setTaskPriorityError(false)
      const newTasks = [...tasks, currentTask]
      setTasks(newTasks)
      setEditingTaskIndex(newTasks.length - 1)
      setCurrentTask({
        name: '',
        description: '',
        dueDate: '',
        priority: '',
        subtasks: []
      })
      setStep(4)
    }
  }

  const handleSubtaskNext = () => {
    let hasError = false
    if (!currentSubtask.name) {
      setSubtaskNameError(true)
      hasError = true
    }
    if (!currentSubtask.dueDate) {
      setSubtaskDueDateError(true)
      hasError = true
    } else {
      setSubtaskDueDateError(false)
    }
    if (!currentSubtask.priority) {
      setSubtaskPriorityError(true)
      hasError = true
    } else {
      setSubtaskPriorityError(false)
    }
    if (hasError) return
    setSubtaskNameError(false)
    if (editingTaskIndex === null) return
    const updatedTasks = [...tasks]
    const updatedTask = {
      ...updatedTasks[editingTaskIndex],
      subtasks: [...updatedTasks[editingTaskIndex].subtasks, currentSubtask]
    }
    updatedTasks[editingTaskIndex] = updatedTask
    setTasks(updatedTasks)
    setCurrentTask(updatedTask)
    setCurrentSubtask({ name: '', description: '', dueDate: '', priority: '', users: [] })
    setUserSearch('')
    setStep(4)
  }

  const handleAddTaskToList = () => {
    setCurrentTask({
      name: '',
      description: '',
      dueDate: '',
      priority: '',
      subtasks: []
    })
    setEditingTaskIndex(tasks.length)
    setStep(3)
  }

  const handleSubmit = async () => {
    const projectPayload = {
      ProjectName: projectName,
      DueDate: projectDueDate,
      Tasks: tasks.map((task) => ({
        Title: task.name,
        Description: task.description,
        Priority: priorityMap[task.priority] ?? 2, // <-- integer
        DueDate: task.dueDate,
        SubTasks: task.subtasks.map((subtask) => ({
          Title: subtask.name,
          Description: subtask.description,
          Priority: priorityMap[subtask.priority || 'Normal'] ?? 2, // <-- integer
          DueDate: subtask.dueDate || task.dueDate,
          AssignedUserIds: subtask.users ? subtask.users.map((u) => u.id) : []
        }))
      }))
    }

    try {
      const response = await fetch('http://localhost:5183/api/Project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectPayload)
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error('Failed to create project: ' + errorText)
      }
      alert('Project created!\n\n' + JSON.stringify(projectPayload, null, 2))
      setProjectName('')
      setProjectDueDate('')
      setTasks([])
      setCurrentTask({ name: '', description: '', dueDate: '', priority: '', subtasks: [] })
      setCurrentSubtask({ name: '', description: '', dueDate: '', priority: '', users: [] })
      setProjectNameError(false)
      setProjectDueDateError(false)
      setStep(1)
      if (onClose) onClose()
    } catch (error) {
      alert('Error: ' + (error as Error).message)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 ">
      {step === 1 && (
        <>
          <h1 className="text-center text-black font-bold text-2xl mb-6">New Project</h1>
          <input
            className={`input input-bordered w-full my-2 text-black placeholder-black ${projectNameError ? 'input-error placeholder-error' : ''}`}
            placeholder="Project name"
            value={projectName}
            onChange={(e) => {
              setProjectName(e.target.value)
              if (projectNameError) setProjectNameError(false)
            }}
          />
          <input
            type="datetime-local"
            className={`input input-bordered w-full my-2 !text-black placeholder-black ${projectDueDateError ? 'input-error placeholder-error' : ''}`}
            value={projectDueDate}
            onChange={(e) => {
              setProjectDueDate(e.target.value)
              if (projectDueDateError) setProjectDueDateError(false)
            }}
            placeholder="Due date and time"
          />
          <div className="flex justify-between mt-4">
            <button
              className="btn text-white border-2 border-white bg-[#6D28D9] hover:bg-white hover:border-[#6D28D9] hover:text-[#1E3A8A] shadow-none"
              onClick={() => {
                if (step === 1 && onClose) onClose()
                else back()
              }}
            >
              Back
            </button>
            <button
              className="btn text-white border-2 border-white bg-[#1E3A8A] hover:bg-white hover:border-[#1E3A8A] hover:text-[#1E3A8A] shadow-none"
              onClick={handleProjectNext}
            >
              Next
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="text-center text-black font-bold text-2xl mb-6">Add Tasks</h1>
          <div className="mb-4">
            {tasks.length === 0 ? (
              <div className="w-full bg-gray-200 rounded-full px-4 py-2 mb-2 text-gray-500 text-center select-none">
                No tasks have been added yet
              </div>
            ) : (
              <ul className="mb-2">
                {tasks.map((task, idx) => (
                  <li
                    key={idx}
                    className="bg-gray-100 rounded px-4 py-2 mb-2 text-black flex flex-col"
                  >
                    <span className="font-semibold bg-[#1E3A8A] text-white rounded-t-lg px-2 py-1 text-center border-b-2 border-[#e0e0e9] ">
                      <span className="flex items-center w-full justify-center relative">
                        <span
                          className="mx-auto cursor-pointer hover:underline"
                          onClick={() => {
                            setCurrentTask(task)
                            setEditingTaskIndex(idx)
                            setStep(4)
                          }}
                        >
                          {task.name}
                        </span>
                        <button
                          className="absolute right-0 ml-2 px-1 py-0.5 bg-[#1e3a8a] text-white rounded border-1 border-[#1e3a8a] hover:text-red-500 text-s flex items-center !shadow-md !shadow-black/30"
                          style={{ fontWeight: 350 }}
                          onClick={() => {
                            setTasks(tasks.filter((_, tIdx) => tIdx !== idx))
                          }}
                          type="button"
                        >
                          <HiTrash />
                        </button>
                      </span>
                    </span>
                    <div className=" p-3 bg-white rounded-b-lg !shadow-lg !shadow-black/20">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 mb-1">
                          <span className="block text-m font-semibold mb-1">
                            <span>Description:</span>
                          </span>
                          <span className="block px-1 text-xs text-gray-800">
                            {task.description}
                          </span>
                        </div>
                        <div className="flex flex-col items-end ml-4 min-w-[180px] ">
                          <div className="flex flex-col text-black mb-1 shadow-md rounded px-6 py-1 bg-white">
                            <span className="mb-5">
                              <span className="font-semibold text-m">Due:</span>{' '}
                              <span className="text-xs">{task.dueDate}</span>
                            </span>
                            <span>
                              <span className="font-semibold">Priority:</span>{' '}
                              <span
                                className={`inline-block px-4 py-2 rounded-lg text-base font-medium ${priorityColor[task.priority] || ''}`}
                              >
                                {task.priority || 'None'}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex justify-center text-center items-end mt-2">
                        {task.subtasks.length > 0 ? (
                          <div className="text-xs text-black text-center">
                            <span className="font-semibold text-black">Subtasks:</span>{' '}
                            {task.subtasks.length}
                          </div>
                        ) : (
                          <div className="text-xs text-black italic text-center">
                            No subtasks added yet
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button
              className="btn ml-4 border-2 border-[#1e3a8a] bg-[#1E3A8A] text-white rounded-lg px-3 py-1.5 font-semibold hover:bg-white hover:text-[#1e3a8a] shadow-none h-7 min-h-0"
              onClick={handleAddTaskToList}
              type="button"
            >
              ADD
            </button>
          </div>
          <div className="flex justify-between items-center mt-8">
            <button
              className="text-blue-700 underline ml-5 text-xs bg-transparent border-none shadow-none"
              onClick={() => setStep(6)}
              type="button"
            >
              Skip
            </button>
            <div className="flex gap-1">
              <button
                className="btn text-white border-2 border-white bg-[#6D28D9] hover:bg-white hover:border-[#6D28D9] hover:text-[#1E3A8A] shadow-none"
                onClick={() => setStep(1)}
                type="button"
              >
                Back
              </button>
              {tasks.length > 0 ? (
                <button
                  className="btn text-white border-2 border-white bg-[#1E3A8A] hover:bg-white hover:border-[#1E3A8A] hover:text-[#1E3A8A] shadow-none"
                  onClick={() => setStep(6)}
                  type="button"
                >
                  Review Project
                </button>
              ) : (
                <button
                  className="btn text-white border-2 border-white bg-[#1E3A8A] hover:bg-white hover:border-[#1E3A8A] hover:text-[#1E3A8A] shadow-none"
                  onClick={next}
                  type="button"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="text-center text-black font-bold text-2xl mb-6">Add Task</h2>
          <input
            placeholder="Task name"
            value={currentTask.name}
            onChange={(e) => {
              setCurrentTask({ ...currentTask, name: e.target.value })
              if (taskNameError) setTaskNameError(false)
            }}
            className={`input input-bordered w-full my-2 text-black placeholder-black ${taskNameError ? 'input-error placeholder-error' : ''}`}
          />
          <textarea
            placeholder="Task description"
            value={currentTask.description}
            onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
            className="textarea textarea-bordered w-full my-2 text-black placeholder-black"
          />
          <input
            type="datetime-local"
            value={currentTask.dueDate}
            onChange={(e) => {
              setCurrentTask({ ...currentTask, dueDate: e.target.value })
              if (taskDueDateError) setTaskDueDateError(false)
            }}
            className={`input input-bordered w-full my-2 text-black placeholder-black ${taskDueDateError ? 'input-error placeholder-error' : ''}`}
          />
          <select
            value={currentTask.priority}
            onChange={(e) => {
              setCurrentTask({ ...currentTask, priority: e.target.value })
              if (taskPriorityError) setTaskPriorityError(false)
            }}
            className={`select select-bordered w-full my-2 text-black placeholder-black ${taskPriorityError ? 'input-error placeholder-error' : ''}`}
          >
            <option value="">Priority</option>
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          <div className="flex justify-between mt-4">
            <button
              className="btn text-white border-2 border-white bg-[#6D28D9] hover:bg-white hover:border-[#6D28D9] hover:text-[#1E3A8A] shadow-none"
              onClick={back}
            >
              Back
            </button>
            <button
              className="btn text-white border-2 border-white bg-[#1E3A8A] hover:bg-white hover:border-[#1E3A8A] hover:text-[#1E3A8A] shadow-none"
              onClick={handleTaskNext}
            >
              Next
            </button>
          </div>
        </>
      )}

      {step === 4 && editingTaskIndex !== null && (
        <>
          <h1 className="text-center text-black font-bold text-2xl mb-6">Add Subtasks</h1>
          <h2 className="ml-4 text-black font-bold text-xl mb-1">
            {tasks[editingTaskIndex]?.name || 'Unnamed Task'}
          </h2>
          <div className="mb-4">
            {tasks[editingTaskIndex]?.subtasks.length === 0 ? (
              <div className="w-full bg-gray-200 rounded-full px-4 py-2 mb-2 text-gray-500 text-center select-none">
                No subtasks have been added yet
              </div>
            ) : (
              <ul className="mb-2">
                {tasks[editingTaskIndex].subtasks.map((subtask, idx) => (
                  <li
                    key={idx}
                    className="bg-gray-100 rounded px-4 py-2 mb-2 text-black flex flex-col"
                  >
                    <span className="font-semibold bg-[#1E3A8A] text-white rounded-t-lg px-2 py-1 text-center border-b-2 border-[#e0e0e9] ">
                      <span className="flex items-center w-full justify-center relative">
                        <span className="mx-auto">{subtask.name}</span>
                        <button
                          className="absolute right-0 ml-2 px-1 py-0.5 bg-[#1e3a8a] text-white rounded border-1 border-[#1e3a8a] hover:text-red-500 text-s flex items-center !shadow-md !shadow-black/30"
                          style={{ fontWeight: 350 }}
                          onClick={() => {
                            if (editingTaskIndex === null) return
                            const updatedTasks = [...tasks]
                            const updatedTask = {
                              ...updatedTasks[editingTaskIndex],
                              subtasks: updatedTasks[editingTaskIndex].subtasks.filter(
                                (_, sIdx) => sIdx !== idx
                              )
                            }
                            updatedTasks[editingTaskIndex] = updatedTask
                            setTasks(updatedTasks)
                          }}
                          type="button"
                        >
                          <HiTrash />
                        </button>
                      </span>
                    </span>
                    <div className="p-3 bg-white rounded-b-lg !shadow-lg !shadow-black/20">
                      <span className="block text-m font-semibold mb-1">Description:</span>
                      <span className="block px-1 text-xs text-gray-800">
                        {subtask.description}
                        <span className="block mt-2">
                          Priority:{' '}
                          <span
                            className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${priorityColor[subtask.priority || ''] || ''}`}
                          >
                            {subtask.priority || 'None'}
                          </span>
                        </span>
                        {subtask.users && subtask.users.length > 0 && (
                          <div className="flex gap-2 mt-1">
                            {subtask.users.map((user) => (
                              <div key={user.id} className="relative group">
                                <img
                                  src={user.profilePicUrl}
                                  alt={user.userName}
                                  className="w-8 h-8 rounded-full border-2 border-white shadow"
                                />
                                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap">
                                  {user.userName}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button
              className="btn ml-4 border-2 border-[#1e3a8a] bg-[#1E3A8A] text-white rounded-lg px-3 py-1.5 font-semibold hover:bg-white hover:text-[#1e3a8a] shadow-none h-7 min-h-0"
              onClick={() => setStep(5)}
              type="button"
            >
              ADD
            </button>
          </div>
          <div className="flex justify-between items-center mt-8">
            <button
              className="text-blue-700 underline ml-5 text-xs bg-transparent border-none shadow-none"
              onClick={() => setStep(6)}
              type="button"
            >
              Skip
            </button>
            <div className="flex gap-1">
              <button
                className="btn text-white border-2 border-white bg-[#6D28D9] hover:bg-white hover:border-[#6D28D9] hover:text-[#1E3A8A] shadow-none"
                onClick={() => setStep(2)}
                type="button"
              >
                Back
              </button>
              <button
                className="btn text-white border-2 border-white bg-[#1E3A8A] hover:bg-white hover:border-[#1E3A8A] hover:text-[#1E3A8A] shadow-none"
                onClick={() => setStep(2)}
                type="button"
              >
                Review Tasks
              </button>
            </div>
          </div>
        </>
      )}

      {step === 5 && (
        <>
          <h2 className="text-center text-black font-bold text-2xl mb-6">Add Subtask</h2>
          <input
            placeholder="Subtask name"
            value={currentSubtask.name}
            onChange={(e) => {
              setCurrentSubtask({ ...currentSubtask, name: e.target.value })
              if (subtaskNameError) setSubtaskNameError(false)
            }}
            className={`input input-bordered w-full my-2 text-black placeholder-black ${subtaskNameError ? 'input-error placeholder-error' : ''}`}
          />
          <textarea
            placeholder="Subtask description"
            value={currentSubtask.description}
            onChange={(e) => setCurrentSubtask({ ...currentSubtask, description: e.target.value })}
            className="textarea textarea-bordered w-full my-2 text-black placeholder-black"
          />
          <input
            type="datetime-local"
            value={currentSubtask.dueDate || ''}
            onChange={(e) => {
              setCurrentSubtask({ ...currentSubtask, dueDate: e.target.value })
              if (subtaskDueDateError) setSubtaskDueDateError(false)
            }}
            className={`input input-bordered w-full my-2 text-black placeholder-black ${subtaskDueDateError ? 'input-error placeholder-error' : ''}`}
            placeholder="Due date and time"
          />
          <select
            value={currentSubtask.priority || ''}
            onChange={(e) => setCurrentSubtask({ ...currentSubtask, priority: e.target.value })}
            className={`select select-bordered w-full my-2 text-black placeholder-black ${subtaskPriorityError ? 'input-error placeholder-error' : ''}`}
          >
            <option value="">Priority</option>
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          <label className="block mb-1 font-semibold">Assign users</label>
          <input
            type="text"
            className="input input-bordered w-full text-base bg-white text-black"
            placeholder="Type to search users..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
          {userSearch && (
            <div className="bg-white border rounded shadow w-full mt-1 max-h-48 overflow-auto z-40">
              {allUsers
                .filter(
                  (u) =>
                    u.userName.toLowerCase().includes(userSearch.toLowerCase()) &&
                    !(currentSubtask.users || []).some((sel) => sel.id === u.id)
                )
                .map((user) => (
                  <div
                    key={user.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setCurrentSubtask({
                        ...currentSubtask,
                        users: [...(currentSubtask.users || []), user]
                      })
                      setUserSearch('')
                    }}
                  >
                    {user.userName}
                  </div>
                ))}
              {allUsers.filter(
                (u) =>
                  u.userName.toLowerCase().includes(userSearch.toLowerCase()) &&
                  !(currentSubtask.users || []).some((sel) => sel.id === u.id)
              ).length === 0 && <div className="px-3 py-2 text-gray-400">No users found</div>}
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-2 mb-2">
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
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <button
              className="btn text-white border-2 border-white bg-[#6D28D9] hover:bg-white hover:border-[#6D28D9] hover:text-[#1E3A8A] shadow-none"
              onClick={back}
            >
              Back
            </button>
            <button
              className="btn text-white border-2 border-white bg-[#1E3A8A] hover:bg-white hover:border-[#1E3A8A] hover:text-[#1E3A8A] shadow-none"
              onClick={handleSubtaskNext}
            >
              Next
            </button>
          </div>
        </>
      )}

      {step === 6 && (
        <>
          <h1 className="text-center text-black font-bold text-3xl mb-6">Review Project</h1>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="mb-4 flex flex-col">
              <div className="flex flex-col items-start">
                <span
                  className="text-black ml-2 text-3xl font-bold"
                  style={{
                    display: 'inline-block',
                    width: `calc(${projectName.length}ch * 1.15)`,
                    minWidth: '2ch',
                    maxWidth: '100%',
                    wordBreak: 'break-word'
                  }}
                >
                  {projectName}
                </span>
                <hr
                  className="border-t-2 border-gray-600 my-2"
                  style={{
                    width: `calc(${projectName.length}ch * 1.15 + 1rem)`,
                    minWidth: '15ch',
                    maxWidth: '100%',
                    marginLeft: '0.5rem'
                  }}
                />
              </div>
              <span className="mt-1 ml-4  text-black">
                Due: <span className="font-semibold">{projectDueDate}</span>
              </span>
            </div>
            <div className="flex flex-col mt-5">
              <span className="font-semibold text-center bg-[#1e3a8a] border-b-2 border-gray-300 rounded-t-lg py-1 text-white">
                Tasks
              </span>
              {tasks.length === 0 ? (
                <div className="w-full bg-gray-200 rounded-full px-4 py-2 mt-2 text-gray-500 text-center select-none">
                  No tasks added
                </div>
              ) : (
                <ul className="mt-0 bg-white rounded-b-lg">
                  {tasks.map((task, i) => (
                    <li
                      key={i}
                      className="rounded-b-lg px-4 py-3 text-black !shadow-lg !shadow-black/20 bg-white mb-2"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                        <div className="flex flex-col flex-1">
                          <span className="font-bold text-xl text-[#1e3a8a]">{task.name}</span>
                          <span className="text-l text-black mt-2 font-semibold">
                            Due:{' '}
                            <span className="text-black text-s font-light ">{task.dueDate}</span>
                          </span>
                          <span className="text-l font-semibold mt-2">
                            Priority:{' '}
                            <span
                              className={`inline-block px-4 py-2 rounded-lg text-base font-medium ${priorityColor[task.priority] || ''}`}
                            >
                              {task.priority || 'None'}
                            </span>
                          </span>
                        </div>
                        <div className="mt-2 md:mt-0 md:ml-6 flex-1">
                          <span className="font-semibold text-l">Description:</span>
                          <span className="ml-2 text-xs text-black">{task.description}</span>
                        </div>
                      </div>
                      <div className="mt-5 ">
                        <span className="font-semibold text-center px-33 bg-[#6D28D9] border-b-2 border-gray-300 rounded-t-lg py-1 text-white">
                          Subtasks
                        </span>
                        {task.subtasks.length === 0 ? (
                          <span className="block ml-2 italic text-center text-xs text-gray-500 mt-1">
                            No subtasks
                          </span>
                        ) : (
                          <ul className=" rounded-b-lg px-4 py-3 text-black !shadow-lg !shadow-black/20 bg-white mb-2">
                            {task.subtasks.map((sub, j) => (
                              <li
                                key={j}
                                className="bg-gray-50 rounded px-2 py-1 mb-1 flex flex-col"
                              >
                                <span className="font-semibold text-l text-[#6D28D9]">
                                  {sub.name}
                                </span>
                                <span className="flex flex-col text-xs">
                                  <span className="font-semibold mt-2">Description:</span>
                                  {sub.description}
                                  <span className="mt-1">
                                    Priority:{' '}
                                    <span
                                      className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${priorityColor[sub.priority || ''] || ''}`}
                                    >
                                      {sub.priority || 'None'}
                                    </span>
                                  </span>
                                  {sub.users && sub.users.length > 0 && (
                                    <div className="flex gap-2 mt-1">
                                      {sub.users.map((user) => (
                                        <div key={user.id} className="relative group">
                                          <img
                                            src={user.profilePicUrl}
                                            alt={user.userName}
                                            className="w-8 h-8 rounded-full border-2 border-white shadow"
                                          />
                                          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap">
                                            {user.userName}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button
              className="btn text-white border-2 border-white bg-[#6D28D9] hover:bg-white hover:border-[#6D28D9] hover:text-[#1E3A8A] shadow-none"
              onClick={() => setStep(2)}
            >
              Back
            </button>
            <button
              className="btn text-white border-2 border-white bg-[#059669] hover:bg-white hover:border-[#059669] hover:text-[#059669] shadow-none"
              onClick={handleSubmit}
            >
              Finish
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default CreateProject
