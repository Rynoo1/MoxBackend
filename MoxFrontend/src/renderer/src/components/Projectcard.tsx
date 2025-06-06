import React from 'react'
import './styles/Projectcard.css'
import Progressbar from './ProgressBar'
import TaskDetails from '@renderer/pages/TaskDetails'
import { useNavigate, useLocation } from 'react-router-dom'

interface SubTask {
  id: number
  title: string
  completed: boolean
  assignedUsers?: { id: string; userName: string }[]
}

interface Task {
  id: number
  title: string
  status: string
  priority: string
  dueDate: string
  subTasks?: SubTask[]
}

interface ProjectCardProps {
  ProjectID: number
  ProjectName: string
  ProjectDueDate?: string
  isOverdue?: boolean
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  ProjectID,
  ProjectName,
  ProjectDueDate,
  isOverdue
}) => {
  const [tasks, setTasks] = React.useState<Task[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null)
  const [expandedTaskId, setExpandedTaskId] = React.useState<number | null>(null)
  const allSubtasks = tasks.flatMap((task) => task.subTasks || [])
  const completed = allSubtasks.filter((st) => st.completed).length
  const total = allSubtasks.length
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0
  const navigate = useNavigate()
  const location = useLocation()

  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:5183/api/Task/by-project/${ProjectID}`)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        const parsed = Array.isArray(data.$values) ? data.$values : data

        // Fetch users for each subtask
        const normalized = await Promise.all(
          parsed.map(async (task) => {
            const subTasks =
              task.subTasks && Array.isArray(task.subTasks.$values)
                ? await Promise.all(
                    task.subTasks.$values.map(async (sub: any) => {
                      const subTaskId = sub.id ?? sub.subTaskID
                      // Fetch assigned users for this subtask
                      const usersRes = await fetch(
                        `http://localhost:5183/api/SubTask/${subTaskId}/users`
                      )
                      const users = usersRes.ok ? await usersRes.json() : []
                      return {
                        ...sub,
                        id: subTaskId,
                        assignedUsers: Array.isArray(users.$values) ? users.$values : users
                      }
                    })
                  )
                : []
            return {
              ...task,
              id: task.id ?? task.taskId,
              subTasks
            }
          })
        )

        setTasks(normalized)
        console.log('📦 Loaded tasks with users:', normalized)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch tasks.')
      }
    }
    fetchTasks()
  }, [ProjectID])

  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime()
    const dateB = new Date(b.dueDate).getTime()
    return dateA - dateB
  })

  const isProjectOverdue = () => {
    if (tasks.length === 0) return false
    const now = new Date()
    return tasks.some((task) => {
      const due = new Date(task.dueDate)
      const incompleteSubtasks = Array.isArray(task.subTasks)
        ? task.subTasks.some((st) => !st.completed)
        : false
      const incompleteTask = task.status !== 'Completed'
      return due < now && (incompleteSubtasks || incompleteTask)
    })
  }

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1:
        return 'Low'
      case 2:
        return 'Medium'
      case 3:
        return 'High'
      case 4:
        return 'Critical'
      default:
        return 'Unknown'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleBack = () => setSelectedTask(null)

  const toggleExpand = (taskId: number) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId)
  }

  return (
    <div className="project-card w-full p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="TitleName">{ProjectName}</h1>
          {ProjectDueDate && (
            <div className="text-sm font-bold">Due: {formatDate(ProjectDueDate)}</div>
          )}
        </div>
        <button
          className="bg-[#EFB917] text-white font-semibold py-1 px-2 rounded-xl text-lg border-2 border-[#EFB917] hover:!border-[#1E3A8A] hover:bg-[#1E3A8A] transition"
          onClick={() =>
            navigate('/edit-project/', {
              state: {
                project: { ProjectID, ProjectName, ProjectDueDate },
                tasks,
                subtasks: tasks.flatMap((task) => task.subTasks || [])
              }
            })
          }
        >
          Edit Project
        </button>
      </div>
      {isOverdue && (
        <div className="bg-red-600 text-white font-bold px-4 py-2 rounded mb-2">
          ⚠️ Project overdue and not complete!
        </div>
      )}
      <div className="error">{error}</div>
      {selectedTask ? (
        <TaskDetails task={selectedTask} onBack={handleBack} />
      ) : (
        <div className="overflow-x-auto">
          {sortedTasks.length === 0 ? (
            <div className="text-center bg-[#3f51b5] text-white font-bold rounded-xl py-4">
              No tasks for this project.
            </div>
          ) : (
            <table className="task-table">
              <thead>
                <tr>
                  <th>Tasks</th>
                  <th>Users</th>
                  <th>Priority</th>
                  <th>Timeline</th>
                  <th>Date</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody style={{ cursor: 'pointer' }}>
                {sortedTasks.map((task) => (
                  <React.Fragment key={task.id}>
                    <tr>
                      <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleExpand(task.id)
                          }}
                          style={{
                            marginRight: 8,
                            cursor: 'pointer',
                            background: 'none',
                            border: 'none',
                            fontWeight: 'bold',
                            color: '#1E3A8A'
                          }}
                          title={expandedTaskId === task.id ? 'Hide subtasks' : 'Show subtasks'}
                        >
                          {expandedTaskId === task.id ? '▼' : '▶'}
                        </button>
                        {task.title}
                      </td>
                      <td>{task.status}</td>
                      <td>{getPriorityLabel(Number(task.priority))}</td>
                      <td>
                        <Progressbar
                          progress={
                            task.subTasks && task.subTasks.length > 0
                              ? Math.round(
                                  (task.subTasks.filter((st) => st.completed).length /
                                    task.subTasks.length) *
                                    100
                                )
                              : 0
                          }
                        />
                      </td>
                      <td>
                        <span>{formatDate(task.dueDate)}</span>
                      </td>
                      <td>
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/task/${task.id}`)
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                    {expandedTaskId === task.id && task.subTasks && task.subTasks.length > 0 && (
                      <tr>
                        <td colSpan={6} style={{ background: '#f3f4f6', padding: 0 }}>
                          <table className="subtask-table w-full">
                            <thead>
                              <tr>
                                <th>Subtask</th>
                                <th>Status</th>
                                <th>Users</th>
                              </tr>
                            </thead>
                            <tbody>
                              {task.subTasks.map((sub) => (
                                <tr key={sub.id}>
                                  <td>{sub.title}</td>
                                  <td>
                                    {sub.completed ? (
                                      <span className="text-green-600 font-bold">Completed</span>
                                    ) : (
                                      <span className="text-red-600 font-bold">Incomplete</span>
                                    )}
                                  </td>
                                  <td>
                                    {sub.assignedUsers && sub.assignedUsers.length > 0 ? (
                                      sub.assignedUsers.map((u) => u.userName).join(', ')
                                    ) : (
                                      <span className="text-gray-400">No users</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <div className="overall-progress mt-4">
        <strong>Project Progress:</strong>
        <Progressbar progress={progress} />
      </div>
    </div>
  )
}

export default ProjectCard
