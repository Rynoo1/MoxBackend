import React, { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import '../styles/dashboard.css'

interface Project {
  projectID: number
  projectName: string
  dueDate: string
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
  const username = "Tebogo"

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
      } catch (err: any) {
        setError(err.message || 'Failed to fetch projects.')
      }
    }
    fetchProjects()
  }, [])

  const upcomingProjects = projects.filter((project) => {
    const due = new Date(project.dueDate)
    return due >= new Date()
  })

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="bg-base-300 px-6 py-4 shadow-sm rounded-b-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Home</h1>
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
          <div className="stat-value text-primary">12</div>
          <div className="stat-desc">+21% this week</div>
        </div>
        <div className="stat">
          <div className="stat-title">Collaborators</div>
          <div className="stat-value text-secondary">4</div>
          <div className="stat-desc">+2 new this month</div>
        </div>
        <div className="stat">
          <div className="stat-title">Progress</div>
          <div className="stat-value text-primary">86%</div>
          <div className="stat-desc text-gray-500">31 tasks remaining</div>
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

          <div className="card bg-white shadow rounded">
            <div className="card-body">
              <h3 className="card-title">Weekly Progress</h3>
              <div className="text-success text-3xl font-bold">67%</div>
              <progress className="progress progress-success w-full" value="67" max="100"></progress>
              <p className="text-sm text-gray-500">8 of 12 tasks done</p>
            </div>
          </div>

          <div className="stat bg-white p-4 shadow rounded">
            <div className="stat-title text-error">Emergency Tasks</div>
            <div className="stat-value text-error">3</div>
            <div className="stat-desc">Handle immediately</div>
          </div>

          <div className="stat bg-white p-4 shadow rounded">
            <div className="stat-title">Most Active Project</div>
            <div className="stat-value">Kanban UX</div>
            <div className="stat-desc">14 updates this week</div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
