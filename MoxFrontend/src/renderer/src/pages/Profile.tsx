import React, { useEffect, useState } from 'react'
import 'react-day-picker/dist/style.css'
import '../styles/dashboard.css'
import { useAuth } from './useAuth'
import { storage } from '../firebase'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import moxLoadingGif from '../assets/mox-loading.gif'

interface User {
  UserName: string
  ProfilePicture: string
  Email: string
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

const ProfilePage: React.FC = () => {
  const { isAuthenticated, getAuthHeaders, logout, isLoading, user: tokenUser } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [edit, setEdit] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [originalUser, setOriginalUser] = useState<User | null>(null)

  // Handle profile picture upload to Firebase and update backend
  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files ? e.target.files[0] : null
    setUploading(true)
    try {
      if (!file || !user) {
        setUploading(false)
        return
      }

      // If user has an existing Firebase profile photo, delete it first
      if (user.ProfilePicture && user.ProfilePicture.includes('firebase')) {
        try {
          // Extract the path from the URL
          const url = new URL(user.ProfilePicture)
          // Firebase Storage URLs have the path after '/o/', but encoded
          const pathMatch = url.pathname.match(/\/o\/(.+)$/)
          const encodedPath = pathMatch ? pathMatch[1] : ''
          const filePath = decodeURIComponent(encodedPath)
          if (filePath) {
            const oldRef = ref(storage, filePath)
            await deleteObject(oldRef)
          }
        } catch (deleteErr) {
          // Ignore delete errors, just log
          console.warn('Failed to delete old profile picture:', deleteErr)
        }
      }

      // Upload new photo to Firebase Storage
      const storageRef = ref(storage, `profile-pics/${user.UserName}_${file.name}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)

      // Update local state
      setUser((prev) => (prev ? { ...prev, ProfilePicture: url } : prev))

      // Update backend with new profile picture URL
      await fetch('http://localhost:5183/api/user/updateProfilePic', {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profilePicture: url })
      })
    } catch (error) {
      alert('Failed to upload profile picture')
    }
    setUploading(false)
  }

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      // Handle redirect to login here if needed
      return
    }
  }, [isAuthenticated, isLoading])

  useEffect(() => {
    if (isLoading || !isAuthenticated) return
    const fetchUserProfile = async (): Promise<void> => {
      try {
        setLoading(true)
        setError(null)
        const headers = getAuthHeaders()
        const response = await fetch('http://localhost:5183/api/user/profile', {
          method: 'GET',
          headers
        })
        if (response.status === 401) {
          logout()
          throw new Error('Session expired. Please log in again.')
        }
        if (!response.ok) {
          throw new Error('Failed to fetch user profile')
        }
        const result: ApiResponse<User> = await response.json()
        if (result.success) {
          setUser({
            UserName: result.data.UserName,
            Email: result.data.Email,
            ProfilePicture: result.data.ProfilePicture || ''
          })
        } else {
          throw new Error(result.message || 'Failed to load user profile')
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unexpected error occured')
      } finally {
        setLoading(false)
      }
    }
    fetchUserProfile()
  }, [isAuthenticated, isLoading, getAuthHeaders, logout])

  const handleSave = async (): Promise<void> => {
    if (!user) return
    try {
      const response = await fetch('http://localhost:5183/api/user/profile', {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: user.UserName,
          email: user.Email,
          profilePicture: user.ProfilePicture
        })
      })
      if (!response.ok) {
        const data = await response.json()
        alert(data.message || 'Failed to save profile')
        return
      }
      setEdit(false)
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again later.')
    }
  }

  const handleCancel = (): void => {
    setUser(originalUser)
    setEdit(false)
  }

  const handleDelete = async (): Promise<{ success: boolean, shouldLogout?: boolean }> => {
    const token = localStorage.getItem('token')

    const response = await fetch('http://localhost:5183/api/user/profile', {
      method: 'Delete',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const result = await response.json()
      return { success: true, shouldLogout: result.data?.shouldLogout };
    }

    return { success: false }
  }

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

  if (error) {
    return (
      <div className="w-full flex justify-center items-center min-h-screen">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

  if (edit) {
    // EDIT MODE
    return (
      <div className="w-full">
        <header className="flex justify-between items-center mt-30 bg-white shadow-md">
          <h1 className="text-4xl font-semibold">Edit Profile</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{formattedDate}</span>
            <div className="flex gap-2">
              <button onClick={handleSave} className="btn btn-primary">
                Save
              </button>
              <button onClick={handleCancel} className="btn btn-outline">
                Cancel
              </button>
            </div>
          </div>
        </header>

        <div className="divider divider-neutral"></div>

        <main className="px-6 py-4">
          {user?.UserName && (
            <div className="text-center mb-10">
              <h2 className="text-3xl font-light">Editing {user.UserName}&apos;s Profile</h2>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-100 mb-10 mt-5">
            <p className="text-4xl font-bold text-blue-600">Profile Picture</p>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-ghost"
              onChange={handleProfilePicChange}
              disabled={uploading}
            />
            {uploading && <span>Uploading...</span>}
          </div>

          <div className="divider divider-neutral"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-50 mb-10 mt-10">
            <p className="text-4xl font-bold text-blue-600">Username</p>
            <input
              type="text"
              required
              placeholder="Username"
              className="input input-ghost"
              value={user?.UserName || ''}
              onChange={(e) =>
                setUser((prev) => (prev ? { ...prev, UserName: e.target.value } : null))
              }
            />
          </div>

          <div className="divider divider-neutral"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-50 mb-10 mt-10">
            <p className="text-4xl font-bold text-blue-600">Email</p>
            <label className="input input-ghost validator">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </g>
              </svg>
              <input
                type="email"
                placeholder="mail@site.com"
                required
                value={user?.Email || tokenUser?.email || ''}
                onChange={(e) =>
                  setUser((prev) => (prev ? { ...prev, Email: e.target.value } : null))
                }
              />
            </label>
            <div className="validator-hint hidden">Enter valid email address</div>
          </div>

          <div className="divider divider-neutral"></div>
        </main>
      </div>
    )
  }

  // DISPLAY MODE
  return (
    <div className="w-full">
      <header className="flex justify-between items-center mt-30 bg-white shadow-md">
        <h1 className="text-4xl font-semibold">Profile</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{formattedDate}</span>
          <button
            onClick={() => {
              setOriginalUser(user)
              setEdit(true)
            }}
            className="btn btn-primary"
          >
            Edit Profile
          </button>
          <button
            onClick={() => {
              handleDelete()
            }}
            className="btn btn-outline btn-error"
          >
            Delete Profile
          </button>
        </div>
      </header>

      <div className="divider divider-neutral"></div>

      <main className="px-6 py-4">
        {user?.UserName && (
          <div className="text-center mb-10">
            <h2 className="text-3xl font-light">Welcome, {user.UserName}</h2>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-100 mb-10">
          <p className="text-4xl font-bold text-blue-600 mt-10">Profile Picture</p>
          <div className="avatar">
            <div className="w-24 h-24 rounded-full">
              <img
                src={
                  user?.ProfilePicture ||
                  'https://img.daisyui.com/images/profile/demo/yellingcat@192.webp'
                }
                alt="Profile"
              />
            </div>
          </div>
        </div>

        <div className="divider divider-neutral"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10 mt-10">
          <p className="text-4xl font-bold text-blue-600">Username</p>
          <p className="text-4xl font-bold text-gray-800">{user?.UserName}</p>
        </div>

        <div className="divider divider-neutral"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10 mt-10">
          <p className="text-4xl font-bold text-blue-600">Email</p>
          <p className="text-4xl font-bold text-gray-800">{user?.Email || tokenUser?.email}</p>
        </div>

        <div className="divider divider-neutral"></div>
      </main>
    </div>
  )
}

export default ProfilePage
