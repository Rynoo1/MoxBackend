import OverdueTasksChart from '@renderer/components/charts/OverdueTasksChart'
import PriorityBreakdownChart from '@renderer/components/charts/PriorityBreakdownChart'
import UserWorkloadChart from '@renderer/components/charts/UserWorkloadChart'
import ProjectCompletionChart from '@renderer/components/charts/ProjectCompletionChart'
import TasksOverTimeChart from '@renderer/components/charts/TasksOverTimeChart'
import React, { useEffect, useState } from 'react'
import TaskStatusChart from '@renderer/components/charts/TaskStatusChart'
import '../components/styles/Projects.css'
import moxLoadingGif from '../assets/mox-loading.gif'

const chartOptionsAdmin = [
  { value: 'completion', label: 'Project Completion Overview' },
  { value: 'status', label: 'Task Status Distribution' },
  { value: 'overTime', label: 'Tasks Completed Over Time' },
  { value: 'priority', label: 'Priority Breakdown' },
  { value: 'workload', label: 'User Workload' },
  { value: 'overdue', label: 'Overdue Tasks' }
]

const chartOptionsBasic = [
  { value: 'completion', label: 'Project Completion Overview' },
  { value: 'status', label: 'Task Status Distribution' },
  { value: 'overTime', label: 'Tasks Completed Over Time' },
  { value: 'priority', label: 'Priority Breakdown' }
]

interface User {
  Id: string
  UserName: string
  Email?: string
}

interface SubTask {
  subTaskID: number | string
  title?: string
  dueDate?: string
  SubTStatus?: number
  priority?: number
  assignedUsers?: User[]
  completedDate?: string
}

interface Task {
  completedDate?: string
  id: number
  title?: string
  name?: string
  dueDate?: string
  status?: number
  priority?: number
  subTasks?: SubTask[]
}

interface Project {
  id: number | string
  title?: string
  projectID?: number | string
  tasks?: Task[]
}

interface AnalyticsProps {
  isAdmin: boolean
  userId: string
}

const priorityLabels = ['', 'Low', 'Medium', 'High', 'Critical']

const Analytics: React.FC<AnalyticsProps> = ({ isAdmin, userId }) => {
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const chartOptions = isAdmin ? chartOptionsAdmin : chartOptionsBasic

  // Fetch all projects for both admin and non-admin users
  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:5183/api/Project')
      .then((res) => res.json())
      .then(async (data) => {
        const projectsArray = Array.isArray(data.$values)
          ? data.$values
          : Array.isArray(data)
            ? data
            : []

        const projectsWithTasks = await Promise.all(
          projectsArray.map(async (project: any) => {
            const res = await fetch(
              `http://localhost:5183/api/Task/by-project/${project.projectID}`
            )
            const tasksData = await res.json()
            const parsedTasks = Array.isArray(tasksData.$values) ? tasksData.$values : tasksData

            const tasks = await Promise.all(
              parsedTasks.map(async (task: any) => {
                let subTasks =
                  task.subTasks && Array.isArray(task.subTasks.$values) ? task.subTasks.$values : []

                subTasks = await Promise.all(
                  subTasks
                    .filter(
                      (sub: any) => sub && sub.subTaskID !== undefined && sub.subTaskID !== null
                    )
                    .map(async (sub: any) => {
                      // Fetch assigned user IDs for this subtask
                      const usersRes = await fetch(
                        `http://localhost:5183/api/SubTask/${sub.subTaskID}/users`
                      )
                      let userIds = await usersRes.json()
                      userIds = Array.isArray(userIds.$values) ? userIds.$values : userIds

                      // Fetch user details for each user ID to get the UserName
                      const assignedUsers = await Promise.all(
                        userIds.map(async (userId: any) => {
                          let id = userId
                          if (typeof userId === 'object') {
                            if ('Id' in userId) {
                              id = userId.Id
                            } else if ('id' in userId) {
                              id = userId.id
                            } else {
                              // fallback: skip this userId if it doesn't have an id property
                              return null
                            }
                          }
                          const userRes = await fetch(`http://localhost:5183/api/User/${id}`)
                          return await userRes.json()
                        })
                      )
                      // Remove any nulls from assignedUsers
                      return {
                        ...sub,
                        assignedUsers: assignedUsers.filter(Boolean)
                      }
                    })
                )

                return {
                  ...task,
                  subTasks
                }
              })
            )

            return { ...project, tasks }
          })
        )

        setProjects(projectsWithTasks)
        if (projectsWithTasks.length > 0) {
          setSelectedProject(
            projectsWithTasks[Math.floor(Math.random() * projectsWithTasks.length)]
          )
        } else {
          setSelectedProject(null)
        }
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line
  }, [isAdmin, userId])

  // --- Analytics Calculations ---

  // Overdue Tasks
  const overdueTasks: { task: string; dueDate: string }[] = []
  const now = new Date()
  for (const project of projects) {
    if (!project.tasks) continue
    for (const task of project.tasks) {
      const isTaskOverdue =
        ((typeof task.status === 'number' ? task.status < 100 : task.status !== 'Completed') &&
          task.dueDate &&
          new Date(task.dueDate) < now) ||
        (Array.isArray(task.subTasks) &&
          task.subTasks.some(
            (st: any) => st.SubTStatus === 0 && st.dueDate && new Date(st.dueDate) < now
          ))

      if (isTaskOverdue) {
        overdueTasks.push({
          task: task.title || task.name || 'Untitled Task',
          dueDate: task.dueDate ?? ''
        })
      }
    }
  }

  // User Workload
  const userWorkloadMap: Record<string, number> = {}
  for (const project of projects) {
    if (!project.tasks) continue
    for (const task of project.tasks) {
      if (Array.isArray(task.subTasks)) {
        for (const subTask of task.subTasks) {
          if (Array.isArray(subTask.assignedUsers)) {
            for (const user of subTask.assignedUsers) {
              const userName = user.UserName || user.Email || `User ${user.Id || ''}`
              userWorkloadMap[userName] = (userWorkloadMap[userName] || 0) + 1
            }
          }
        }
      }
    }
  }
  const userWorkload = Object.entries(userWorkloadMap).map(([user, taskCount]) => ({
    user,
    taskCount
  }))

  // Task Status Distribution
  const statusCountMap: Record<string, number> = {}
  for (const project of projects) {
    if (!project.tasks) continue
    for (const task of project.tasks) {
      let statusLabel = 'Unknown'
      if (typeof task.status === 'number') {
        statusLabel = task.status >= 100 ? 'Completed' : 'In Progress'
      } else if (typeof task.status === 'string') {
        statusLabel = task.status
      }
      statusCountMap[statusLabel] = (statusCountMap[statusLabel] || 0) + 1
    }
  }
  const statusData = Object.entries(statusCountMap).map(([status, count]) => ({
    status,
    count
  }))

  // Task Priorities
  const allTaskPriorities: string[] = []
  for (const project of projects) {
    if (!project.tasks) continue
    for (const task of project.tasks) {
      if (typeof task.priority === 'number') {
        const label = priorityLabels[task.priority] ?? 'Unknown'
        allTaskPriorities.push(label)
      }
    }
  }

  // Subtask Priorities
  const allSubTaskPriorities: string[] = []
  for (const project of projects) {
    if (!project.tasks) continue
    for (const task of project.tasks) {
      if (Array.isArray(task.subTasks)) {
        for (const subTask of task.subTasks) {
          if (typeof subTask.priority === 'number') {
            const label = priorityLabels[subTask.priority] ?? 'Unknown'
            allSubTaskPriorities.push(label)
          }
        }
      }
    }
  }

  // Tasks Completed Over Time
  const completedByDate: Record<string, number> = {}
  for (const project of projects) {
    if (!project.tasks) continue
    for (const task of project.tasks) {
      if (
        typeof task.status === 'number' &&
        task.status >= 100 &&
        typeof task.completedDate === 'string'
      ) {
        const date = new Date(task.completedDate).toISOString().slice(0, 10)
        completedByDate[date] = (completedByDate[date] || 0) + 1
      }
      if (Array.isArray(task.subTasks)) {
        for (const subTask of task.subTasks) {
          if (subTask.SubTStatus === 1 && typeof subTask.completedDate === 'string') {
            const date = new Date(subTask.completedDate).toISOString().slice(0, 10)
            completedByDate[date] = (completedByDate[date] || 0) + 1
          }
        }
      }
    }
  }
  const tasksOverTimeData = Object.entries(completedByDate)
    .map(([date, completed]) => ({
      date,
      completed: Number(completed)
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Debug logs
  useEffect(() => {
    console.log('TasksOverTimeChart data:', tasksOverTimeData)
    console.log('TaskStatusChart data:', statusData)
  }, [tasksOverTimeData, statusData])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" style={{ marginTop: '25%' }}>
        <img
          src={moxLoadingGif}
          alt="Loading..."
          style={{
            width: '100%',
            maxWidth: '700px',
            minWidth: '200px',
            height: 'auto',
            maxHeight: '700px',
            minHeight: '150px',
            objectFit: 'contain'
          }}
        />
      </div>
    )
  }

  return (
    <div className="projects-page min-h-screen overflow-y-auto mt-20 px-8 pr-20 pb-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">Analytics Dashboard</h1>
      {isAdmin ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <div className="w-full">
            <TaskStatusChart data={statusData} />
            <div className="w-full">
              <OverdueTasksChart
                overdueTasks={overdueTasks}
                allTasks={projects.flatMap((project) =>
                  (project.tasks || []).map((task: any) => ({
                    ...task,
                    projectName: (project as any).projectName || project.title || 'Unknown Project'
                  }))
                )}
              />
            </div>
          </div>
          <div className="w-full">
            <PriorityBreakdownChart
              taskPriorities={allTaskPriorities}
              subTaskPriorities={allSubTaskPriorities}
            />
          </div>
          <div className="w-full">
            <UserWorkloadChart data={userWorkload.sort((a, b) => b.taskCount - a.taskCount)} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="w-full">
            <TaskStatusChart data={statusData} />
          </div>
          <div className="w-full">
            <PriorityBreakdownChart
              taskPriorities={allTaskPriorities}
              subTaskPriorities={allSubTaskPriorities}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Analytics
