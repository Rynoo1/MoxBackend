import React, { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import '../styles/dashboard.css'
import EmergencyMeeting from '../components/EmergencyMeetingOverlay'
import { Link } from 'react-router-dom'
import OverdueTasksChart from '../components/charts/OverdueTasksChart'

interface Project {
  projectID: number
  projectName: string
  dueDate: string
  tasksCompleted?: number
  tasksTotal?: number
  updatesCount?: number
  emergencyTasksCount?: number
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
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const username = 'Taylor'

  const [weeklyProgress, setWeeklyProgress] = useState({ percent: 0, done: 0, total: 0 })
  const [emergencyTasks, setEmergencyTasks] = useState(0)
  const [mostActiveProject, setMostActiveProject] = useState<Project | null>(null)
  const [recentlyViewed, setRecentlyViewed] = useState<Project[]>([])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const calculateOverdueTasks = () => {
    const now = new Date()
    return filteredProjects
      .filter((project) => {
        const dueDate = new Date(project.dueDate)
        return dueDate < now && (project.tasksTotal ?? 0) > (project.tasksCompleted ?? 0)
      })
      .map((project) => ({
        task: project.projectName,
        dueDate: project.dueDate
      }))
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5183/api/Project')
        if (!response.ok) throw new Error(`Error ${response.status}`)
        const data = await response.json()
        const projectsArray = Array.isArray(data.$values) ? data.$values : Array.isArray(data) ? data : []
        setProjects(projectsArray)
        setFilteredProjects(projectsArray)

        let totalTasks = 0
        let completedTasks = 0
        let totalEmergencyTasks = 0

        projectsArray.forEach((project: Project) => {
          totalTasks += project.tasksTotal ?? 0
          completedTasks += project.tasksCompleted ?? 0
          totalEmergencyTasks += project.emergencyTasksCount ?? 0
        })

        const percent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0

        setWeeklyProgress({ percent, done: completedTasks, total: totalTasks })
        setEmergencyTasks(totalEmergencyTasks)

        const activeProject = projectsArray.reduce((prev, curr) => {
          if (!prev) return curr
          return (curr.updatesCount ?? 0) > (prev.updatesCount ?? 0) ? curr : prev
        }, null as Project | null)

        setMostActiveProject(activeProject)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch projects.')
      }
    }

    fetchProjects()

    const recent = localStorage.getItem('recentlyViewedProjects')
    if (recent) {
      setRecentlyViewed(JSON.parse(recent))
    }
  }, [])

  useEffect(() => {
    let filtered = [...projects]

    if (searchTerm) {
      filtered = filtered.filter((p) => p.projectName?.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (statusFilter === 'Done') {
      filtered = filtered.filter((p) => (p.tasksTotal ?? 0) === (p.tasksCompleted ?? 0))
    } else if (statusFilter === 'In Progress') {
      filtered = filtered.filter((p) => (p.tasksCompleted ?? 0) > 0 && (p.tasksCompleted ?? 0) < (p.tasksTotal ?? 0))
    } else if (statusFilter === 'To Do') {
      filtered = filtered.filter((p) => (p.tasksCompleted ?? 0) === 0)
    }

    setFilteredProjects(filtered)
  }, [searchTerm, statusFilter, projects])

  return (
    <div className="min-h-screen w-full pt-10">
      <div className="bg-white px-6 py-4 shadow-sm rounded-b-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>
            <EmergencyMeeting />
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Search projects..."
              className="input input-bordered input-sm w-40 md:w-56"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="select select-bordered select-sm w-32"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All</option>
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
            <Link to="/profile">
              <div className="avatar placeholder cursor-pointer">
                <div className="w-10 rounded-full bg-neutral text-white">
                  <span className="text-lg">👤</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="stats shadow w-full overflow-x-auto mt-10 mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat">
          <div className="stat-title">Tasks Completed</div>
          <div className="stat-value text-primary">{weeklyProgress.done}</div>
          <div className="stat-desc">+21% this week</div>
        </div>
        <div className="stat">
          <div className="stat-title">Collaborators</div>
          <div className="stat-value text-secondary">4</div>
          <div className="stat-desc">+2 new this month</div>
        </div>
        <div className="stat">
          <div className="stat-title">Progress</div>
          <div className="stat-value text-primary">{weeklyProgress.percent}%</div>
          <div className="stat-desc text-gray-500">{weeklyProgress.total - weeklyProgress.done} tasks remaining</div>
        </div>
      </div>
      <main className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 shadow rounded">
            <h3 className="text-xl font-semibold mb-4">Tasks Overview</h3>
            <OverdueTasksChart
              overdueTasks={calculateOverdueTasks()}
              allTasks={projects.map((project) => ({ id: project.projectID, name: project.projectName }))}
            />
          </div>

          <div className="bg-white p-4 shadow rounded">
            <h3 className="text-xl font-semibold mb-4">Your Projects</h3>
            {projects.length === 0 ? (
              <p>No projects found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Project Name</th>
                    </tr>
                  </thead>
                  <tbody>
                   {filteredProjects.slice(0, 5).map((project) => (

                      <tr key={project.projectID}>
                        <td>{project.projectID}</td>
                        <td>{project.projectName || 'Untitled'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white p-4 shadow rounded">
            <h3 className="text-xl font-semibold mb-4">Calendar</h3>
            <DayPicker
              mode="single"
              selected={date}
              onSelect={setDate}
              className="react-day-picker"
            />
          </div>
        </div>



      </main>
    </div>
  )
}

export default Dashboard
