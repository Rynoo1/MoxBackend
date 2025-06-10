import React, { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import '../styles/dashboard.css'
import bg from '../assets/Background.jpg'

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
  const [error, setError] = useState<string | null>(null)
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

  const upcomingProjects = projects.filter((project) => {
    const due = new Date(project.dueDate)
    return due >= today
  })

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="bg-base-300 px-6 py-4 shadow-sm rounded-b-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
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

      {username && (
        <div className="text-center mt-6">
          <h2 className="text-3xl font-light">{getGreeting()}, {username}</h2>
        </div>
      )}

      <div className="stats shadow w-full overflow-x-auto mt-10 mb-10">
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
        </div>

        {/* Project Overview Table */}
        <div className="mt-10 card bg-white shadow rounded">
          <div className="card-body">
            <h3 className="card-title mb-4">Recently Viewed</h3>
            <div className="overflow-x-auto max-h-[400px]">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Weekly Progress</th>
                    <th>Emergency Tasks</th>
                    <th>Most Active Project</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="text-success font-bold text-lg">{weeklyProgress.percent}%</div>
                      <progress className="progress progress-success w-full" value={weeklyProgress.percent} max="100" />
                      <p className="text-sm text-gray-500">
                        {weeklyProgress.done} of {weeklyProgress.total} tasks done
                      </p>
                    </td>
                    <td>
                      <div className="text-error font-bold text-lg">{emergencyTasks}</div>
                      <p className="text-error text-sm">Handle immediately</p>
                    </td>
                    <td>
                      <div className="font-semibold">{mostActiveProject?.projectName ?? "N/A"}</div>
                      <p className="text-sm text-gray-500">
                        {mostActiveProject?.updatesCount ?? 0} updates this week
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3}>
                      <h4 className="text-md font-semibold mb-2">Recently Viewed Items</h4>
                      {recentlyViewed.length === 0 ? (
                        <span>No recently viewed projects.</span>
                      ) : (
                        <ul className="list-disc list-inside space-y-1 max-h-32 overflow-auto">
                          {recentlyViewed.map((proj) => (
                            <li key={proj.projectID}>{proj.projectName}</li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
