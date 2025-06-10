import React, { useRef, useState } from 'react'
import { storage } from '../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

interface FileUploadProps {
  projectId: number | string
  taskId: number | string
  subTaskId: number | string
  onFileUploaded?: () => void
}

const FileUpload: React.FC<FileUploadProps> = ({
  projectId,
  taskId,
  subTaskId,
  onFileUploaded
}) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChooseFiles = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files)
    setError(null)
  }

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setError('Please select at least one file.')
      return
    }
    setUploading(true)
    setError(null)
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        // 1. Upload file to Firebase Storage
        const storagePath = `uploads/${projectId}/${subTaskId}/${file.name}`
        const storageRef = ref(storage, storagePath)
        await uploadBytes(storageRef, file)
        const downloadURL = await getDownloadURL(storageRef)

        // 2. Save file info to your backend
        const res = await fetch('http://localhost:5183/api/FileUpload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            subTaskId,
            fileName: file.name,
            filePath: downloadURL
          })
        })
        if (!res.ok) throw new Error('Failed to save file info to backend.')
      }

      // 3. Mark subtask as complete (subTStatus = 1)
      await fetch(`http://localhost:5183/api/SubTask/${subTaskId}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ SubTStatus: 1 })
      })

      // 4. Update parent task status
      const subtasksRes = await fetch(`http://localhost:5183/api/SubTask/by-task/${taskId}`)
      const subtasksData = await subtasksRes.json()
      const subtasks = Array.isArray(subtasksData) ? subtasksData : subtasksData.$values || []
      const completedCount = subtasks.filter((st: any) => Number(st.subTStatus) >= 1).length
      const totalCount = subtasks.length
      if (totalCount > 0) {
        const newStatus = Math.round((completedCount / totalCount) * 100)
        await fetch(`http://localhost:5183/api/Task/${taskId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        })
      }

      if (onFileUploaded) onFileUploaded()
      setSelectedFiles(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err: any) {
      setError(err.message || 'File upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 bg-white rounded-2xl shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-center">Upload Files</h2>
      <div className="w-full max-w-2xl">
        <div className="border border-gray-300 rounded-2xl p-8 flex flex-col items-center bg-white transition-shadow duration-200 shadow-sm hover:shadow-lg">
          <div className="mb-4 flex flex-col items-center">
            <svg width="56" height="56" fill="none" viewBox="0 0 24 24">
              <rect width="24" height="24" rx="4" fill="#E5E7EB" />
              <path
                d="M12 16V8M12 8L8 12M12 8l4 4"
                stroke="#374151"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-semibold text-lg mb-1">Drag &amp; Drop your files here</p>
            <p className="text-gray-500 mb-4">
              {navigator.onLine ? 'You are online.' : 'Oops! Internet is disconnected.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleChooseFiles}
            className="hover:!text-[#1E3A8A] hover:bg-white bg-[#1E3A8A] border-2 border-[#1E3A8A] text-white font-semibold py-2 px-8 rounded-xl text-lg mb-2 transition"
            disabled={uploading}
          >
            Choose files
          </button>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {selectedFiles && (
            <div className="mt-4 w-full text-center">
              <p className="text-sm font-semibold mb-2">Selected files:</p>
              <ul className="text-sm text-gray-700">
                {Array.from(selectedFiles).map((file) => (
                  <li key={file.name}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
          {uploading && <div className="text-blue-600 mt-4">Uploading...</div>}
          {error && <div className="text-red-600 mt-4">{error}</div>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mt-10">
        <button
          className="border-2 border-[#1E3A8A] text-[#1E3A8A] font-semibold py-3 rounded-xl text-lg hover:bg-[#1E3A8A] hover:text-white transition"
          type="button"
          onClick={() => {
            setSelectedFiles(null)
            setError(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
            if (onFileUploaded) onFileUploaded()
          }}
          disabled={uploading}
        >
          Cancel
        </button>
        <button
          className="bg-[#1E3A8A] text-white font-semibold py-3 rounded-xl text-lg border-2 border-[#1E3A8A] hover:!text-[#1E3A8A] hover:bg-white transition"
          type="button"
          onClick={handleUpload}
          disabled={uploading}
        >
          Attach File
        </button>
      </div>
    </div>
  )
}

export default FileUpload
