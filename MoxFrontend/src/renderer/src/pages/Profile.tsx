import React, { useEffect, useState } from 'react'
import 'react-day-picker/dist/style.css'
import '../styles/dashboard.css'
import { useAuth } from './useAuth'

interface User {
  Username: string
  ProfilePic: string
  Email: string
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

const ProfilePage: React.FC = () => {
  const { isAuthenticated, getAuthHeaders, logout, user: tokenUser } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [edit, setEdit] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      // REDIRECT TO LOGIN
      console.log('User not authenticated')
      return
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) return
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
          setUser(result.data)
        } else {
          throw new Error(result.message || 'Failed to load user profile')
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unexpected error occured')

        if (error instanceof Error && error.message.includes('Session expired')) {
          logout()
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [isAuthenticated, getAuthHeaders, logout])

  //TODO: HANDLE SAVE
  const handleSave = async() => {
    console.log('Saving user profile:', user)
    setEdit(false)
  }

  //TODO: HANDLE CANCEL
  const handleCancel = () => {
    setEdit(false)
  }

  //TODO: LOADING STATE
  if (loading) {
    return <div className="text-center mt-20">Loading...</div>
  }

  //TODO: ERROR STATE
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

  //   return (
  // <div className="w-full">
  //   <header className="flex justify-between items-center mt-30 bg-white shadow-md">
  //     <h1 className="text-4xl font-semibold">Profile</h1>
  //     <span className="text-gray-600">{formattedDate}</span>
  //   </header>

  //   <div className="divider divider-neutral"></div>

  //   <main className="px-6 py-4">
  //     {username && (
  //       <div className="text-center mb-10">
  //         <h2 className="text-3xl font-light">Welcome, {username}</h2>
  //       </div>
  //     )}

  //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-100 mb-10">
  //       <p className="text-4xl font-bold text-blue-600 mt-10">Profile Picture</p>
  //       <div className="avatar">
  //         <div className="w-24 h-24 rounded-full">
  //           <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
  //         </div>
  //       </div>
  //     </div>

  //     <div className="divider divider-neutral"></div>

  //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10 mt-10">
  //       <p className="text-4xl font-bold text-blue-600">Username</p>
  //       <p className="text-4xl font-bold text-blue-600">Username</p>
  //     </div>

  //     <div className="divider divider-neutral"></div>

  //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10 mt-10">
  //       <p className="text-4xl font-bold text-blue-600">Email</p>
  //       <p className="text-4xl font-bold text-blue-600">Email</p>
  //     </div>

  //     <div className="divider divider-neutral"></div>

  //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10 mt-10">
  //       <p className="text-4xl font-bold text-blue-600">Username</p>
  //       <p className="text-4xl font-bold text-blue-600">Username</p>
  //     </div>
  //   </main>
  // </div>

  //     <div className="w-full">
  //       <header className="flex justify-between items-center mt-30 bg-white shadow-md">
  //         <h1 className="text-4xl font-semibold">Profile</h1>
  //         <span className="text-gray-600">{formattedDate}</span>
  //       </header>

  //       <div className="divider divider-neutral"></div>

  //       <main className="px-6 py-4">
  //         {user?.Username && (
  //           <div className="text-center mb-10">
  //             <h2 className="text-3xl font-light">Welcome, {user.Username || tokenUser?.email}</h2>
  //           </div>
  //         )}

  //         <div className="grid grid-cols-1 sm:grid-cols-2 gap-100 mb-10 mt-5">
  //           <p className="text-4xl font-bold text-blue-600">Profile Picture</p>
  //           <input type="file" className="file-input file-input-ghost" />
  //         </div>

  //         <div className="divider divider-neutral"></div>

  //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-50 mb-10 mt-10">
  //           <p className="text-4xl font-bold text-blue-600">Username</p>
  //           <input
  //             type="text"
  //             required
  //             placeholder="Username"
  //             className="input input-ghost"
  //             value={user?.Username || ''}
  //             disabled={!edit}
  //             onChange={(e) =>
  //               setUser((prev) => (prev ? { ...prev, Username: e.target.value } : null))
  //             }
  //           />
  //         </div>

  //         <div className="divider divider-neutral"></div>

  //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-50 mb-10 mt-10">
  //           <p className="text-4xl font-bold text-blue-600">Email</p>
  //           <label className="input input-ghost validator">
  //             <svg
  //               className="h-[1em] opacity-50"
  //               xmlns="http://www.w3.org/2000/svg"
  //               viewBox="0 0 24 24"
  //             >
  //               <g
  //                 strokeLinejoin="round"
  //                 strokeLinecap="round"
  //                 strokeWidth="2.5"
  //                 fill="none"
  //                 stroke="currentColor"
  //               >
  //                 <rect width="20" height="16" x="2" y="4" rx="2"></rect>
  //                 <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  //               </g>
  //             </svg>
  //             <input
  //               type="email"
  //               placeholder="mail@site.com"
  //               required
  //               value={user?.Email || tokenUser?.email || ''}
  //               disabled={!edit}
  //               onChange={(e) =>
  //                 setUser((prev) => (prev ? { ...prev, Email: e.target.value } : null))
  //               }
  //             />
  //           </label>
  //           <div className="validator-hint hidden">Enter valid email address</div>
  //         </div>

  //         <div className="divider divider-neutral"></div>

  //         {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10 mt-10">
  //           <p className="text-4xl font-bold text-blue-600">Username</p>
  //           <p className="text-4xl font-bold text-blue-600">Username</p>
  //         </div> */}
  //       </main>
  //     </div>
  //   )
  // }

  if (edit) {
    // EDIT MODE - Complete edit layout
    return (
      <div className="w-full">
        <header className="flex justify-between items-center mt-30 bg-white shadow-md">
          <h1 className="text-4xl font-semibold">Edit Profile</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{formattedDate}</span>
            <div className="flex gap-2">
              <button onClick={handleSave} className="btn btn-success">
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
          {user?.Username && (
            <div className="text-center mb-10">
              <h2 className="text-3xl font-light">Editing {user.Username}'s Profile</h2>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-100 mb-10 mt-5">
            <p className="text-4xl font-bold text-blue-600">Profile Picture</p>
            <input type="file" className="file-input file-input-ghost" />
          </div>

          <div className="divider divider-neutral"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-50 mb-10 mt-10">
            <p className="text-4xl font-bold text-blue-600">Username</p>
            <input
              type="text"
              required
              placeholder="Username"
              className="input input-ghost"
              value={user?.Username || ''}
              onChange={(e) =>
                setUser((prev) => (prev ? { ...prev, Username: e.target.value } : null))
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

  // DISPLAY MODE - Complete display layout
  return (
    <div className="w-full">
      <header className="flex justify-between items-center mt-30 bg-white shadow-md">
        <h1 className="text-4xl font-semibold">Profile</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{formattedDate}</span>
          <button onClick={() => setEdit(true)} className="btn btn-primary">
            Edit Profile
          </button>
        </div>
      </header>

      <div className="divider divider-neutral"></div>

      <main className="px-6 py-4">
        {user?.Username && (
          <div className="text-center mb-10">
            <h2 className="text-3xl font-light">Welcome, {user.Username}</h2>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-100 mb-10">
          <p className="text-4xl font-bold text-blue-600 mt-10">Profile Picture</p>
          <div className="avatar">
            <div className="w-24 h-24 rounded-full">
              <img
                src={
                  user?.ProfilePic ||
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
          <p className="text-4xl font-bold text-gray-800">{user?.Username}</p>
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