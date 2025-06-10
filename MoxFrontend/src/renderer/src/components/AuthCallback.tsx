import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import moxLoadingGif from '../assets/mox-loading.gif'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')
      const email = urlParams.get('email')
      const userId = urlParams.get('userId')
      const isAdmin = urlParams.get('isAdmin')

      if (token) {
        // Store auth data same way as your regular login
        localStorage.setItem('token', token)
        localStorage.setItem('userEmail', email || '')
        localStorage.setItem('userId', userId || '')
        localStorage.setItem('userRole', 'basic') // or get from params
        localStorage.setItem('isAdmin', isAdmin || 'false')

        // Show success message
        alert('Google login successful!')

        // Navigate to home
        navigate('/')
      } else {
        // Handle error
        alert('Google login failed')
        navigate('/auth')
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <img
        src={moxLoadingGif}
        alt="Processing login..."
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

export default AuthCallback
