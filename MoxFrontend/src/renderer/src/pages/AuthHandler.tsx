import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import moxLoadingGif from '../assets/mox-loading.gif'

interface AuthCallbackProps {}

const AuthHandler: React.FC<AuthCallbackProps> = () => {
  const [loading, setLoading] = useState(true)
  const [error, seterror] = useState<string | null>(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const processAuthCallback = async () => {
      try {
        const token = searchParams.get('token')
        const email = searchParams.get('email')
        const returnUrl = searchParams.get('returnUrl') || '/profile'

        if (!token || !email) {
          throw new Error('Missing authentication data')
        }

        localStorage.setItem('token', token)
        localStorage.setItem('userEmail', email)
        localStorage.setItem('isAuthenticated', 'true')

        await new Promise((resolve) => setTimeout(resolve, 1500))

        navigate(returnUrl, { replace: true })
      } catch (error) {
        console.error('Auth callback error:', error)
        seterror(error instanceof Error ? error.message : 'Authentication failed')
        setLoading(false)
      }
    }

    processAuthCallback()
  }, [searchParams, navigate])

  if (loading && !error) {
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
      <div className="flex flex-col justify-center items-center h-64" style={{ marginTop: '25%' }}>
        <div className="text-red-600 text-center">
          <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default AuthHandler
