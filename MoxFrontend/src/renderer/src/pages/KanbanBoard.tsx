import React, { useEffect, useState } from 'react'
import { DndContext, closestCenter, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core'
import { WorkStatus, PriorityLevel } from '../../interfaces/TaskEnums'
import { TaskDto } from '../../interfaces/Task'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase'
import ConfettiEffect from '../components/ConfettiEffect'
import { PaperClipIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid'
import EditProject from '../components/EditProject'
import '../styles/kanban.css'

const columns = [
  { title: 'To Do', status: WorkStatus.NotStarted },
  { title: 'In Progress', status: WorkStatus.InProgress },
  { title: 'Done', status: WorkStatus.Completed }
]

const DraggableTaskCard = ({
  task,
  onEdit,
  onDelete
}: {
  task: TaskDto
  onEdit: (task: TaskDto) => void
  onDelete: (id: number) => void
}) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: task.taskId.toString() })
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="rounded-lg border border-white p-4 cursor-move hover:shadow-md bg-transparent user-select-none touch-none z-10 text-[#122235]"
    >
      <div className="flex justify-between">
        <h3 className="font-bold" style={{ color: '#1D3557' }}>
          {task.title}
        </h3>
        <div className="space-x-2">
          <button
            className="btn btn-xs"
            style={{ backgroundColor: '#EFB917', color: '#122235', border: 'none' }}
            onClick={() => onEdit(task)}
            type="button"
          >
            Edit
          </button>
          <button
            className="btn btn-xs btn-error"
            onClick={() => onDelete(task.taskId)}
            type="button"
          >
            Delete
          </button>
        </div>
      </div>
      <p className="text-sm" style={{ color: '#122235' }}>
        {task.description}
      </p>
      <p className="text-xs mt-2" style={{ color: '#122235' }}>
        Project ID: <strong>{task.projectID}</strong> | Priority:{' '}
        <strong>{PriorityLevel[task.priority]}</strong> | Due:{' '}
        {task.dueDate ? new Date(task.dueDate).toLocaleString() : 'N/A'}
      </p>
      <div className="flex items-center gap-3 mt-2 text-[#122235]">
        {task.imageUrl && <PaperClipIcon className="h-4 w-4" title="Attachment" />}
        {task.comments?.length > 0 && (
          <div className="flex items-center gap-1">
            <ChatBubbleLeftIcon className="h-4 w-4" title="Comments" />
            <span className="text-xs">{task.comments.length}</span>
          </div>
        )}
      </div>
      {task.imageUrl && (
        <img src={task.imageUrl} alt="attachment" className="mt-2 max-h-24 rounded" />
      )}
    </div>
  )
}

const DroppableColumn = ({ status, children }: { status: string; children: React.ReactNode }) => {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  return (
    <div
      ref={setNodeRef}
      className={`card bg-transparent border border-transparent rounded-box grow p-4 min-h-[200px] transition ${isOver ? 'ring-2 ring-primary' : ''}`}
    >
      {children}
    </div>
  )
}

const KanbanBoard = () => {
  const [allTasks, setAllTasks] = useState<TaskDto[]>([])
  const [filteredTasks, setFilteredTasks] = useState<TaskDto[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showEditProjectModal, setShowEditProjectModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)

  const handleEditProjectOpen = (project: any) => {
    setSelectedProject(project)
    setShowEditProjectModal(true)
  }

  const handleEditProjectClose = () => {
    setShowEditProjectModal(false)
    setSelectedProject(null)
  }

  const handleEditProjectSave = async (updated: any) => {
    await fetch(`http://localhost:5183/api/Project/${updated.projectID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
    handleEditProjectClose()
  }

  const updateProgress = (taskList: TaskDto[]) => {
    const total = taskList.length
    const done = taskList.filter((t) => t.status === WorkStatus.Completed).length
    setProgress(total === 0 ? 0 : Math.round((done / total) * 100))
  }

  useEffect(() => {
    fetch('http://localhost:5183/api/Project')
      .then((r) => r.json())
      .then(async (data) => {
        const projectsArray = Array.isArray(data.$values) ? data.$values : data
        setProjects(projectsArray)

        const allFetchedTasks: TaskDto[] = []
        for (const project of projectsArray) {
          try {
            const res = await fetch(
              `http://localhost:5183/api/Task/by-project/${project.projectID}`
            )
            const taskData = await res.json()
            const tasksArr = Array.isArray(taskData.$values) ? taskData.$values : taskData
            allFetchedTasks.push(...tasksArr)
          } catch (error) {
            console.error('Failed to fetch tasks for project', project.projectID)
          }
        }

        setAllTasks(allFetchedTasks)
        setFilteredTasks(allFetchedTasks)
        updateProgress(allFetchedTasks)
      })
      .catch(console.error)
  }, [])

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedProjectId(value === 'all' ? null : Number(value))
    if (value === 'all') {
      setFilteredTasks(allTasks)
      updateProgress(allTasks)
    } else {
      const filtered = allTasks.filter((t) => t.projectID === Number(value))
      setFilteredTasks(filtered)
      updateProgress(filtered)
    }
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over) return
    const taskId = parseInt(active.id)
    const newStatus = over.id as WorkStatus
    const task = filteredTasks.find((t) => t.taskId === taskId)
    if (task && task.status !== newStatus) {
      const updated = { ...task, status: newStatus }
      const newList = filteredTasks.map((t) => (t.taskId === taskId ? updated : t))
      setFilteredTasks(newList)
      setAllTasks((prev) => prev.map((t) => (t.taskId === taskId ? updated : t)))
      updateProgress(newList)

      fetch(`http://localhost:5183/api/Task/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      }).catch(console.error)

      if (newStatus === WorkStatus.Completed) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
    }
  }

  const handleEditTask = (task: TaskDto) => {
    const matchingProject = projects.find((p) => p.projectID === task.projectID)
    if (matchingProject) {
      handleEditProjectOpen(matchingProject)
    }
  }

  const handleDeleteTask = (id: number) => {
    // implement task delete logic
  }

  return (
    <div className="min-h-screen w-full pt-10">
      {showConfetti && <ConfettiEffect />}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-4 shadow-sm rounded-b-lg">
        <div>
          <h1 className="text-2xl font-semibold">Kanban board</h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <select
            className="select select-bordered"
            value={selectedProjectId ?? 'all'}
            onChange={handleFilterChange}
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.projectID} value={p.projectID}>
                {p.projectName}
              </option>
            ))}
          </select>
          <div className="avatar placeholder">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
              <span className="text-sm">U</span>
            </div>
          </div>
        </div>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex flex-col lg:flex-row gap-4 px-6 py-4">
          {columns.map((col) => (
            <DroppableColumn key={col.status} status={col.status}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#2E6BFC' }}>
                {col.title}
              </h2>
              <div className="space-y-4">
                {filteredTasks
                  .filter((task) => task.status === col.status)
                  .map((task) => (
                    <DraggableTaskCard
                      key={task.taskId}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
              </div>
            </DroppableColumn>
          ))}
        </div>
      </DndContext>

      {showEditProjectModal && selectedProject && (
        <EditProject
          project={selectedProject}
          onClose={handleEditProjectClose}
          onSave={handleEditProjectSave}
        />
      )}
    </div>
  )
}

export default KanbanBoard
