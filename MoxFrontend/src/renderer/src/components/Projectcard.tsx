import React from 'react'
import './styles/Projectcard.css'
import Progressbar from './ProgressBar'
import { useNavigate } from 'react-router-dom'
import loadingGif from '../assets/mox-loading.gif'

interface SubTask {
  id: number
  title: string
  completed: boolean
  assignedUsers?: {
    ProfilePicture: string
    id: string
    userName: string
  }[]
}

interface Task {
  taskId: number
  id: number
  title: string
  status: number
  priority: number
  dueDate: string
  subTasks?: SubTask[]
}

interface ProjectCardProps {
  ProjectID: number
  ProjectName: string
  ProjectDueDate?: string
  isOverdue?: boolean
  isAdmin?: boolean
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  ProjectID,
  ProjectName,
  ProjectDueDate,
  isOverdue,
  isAdmin = false
}) => {
  const [tasks, setTasks] = React.useState<Task[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const [expandedTaskId, setExpandedTaskId] = React.useState<number | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true) // Add this line
  const navigate = useNavigate()

  React.useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true) // Start loading
      try {
        const response = await fetch(`http://localhost:5183/api/Task/by-project/${ProjectID}`)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        const parsed = Array.isArray(data.$values) ? data.$values : data

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
                      const userList = Array.isArray(users.$values) ? users.$values : users

                      // Always fetch full user info for each assigned user to get ProfilePicture
                      const assignedUsersWithProfile = await Promise.all(
                        userList.map(async (u: any) => {
                          const userRes = await fetch(`http://localhost:5183/api/user/${u.id}`)
                          if (userRes.ok) {
                            const userData = await userRes.json()
                            return { ...u, ProfilePicture: userData.ProfilePicture }
                          }
                          return u
                        })
                      )

                      return {
                        ...sub,
                        id: subTaskId,
                        assignedUsers: assignedUsersWithProfile
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
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch tasks.')
      } finally {
        setLoading(false) // Stop loading
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
      const incompleteTask = task.status !== 2
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

  const toggleExpand = (taskId: number) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId)
  }

  // Project Completion = (Sum of status values of all tasks) / (Total number of tasks)
  const progress =
    tasks.length > 0
      ? Math.round(tasks.reduce((sum, t) => sum + Number(t.status), 0) / tasks.length)
      : 0

  return (
    <div className="project-card w-full p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="TitleName">{ProjectName}</h1>
          {ProjectDueDate && (
            <div className="text-sm font-bold">Due: {formatDate(ProjectDueDate)}</div>
          )}
        </div>
        {isAdmin && (
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
        )}
      </div>
      {isOverdue && (
        <div className="bg-red-600 text-white font-bold px-4 py-2 rounded mb-2">
          ⚠️ Project overdue and not complete!
        </div>
      )}

      <div className="overflow-x-auto">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <img src={loadingGif} alt="Loading..." style={{ width: 300, height: 100 }} />
          </div>
        ) : sortedTasks.length === 0 ? (
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
                    <td>
                      {task.subTasks && task.subTasks.length > 0 ? (
                        (() => {
                          // Flatten all assigned users from all subtasks, deduplicate by user.id
                          const allUsers = task.subTasks.flatMap((sub) => sub.assignedUsers || [])
                          const uniqueUsers = Array.from(
                            new Map(allUsers.map((u) => [u.id, u])).values()
                          )
                          return uniqueUsers.length > 0 ? (
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                              {uniqueUsers.map((user) => (
                                <img
                                  key={user.id}
                                  src={
                                    user.ProfilePicture
                                      ? user.ProfilePicture
                                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName)}&size=32&background=random`
                                  }
                                  alt={user.userName}
                                  title={user.userName}
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '2px solid #fff',
                                    boxShadow: '0 0 2px #888'
                                  }}
                                />
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">No users</span>
                          )
                        })()
                      ) : (
                        <span className="text-gray-400">No users</span>
                      )}
                    </td>
                    <td>{getPriorityLabel(Number(task.priority))}</td>
                    <td>
                      <Progressbar progress={task.status} />
                    </td>
                    <td>
                      <span>{formatDate(task.dueDate)}</span>
                    </td>
                    <td>
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/task/${task.id ?? task.taskId}`, {
                            state: {
                              task,
                              subtasks: task.subTasks || [],
                              project: { ProjectID, ProjectName, ProjectDueDate }
                            }
                          })
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
                                    <div
                                      style={{
                                        display: 'flex',
                                        gap: '0.5rem',
                                        alignItems: 'center',
                                        flexWrap: 'wrap'
                                      }}
                                    >
                                      {sub.assignedUsers.map((u) => (
                                        <div
                                          key={u.id}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                          }}
                                        >
                                          <img
                                            src={
                                              u.ProfilePicture ||
                                              `https://ui-avatars.com/api/?name=${encodeURIComponent(u.userName)}`
                                            }
                                            alt={u.userName}
                                            title={u.userName}
                                            style={{
                                              width: 24,
                                              height: 24,
                                              borderRadius: '50%',
                                              objectFit: 'cover',
                                              border: '1px solid #fff',
                                              boxShadow: '0 0 2px #888'
                                            }}
                                          />
                                          <span style={{ fontSize: '0.95em' }}>{u.userName}</span>
                                        </div>
                                      ))}
                                    </div>
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

      <div className="overall-progress mt-4">
        <strong>Project Progress:</strong>
        <Progressbar progress={progress} />
      </div>
    </div>
  )
}

export default ProjectCard
