import React, { useRef, useState, useEffect } from 'react'
import '../components/styles/Projects.css'
import ProjectCard from '@renderer/components/Projectcard'
import CreateProject from '@renderer/components/CreateProject'
import moxLoadingGif from '../assets/mox-loading.gif'

interface Project {
  projectID: number
  projectName: string
  dueDate: string
}

interface Task {
  id: number
  status: string
  dueDate: string
  subTasks?: { completed: boolean }[]
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [projectTasks, setProjectTasks] = useState<Record<number, Task[]>>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [createKey, setCreateKey] = useState(0)
  const [sortMode, setSortMode] = useState<'default' | 'completed' | 'notCompleted'>('default')
  const modalRef = useRef<HTMLDialogElement>(null)

  // Fetch all projects
  const fetchProjects = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5183/api/Project')
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      const projectsArray = Array.isArray(data.$values)
        ? data.$values
        : Array.isArray(data)
          ? data
          : []
      setProjects(projectsArray)
      // Fetch tasks for each project
      fetchAllProjectTasks(projectsArray)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch projects.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch tasks for all projects
  const fetchAllProjectTasks = async (projectsList: Project[]) => {
    const tasksMap: Record<number, Task[]> = {}
    await Promise.all(
      projectsList.map(async (project) => {
        try {
          const res = await fetch(`http://localhost:5183/api/Task/by-project/${project.projectID}`)
          if (res.ok) {
            const data = await res.json()
            tasksMap[project.projectID] = Array.isArray(data.$values) ? data.$values : data
          } else {
            tasksMap[project.projectID] = []
          }
        } catch {
          tasksMap[project.projectID] = []
        }
      })
    )
    setProjectTasks(tasksMap)
  }

  useEffect(() => {
    fetchProjects()
    // eslint-disable-next-line
  }, [])

  // Helpers
  const isProjectCompleted = (tasks: Task[]) =>
    tasks.length > 0 &&
    tasks.every(
      (task) =>
        task.status === 'Completed' &&
        (!Array.isArray(task.subTasks) || task.subTasks.every((st) => st.completed))
    )

  const isProjectOverdue = (project: Project, tasks: Task[]) => {
    const now = new Date()
    const due = new Date(project.dueDate)
    return due < now && !isProjectCompleted(tasks)
  }

  // Sorting logic
  const sortedProjects = [...projects].sort((a, b) => {
    const tasksA = projectTasks[a.projectID] || []
    const tasksB = projectTasks[b.projectID] || []
    const overdueA = isProjectOverdue(a, tasksA)
    const overdueB = isProjectOverdue(b, tasksB)
    if (overdueA && !overdueB) return -1
    if (!overdueA && overdueB) return 1
    // Closest due date next
    const dateA = new Date(a.dueDate).getTime()
    const dateB = new Date(b.dueDate).getTime()
    return dateA - dateB
  })

  // Filter by sort mode
  const filteredAndSortedProjects = sortedProjects.filter((project) => {
    const tasks = projectTasks[project.projectID] || []
    if (sortMode === 'completed') return isProjectCompleted(tasks)
    if (sortMode === 'notCompleted') return !isProjectCompleted(tasks)
    return true
  })

  // Modal handlers
  const handleCreateClose = () => {
    modalRef.current?.close()
    setCreateKey((k) => k + 1)
    fetchProjects()
  }

  const handleOpen = () => {
    setCreateKey((k) => k + 1)
    modalRef.current?.showModal()
  }

  return (
    <div className="projects-page min-h-screen overflow-y-auto">
      {error && <div className="error">{error}</div>}
      {loading && (
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
      )}
      {!loading && (
        <div className="flex items-center gap-4 p-4 mb-4 mt-8" style={{ width: '80%' }}>
          <button
            className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl bg-[#1e3a8a] text-white hover:text-[#1e3a8a] hover:bg-white font-semibold border-2 border-[#1e3a8a] !shadow-md shadow-black/30"
            onClick={handleOpen}
            disabled={loading}
          >
            Create New Project
          </button>
          <div style={{ marginLeft: 'auto' }}>
            <select
              className="select select-bordered !shadow-md shadow-black/30"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as typeof sortMode)}
            >
              <option value="default">All Projects</option>
              <option value="completed">Completed</option>
              <option value="notCompleted">Not Completed</option>
            </select>
          </div>
          <dialog id="create_project_modal" className="modal" ref={modalRef}>
            <div className="modal-box relative bg-[#EDF2F7]">
              <button
                className="btn btn-sm btn-square btn-ghost border-2 text-center border-red-500 bg-red-500 hover:bg-white hover:text-red-500 font-light absolute right-2 top-2"
                style={{ fontSize: 30 }}
                onClick={handleCreateClose}
              >
                ×
              </button>
              <CreateProject key={createKey} onClose={handleCreateClose} />
            </div>
          </dialog>
        </div>
      )}
      <div className="project-page flex flex-col gap-6" style={{ width: '80%' }}>
        {!loading &&
          filteredAndSortedProjects.map((project) => (
            <ProjectCard
              key={project.projectID}
              ProjectID={project.projectID}
              ProjectName={project.projectName}
              ProjectDueDate={project.dueDate}
              isOverdue={isProjectOverdue(project, projectTasks[project.projectID] || [])}
            />
          ))}
      </div>
    </div>
  )
}

export default Projects
