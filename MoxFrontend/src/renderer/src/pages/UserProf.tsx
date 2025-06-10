import React, { useEffect, useState } from 'react'
import 'react-day-picker/dist/style.css'
import '../styles/dashboard.css'
import { useAuth } from './useAuth'
import { storage } from '../firebase'
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

  const userId = localStorage.getItem('navUserId')

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      // Handle redirect to login here if needed
      return
    }
  }, [isAuthenticated, isLoading])

  useEffect(() => {
    if (!userId || isLoading || !isAuthenticated) return
    const fetchUserProfileById = async (id: string): Promise<void> => {
      try {
        setLoading(true)
        setError(null)
        const headers = getAuthHeaders()
        const response = await fetch(`http://localhost:5183/api/user/profile/${id}`, {
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
    fetchUserProfileById(userId)
  }, [userId, isAuthenticated, isLoading, getAuthHeaders, logout])

  const adminDelete = async (id: string): Promise<boolean> => {
    const token = localStorage.getItem('token')

    const response = await fetch(`http://localhost:5183/api/user/admin/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    return response.ok
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

  // DISPLAY MODE
  return (
    <div className="w-full">
      <header className="flex justify-between items-center mt-30 bg-white shadow-md">
        <h1 className="text-4xl font-semibold">Profile</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{formattedDate}</span>
          {localStorage.getItem('isAdmin') === 'true' && userId && (
            <button
              onClick={() => {
                adminDelete(userId)
              }}
              className="btn btn-outline btn-error"
            >
              Delete Profile
            </button>
          )}
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
