import React, { useState, useEffect } from 'react'
import { PriorityLevel } from '../models/TaskEnums'
import ProgressBar from '../components/ProgressBar'
import FileUpload from '../components/FileUpload'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { FaFileAlt } from 'react-icons/fa'

interface TaskDto {
  taskId?: number
  title: string
  description?: string
  projectID: number
  assignedTo?: string[]
  priority: PriorityLevel
  status: number
  deadline?: string
  isEmergency: boolean
  subTasks?: any[]
}

interface Comment {
  commentID: number
  content: string
  createdAt: string
  createdByUserName?: string
  createdByUserId?: string
}

const TaskDetails: React.FC = () => {
  const { taskId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  // Always fetch from backend for reliability
  const [task, setTask] = useState<any>(null)
  const [subtasks, setSubtasks] = useState<any[]>(location.state?.subTasks || [])
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState('')
  const [commentsLoading, setCommentsLoading] = useState(true)
  const [commentError, setCommentError] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [activeSubtask, setActiveSubtask] = useState<any>(null)
  const [subtaskFiles, setSubtaskFiles] = useState<{ [subTaskId: number]: any[] }>({})

  const userId = localStorage.getItem('userId')

  // Fetch task and subtasks
  useEffect(() => {
    if (taskId) {
      fetch(`http://localhost:5183/api/Task/${taskId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('API response:', data)
          setTask(data)
          setSubtasks(data.subTasks?.$values || [])
        })
        .catch(() => setTask(undefined))
    }
  }, [taskId])

  // Fetch comments
  useEffect(() => {
    if (!task?.taskId) return
    ;(async () => {
      try {
        const res = await fetch(`http://localhost:5183/api/comment/by-task/${task.taskId}`)
        const data = await res.json()
        const parsed = Array.isArray(data.$values) ? data.$values : Array.isArray(data) ? data : []
        setComments(parsed)
      } catch (err: any) {
        setCommentError(err.message || 'Could not load comments.')
      } finally {
        setCommentsLoading(false)
      }
    })()
  }, [task?.taskId])

  // Fetch files for subtasks
  useEffect(() => {
    if (subtasks.length > 0) {
      const fetchFiles = async () => {
        const filesMap: { [subTaskId: number]: any[] } = {}
        for (const subtask of subtasks) {
          const id = subtask.subTaskID
          if (!id) continue
          const res = await fetch(`http://localhost:5183/api/FileUpload/by-subtask/${id}`)
          const data = await res.json()
          // Fix: Unpack files from data.values.$values
          const files = data.values?.$values || []
          filesMap[id] = files
        }
        setSubtaskFiles(filesMap)
      }
      fetchFiles()
    }
  }, [subtasks])

  // Comment handlers (unchanged)
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return
    try {
      const res = await fetch('http://localhost:5183/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          taskId: task.taskId,
          createdByUserId: userId
        })
      })
      if (!res.ok) throw new Error('Failed to post comment.')
      const posted = await res.json()
      setComments((prev) => [...prev, posted])
      setNewComment('')
    } catch (err: any) {
      setCommentError(err.message || 'Could not submit comment.')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5183/api/comment/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Delete failed.')
      setComments((prev) => prev.filter((c) => c.commentID !== id))
    } catch (err) {
      alert('Failed to delete comment.')
    }
  }

  const handleEdit = (comment: Comment) => {
    setEditId(comment.commentID)
    setEditContent(comment.content)
  }

  const handleSaveEdit = async () => {
    if (!editContent.trim() || editId === null) return
    try {
      const res = await fetch(`http://localhost:5183/api/comment/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentID: editId,
          content: editContent,
          taskId: task.taskId,
          createdByUserId: userId
        })
      })
      if (!res.ok) throw new Error('Failed to update comment.')
      const updated = await res.json()
      setComments((prev) => prev.map((c) => (c.commentID === editId ? updated : c)))
      setEditId(null)
      setEditContent('')
    } catch (err) {
      alert('Edit failed.')
    }
  }

  const priorityColor = {
    [PriorityLevel.Low]: 'bg-green-100 text-green-700',
    [PriorityLevel.Medium]: 'bg-yellow-100 text-yellow-700',
    [PriorityLevel.High]: 'bg-red-100 text-red-700',
    [PriorityLevel.Critical]: 'bg-red-200 text-red-900 font-bold'
  }

  if (!task) {
    return <div className="text-center mt-10 text-red-500">Task data not found.</div>
  }

  // Helper for file preview
  const renderFilePreview = (subtask: any) => {
    const files = subtaskFiles[subtask.subTaskID] || []
    if (!files.length || !files[0]) {
      return <span className="text-xs text-gray-400 italic">No file uploaded</span>
    }
    const file = files[0]
    if (/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.fileName)) {
      return (
        <img
          src={file.filePath}
          alt={file.fileName}
          className="w-24 h-24 object-cover rounded border mb-1"
        />
      )
    }
    return (
      <>
        <FaFileAlt className="w-12 h-12 text-gray-400 mb-1" />
        <span className="text-xs text-gray-700 max-w-[120px] truncate text-center">
          {file.fileName}
        </span>
      </>
    )
  }

  return (
    <div className="w-full min-h-screen h-screen bg-[#f4f7fc] p-2 sm:p-4 md:p-6 flex justify-center items-start overflow-y-auto">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-md border border-gray-200 p-8 flex flex-col md:flex-row gap-8">
        {/* Left: Task details and comments */}
        <div className="flex-1 min-w-0">
          <button
            className="mb-4 text-blue-600 hover:underline text-sm"
            onClick={() => navigate(-1)}
          >
            ← Back to Tasks
          </button>

          <h1 className="text-xl font-bold text-blue-900 font-[Manrope] mb-2">{task.title}</h1>
          {task.deadline && (
            <p className="text-sm text-gray-400 mb-4">
              📅 Due: {new Date(task.deadline).toLocaleDateString()}
            </p>
          )}

          <div className="mb-6">
            <h2 className="text-md font-semibold text-blue-900 mb-1 font-[Manrope]">
              📝 Description
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {task.description || 'No description provided.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-6">
            <div>
              <span className="block text-gray-400 text-xs mb-1">Priority</span>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${priorityColor[task.priority]}`}
              >
                {PriorityLevel[task.priority]}
              </span>
            </div>
            <div>
              <span className="block text-gray-400 text-xs mb-1">Progress</span>
              <ProgressBar progress={task.status} />
            </div>
            <div>
              <span className="block text-gray-400 text-xs mb-1">Project ID</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                {task.projectID}
              </span>
            </div>
          </div>

          {/* Comments */}
          <div className="mt-8">
            <h2 className="text-md font-semibold text-blue-900 mb-2 font-[Manrope]">💬 Comments</h2>
            {commentsLoading ? (
              <p className="text-sm text-gray-400">Loading comments...</p>
            ) : (
              <div className="space-y-4 mb-4">
                {comments.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No comments yet.</p>
                )}
                {comments.map((c) => (
                  <div
                    key={c.commentID}
                    className="p-3 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    {editId === c.commentID ? (
                      <>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full text-sm p-2 border border-gray-300 rounded mb-2"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className="text-sm text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="text-sm text-gray-600 px-3 py-1 rounded hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-800 whitespace-pre-line">{c.content}</p>
                        <div className="text-xs text-gray-400 mt-1 flex justify-between items-center">
                          <span>
                            — {c.createdByUserName || 'Anonymous'} at{' '}
                            {new Date(c.createdAt).toLocaleString()}
                          </span>
                          {c.createdByUserId === userId && (
                            <div className="space-x-2">
                              <button
                                onClick={() => handleEdit(c)}
                                className="text-blue-600 hover:underline text-xs"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(c.commentID)}
                                className="text-red-600 hover:underline text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg text-sm mb-2 resize-none"
              rows={3}
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />

            <button
              onClick={handleSubmitComment}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
            >
              Post Comment
            </button>

            {commentError && <p className="text-red-500 text-sm mt-2">{commentError}</p>}
          </div>
        </div>

        {/* Right: Subtasks */}
        <div className="w-full md:w-96 flex-shrink-0">
          <h2 className="text-md font-semibold text-blue-900 mb-2 font-[Manrope]">🗂️ Subtasks</h2>
          {subtasks.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No subtasks for this task.</p>
          ) : (
            <ul className="space-y-4">
              {Array.isArray(subtasks) &&
                subtasks.map((subtask) => (
                  <li
                    key={subtask.subTaskID}
                    className="p-3 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{subtask.title || subtask.name}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${subtask.status === 100 ? 'bg-green-200 text-green-800' : 'bg-gray-200'}`}
                      >
                        {subtask.status === 100 ? 'Complete' : 'Incomplete'}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      {subtask.description && (
                        <div>
                          <span className="font-semibold">Description: </span>
                          {subtask.description}
                        </div>
                      )}
                      {subtask.dueDate && (
                        <div>
                          <span className="font-semibold">Due: </span>
                          {new Date(subtask.dueDate).toLocaleDateString()}
                        </div>
                      )}
                      {subtask.priority && (
                        <div>
                          <span className="font-semibold">Priority: </span>
                          {subtask.priority}
                        </div>
                      )}
                      {/* Remove or guard users if not present */}
                      {subtask.users && subtask.users.length > 0 && (
                        <div>
                          <span className="font-semibold">Assigned: </span>
                          {subtask.users.map((u: any) => u.userName).join(', ')}
                        </div>
                      )}
                    </div>
                    {/* File preview */}
                    <div className="mt-2 flex flex-col items-center">
                      {(() => {
                        const files = subtaskFiles[subtask.subTaskID] || []
                        if (!files.length || !files[0]) {
                          return (
                            <span className="text-xs text-gray-400 italic">No file uploaded</span>
                          )
                        }
                        const file = files[0]
                        if (/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.fileName)) {
                          return (
                            <img
                              src={file.filePath}
                              alt={file.fileName}
                              className="w-24 h-24 object-cover rounded border mb-1"
                            />
                          )
                        }
                        return (
                          <>
                            <FaFileAlt className="w-12 h-12 text-gray-400 mb-1" />
                            <span className="text-xs text-gray-700 max-w-[120px] truncate text-center">
                              {file.fileName}
                            </span>
                          </>
                        )
                      })()}
                    </div>
                    {/* Upload/Reupload button */}
                    <div className="mt-2">
                      {(() => {
                        const files = subtaskFiles[subtask.subTaskID] || []
                        const hasFile = files.length > 0 && files[0]
                        return (
                          <button
                            className={`${
                              hasFile
                                ? 'bg-yellow-500 hover:bg-yellow-600'
                                : 'bg-blue-600 hover:bg-blue-700'
                            } text-white px-4 py-2 rounded`}
                            onClick={() => {
                              setActiveSubtask(subtask)
                              setShowUploadModal(true)
                            }}
                          >
                            {hasFile ? 'Reupload' : 'Upload File'}
                          </button>
                        )
                      })()}
                    </div>
                  </li>
                ))}
            </ul>
          )}

          {/* DaisyUI Modal for File Upload */}
          {showUploadModal && activeSubtask && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                  onClick={() => setShowUploadModal(false)}
                >
                  ✕
                </button>
                <FileUpload
                  projectId={task.projectID}
                  subTaskId={activeSubtask.subTaskID}
                  onFileUploaded={() => {
                    setShowUploadModal(false)
                    window.location.reload()
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskDetails
