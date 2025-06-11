import React, { useState, useEffect } from 'react'
import { PriorityLevel } from '../models/TaskEnums'
import ProgressBar from '../components/ProgressBar'
import FileUpload from '../components/FileUpload'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { FaFileAlt } from 'react-icons/fa'
import { storage } from '../firebase'
import { ref, deleteObject } from 'firebase/storage'
import { Console } from 'console'

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

  useEffect(() => {
    if (taskId) {
      fetch(`http://localhost:5183/api/Task/${taskId}`)
        .then((res) => res.json())
        .then((data) => {
          setTask(data)
          setSubtasks(data.subTasks?.$values || [])
        })
        .catch(() => setTask(undefined))
    }
  }, [taskId])

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

  useEffect(() => {
    if (subtasks.length > 0) {
      const fetchFiles = async () => {
        const filesMap: { [subTaskId: number]: any[] } = {}
        for (const subtask of subtasks) {
          const id = subtask.subTaskID
          if (!id) continue
          const res = await fetch(`http://localhost:5183/api/FileUpload/by-subtask/${id}`)
          const data = await res.json()
          const files = data.values?.$values || []
          filesMap[id] = files
        }
        setSubtaskFiles(filesMap)
      }
      fetchFiles()
    }
  }, [subtasks])

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
    } catch {
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
    } catch {
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

  // Delete file from both backend and Firebase Storage, and update subtask/task status if needed
  const handleDeleteFile = async (file: any, subtask: any) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return
    try {
      // 1. Delete from backend
      const res = await fetch(`http://localhost:5183/api/FileUpload/${file.fileUploadID}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Failed to delete file from database.')

      // 2. Delete from Firebase Storage
      if (file.filePath) {
        const storageRef = ref(storage, file.filePath)
        await deleteObject(storageRef)
      }

      // 3. Wait for backend to update, then check if all files for this subtask are now deleted
      const wait = (ms: number) => new Promise((res) => setTimeout(res, ms))
      let files = []
      for (let i = 0; i < 5; i++) {
        // Try up to 5 times
        const filesRes = await fetch(
          `http://localhost:5183/api/FileUpload/by-subtask/${subtask.subTaskID}`
        )
        const filesData = await filesRes.json()
        files = filesData.values?.$values || filesData.$values || filesData || []
        if (files.length === 0) break
        await wait(200)
      }
      if (files.length === 0) {
        // Subsubtask status to 0 (incomplete)
        const subStatusRes = await fetch(
          `http://localhost:5183/api/SubTask/${subtask.subTaskID}/status`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ SubTStatus: 0 })
          }
        )

        if (!subStatusRes.ok) {
          const errText = await subStatusRes.text()
          alert('Failed to update subtask status: ' + errText)
          return
        }

        // Recalculate and update parent task status
        const subtasksRes = await fetch(
          `http://localhost:5183/api/SubTask/by-task/${subtask.taskId}`
        )
        const subtasksData = await subtasksRes.json()
        const subtasks = Array.isArray(subtasksData) ? subtasksData : subtasksData.$values || []

        const completedCount = subtasks.filter((st: any) => Number(st.subTStatus) >= 1).length
        const totalCount = subtasks.length
        const newStatus = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

        const taskStatusRes = await fetch(
          `http://localhost:5183/api/Task/${subtask.taskId}/status`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
          }
        )
        if (!taskStatusRes.ok) {
          const errText = await taskStatusRes.text()
          alert('Failed to update task status: ' + errText)
          return
        }
      }
      window.location.reload()
    } catch (err) {
      alert('Failed to delete file.')
    }
  }

  return (
    <div className="h-screen overflow-y-auto flex justify-center items-start p-4 pt-20">
      <div className="max-w-8xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-6"
        >
          ← Back to Tasks
        </button>
        <div className="w-full bg-[#FFFFFF] rounded-3xl shadow-xl border border-gray-200 p-8">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-900 mb-4 font-[Manrope]">{task.title}</h1>
              <p className="text-sm text-gray-500 mb-4">
                📅 Due:{' '}
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleString('en-ZA', {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'No deadline set'}
              </p>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-blue-900 font-[Manrope] mb-2">
              📝 Description
            </h2>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {task.description || 'No description provided.'}
            </p>
          </div>
          <div className="flex flex-wrap md:flex-nowrap items-end gap-6 mb-10 text-sm">
            <div className="w-32">
              <span className="block text-gray-400 text-xs mb-1">Priority</span>
              <span
                className={`inline-block px-3 py-1 rounded-full font-medium text-xs ${priorityColor[task.priority]}`}
              >
                {PriorityLevel[task.priority]}
              </span>
            </div>

            <div className="w-32">
              <span className="block text-gray-400 text-xs mb-1">Project ID</span>
              <span className="text-sm text-blue-900 font-medium">{task.projectID}</span>
            </div>

            <div className="flex-1 min-w-[200px]">
              <span className="block text-gray-400 text-xs mb-1">Progress</span>
              <ProgressBar progress={task.status} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-lg font-semibold text-blue-900 font-[Manrope] mb-2">
                💬 Comments
              </h2>
              {commentsLoading ? (
                <p className="text-gray-400 text-sm">Loading comments...</p>
              ) : (
                <>
                  {comments.length === 0 ? (
                    <p className="text-sm italic text-gray-500">No comments yet.</p>
                  ) : (
                    <div className="space-y-4 mb-4">
                      {comments.map((c) => (
                        <div
                          key={c.commentID}
                          className="bg-gray-50 p-3 rounded-xl border border-gray-200"
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
                                  className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditId(null)}
                                  className="text-sm px-3 py-1 rounded border hover:bg-gray-100"
                                >
                                  Cancel
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="text-sm text-gray-800 whitespace-pre-line">
                                {c.content}
                              </p>
                              <div className="text-xs text-gray-400 mt-1 flex justify-between">
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
                </>
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

            <div>
              <h2 className="text-lg font-semibold text-blue-900 font-[Manrope] mb-4">
                🗂️ Subtasks
              </h2>
              {subtasks.length === 0 ? (
                <p className="text-sm italic text-gray-500">No subtasks for this task.</p>
              ) : (
                <ul className="space-y-4">
                  {subtasks.map((subtask) => {
                    console.log('Subtask:', subtask)
                    return (
                      <li
                        key={subtask.subTaskID}
                        className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-semibold block">
                              {subtask.title || subtask.name}
                            </span>
                            <span
                              className={`text-xs inline-block mt-1 px-2 py-1 rounded-full ${subtask.subTStatus >= 1 ? 'bg-green-200 text-green-800' : 'bg-gray-200'}`}
                            >
                              {subtask.subTStatus >= 1 ? 'Complete' : 'Incomplete'}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-700 space-y-1 mb-2">
                          {subtask.description && (
                            <div>
                              <strong>Description:</strong> {subtask.description}
                            </div>
                          )}
                          {subtask.dueDate && (
                            <div>
                              <strong>Due:</strong> {new Date(subtask.dueDate).toLocaleDateString()}
                            </div>
                          )}
                          {subtask.priority && (
                            <div>
                              <strong>Priority:</strong> {subtask.priority}
                            </div>
                          )}
                          {subtask.users?.length > 0 && (
                            <div>
                              <strong>Assigned:</strong>{' '}
                              {subtask.users.map((u: any) => u.userName).join(', ')}
                            </div>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 justify-center">
                          {(() => {
                            const files = subtaskFiles[subtask.subTaskID] || []
                            if (!files.length) {
                              return (
                                <span className="text-xs text-gray-400 italic">
                                  No file uploaded
                                </span>
                              )
                            }

                            return files.map((file: any, idx: number) => (
                              <div key={idx} className="relative group">
                                {/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.fileName) ? (
                                  <a
                                    href={file.filePath}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                  >
                                    <img
                                      src={file.filePath}
                                      alt={file.fileName}
                                      className="w-24 h-24 object-cover rounded border mb-1"
                                    />
                                    <div className="text-xs text-gray-700 max-w-[96px] truncate text-center">
                                      {file.fileName}
                                    </div>
                                  </a>
                                ) : (
                                  <a
                                    href={file.filePath}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center"
                                  >
                                    <FaFileAlt className="w-12 h-12 text-gray-400 mb-1" />
                                    <span className="text-xs text-gray-700 max-w-[96px] truncate text-center">
                                      {file.fileName}
                                    </span>
                                  </a>
                                )}

                                <button
                                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs opacity-80 hover:opacity-100 group-hover:block hidden"
                                  title="Delete file"
                                  onClick={async (e) => {
                                    e.preventDefault()
                                    await handleDeleteFile(file, subtask)
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            ))
                          })()}
                        </div>
                        <div className="mt-3 text-center">
                          <button
                            className={`text-white px-4 py-2 rounded ${subtaskFiles[subtask.subTaskID]?.length ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                            onClick={() => {
                              setActiveSubtask(subtask)
                              setShowUploadModal(true)
                            }}
                          >
                            {subtaskFiles[subtask.subTaskID]?.length ? 'Reupload' : 'Upload File'}
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* DaisyUI Modal for File Upload */}
          {showUploadModal && activeSubtask && (
            <dialog open className="modal">
              <div className="modal-box bg-[#EDF2F7] w-full max-w-lg">
                <form method="dialog">
                  <button
                    className="btn btn-sm btn-square btn-ghost border-2 text-center border-red-500 bg-red-500 hover:bg-white hover:text-red-500 font-light absolute right-2 top-2"
                    style={{ fontSize: 30 }}
                    onClick={() => setShowUploadModal(false)}
                    type="button"
                  >
                    ✕
                  </button>
                </form>
                <h2 className="text-center text-black font-bold text-2xl mb-8">Upload File</h2>
                <FileUpload
                  projectId={task.projectID}
                  taskId={task.taskId}
                  subTaskId={activeSubtask.subTaskID}
                  onFileUploaded={() => {
                    setShowUploadModal(false)
                    window.location.reload()
                  }}
                />
              </div>
            </dialog>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskDetails
