import React, { useRef, useState } from 'react'
import { storage } from '../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { FaFileAlt } from 'react-icons/fa'

interface FileUploadProps {
  projectId: number
  subTaskId?: number
  onFileUploaded?: () => void
}

const FileUpload: React.FC<FileUploadProps> = ({ projectId, subTaskId, onFileUploaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)
  const [urls, setUrls] = useState<string[]>([])
  const [filePreviews, setFilePreviews] = useState<string[]>([])

  const handleChooseFiles = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files)
    if (e.target.files) {
      const previews = Array.from(e.target.files).map((file) =>
        file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
      )
      setFilePreviews(previews)
    }
  }

  const handleUpload = async () => {
    if (!selectedFiles) return
    setUploading(true)
    const uploadedUrls: string[] = []
    for (const file of Array.from(selectedFiles)) {
      const storageRef = ref(storage, `uploads/${file.name}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      uploadedUrls.push(url)

      // Log the subTaskId before building the payload
      console.log('subTaskId being sent:', subTaskId)

      // Prepare the payload
      const payload = {
        projectID: projectId,
        subTaskID: subTaskId, // <-- lowercase 's'
        filePath: url,
        fileName: file.name,
        uploadDate: new Date().toISOString()
      }

      // Log the payload as a string
      alert('Payload to backend: ' + JSON.stringify(payload))

      // Notify the backend about the new file
      try {
        await fetch('http://localhost:5183/api/FileUpload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } catch (err) {
        console.error('File upload error:', err)
      }

      // Mark subtask as complete if subTaskId is provided
      if (subTaskId) {
        // If you want to send a payload, uncomment below and update your backend to accept a body:
        // const completePayload = { subTStatus: 1, completedDate: new Date().toISOString() }
        // console.log('Payload to mark subtask complete:', JSON.stringify(completePayload))
        // await fetch(`http://localhost:5183/api/SubTask/${subTaskId}/complete`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(completePayload)
        // })

        // Current: just log and send PUT with no body
        console.log(
          `Marking subtask complete: PUT http://localhost:5183/api/SubTask/${subTaskId}/complete`
        )
        await fetch(`http://localhost:5183/api/SubTask/${subTaskId}/complete`, {
          method: 'PUT'
        })
      }
    }
    setUrls(uploadedUrls)
    setUploading(false)
    alert('Upload complete!')
    if (onFileUploaded) onFileUploaded()
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 bg-white rounded-2xl shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-center">Upload Files</h2>
      <div className="w-full max-w-2xl">
        <div className="border border-gray-300 rounded-2xl p-8 flex flex-col items-center bg-white transition-shadow duration-200 shadow-sm hover:shadow-lg">
          {/* Show selected file icons/previews */}
          {selectedFiles && (
            <div className="mb-4 flex flex-wrap gap-4 justify-center">
              {Array.from(selectedFiles).map((file, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  {file.type.startsWith('image/') && filePreviews[idx] ? (
                    <img
                      src={filePreviews[idx]}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded mb-1 border"
                    />
                  ) : (
                    <FaFileAlt className="w-12 h-12 text-gray-400 mb-1" />
                  )}
                  <span className="text-xs text-gray-700 max-w-[80px] truncate">{file.name}</span>
                </div>
              ))}
            </div>
          )}
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
            <p className="text-gray-500 mb-4">Choose files to upload to Firebase Storage.</p>
          </div>
          <button
            type="button"
            onClick={handleChooseFiles}
            className="hover:!text-[#1E3A8A] hover:bg-white bg-[#1E3A8A] border-2 border-[#1E3A8A] text-white font-semibold py-2 px-8 rounded-xl text-lg mb-2 transition"
          >
            Choose files
          </button>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mt-10">
        <button className="border-2 border-[#1E3A8A] text-[#1E3A8A] font-semibold py-3 rounded-xl text-lg hover:bg-[#1E3A8A] hover:text-white transition">
          Cancel
        </button>
        <button
          className="bg-[#1E3A8A] text-white font-semibold py-3 rounded-xl text-lg border-2 border-[#1E3A8A] hover:!text-[#1E3A8A] hover:bg-white transition"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Attach File'}
        </button>
      </div>
      {urls.length > 0 && (
        <div className="mt-6 w-full">
          <h3 className="font-semibold mb-2">Uploaded Files:</h3>
          <ul>
            {urls.map((url, idx) => (
              <li key={idx}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default FileUpload
