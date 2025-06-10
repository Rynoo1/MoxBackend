import React, { useState } from 'react'
import moxLoadingGif from '../assets/mox-loading.gif'
import { useNavigate } from 'react-router-dom'

// Define interfaces for our component
interface LoginFormValues {
  username: string
  email: string
  password: string
}

interface TwoFactorValues {
  code: string
  userId: string
}

interface LoginPageProps {
  onLoginSuccess?: (username: string) => void
  onSetError?: (error: string) => void
}

const LoginForm: React.FC<LoginPageProps> = ({ onLoginSuccess, onSetError }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false)
  const [loginValues, setLoginValues] = useState<LoginFormValues>({
    email: '',
    password: '',
    username: ''
  })
  const [TwoFactorValues, setTwoFactorValues] = useState<TwoFactorValues>({
    code: '',
    userId: ''
  })
  const navigate = useNavigate()

  // Handle input changes for login form
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setLoginValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleTwoFactorChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setTwoFactorValues((prev) => ({ ...prev, [name]: value }))
  }

  // Login Function
  const onLoginFinish = async (): Promise<void> => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5183/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Email: loginValues.email,
          Password: loginValues.password
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const data = await response.json()
      console.log(data) // Debug: see what backend returns

      // Use Id, userId, or id for userId
      const userId = data.userId || data.Id || data.id || ''
      if (userId) {
        localStorage.setItem('userId', userId)
      }

      if (data.twoFactorRequired) {
        localStorage.setItem('userEmail', loginValues.email)
        setTwoFactorValues((prev) => ({ ...prev, userId }))
        setShowTwoFactor(true)
        alert('2FA code was sent to your email!')
        return
      }

      // Handle successful login with token
      if (data.Token || data.token) {
        localStorage.setItem('token', data.Token || data.token)
        localStorage.setItem('userEmail', loginValues.email)

        localStorage.setItem('userRole', data.role || 'basic')
        alert('Login successful!')

        if (loginValues.email === 'ryno.debeer12@gmail.com') {
          localStorage.setItem('isAdmin', 'true')
        }
        // localStorage.setItem('isAdmin', data.IsAdmin?.toString() || 'false')

        if (data.IsAdmin) {
          alert('Welcome Admin!')
        } else {
          alert('Login successful!')
        }

        if (onLoginSuccess && loginValues.username) {
          onLoginSuccess(loginValues.username)
        }
        navigate('/')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
        if (onSetError) onSetError(error.message)
        alert(error.message)
      } else {
        setError('An unexpected error occurred')
        if (onSetError) onSetError('An unexpected error occurred')
        alert('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const onTwoFactorSubmit = async (): Promise<void> => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5183/api/user/login/2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: TwoFactorValues.userId,
          TwoFactorCode: TwoFactorValues.code
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || '2FA verification failed')
      }

      const data = await response.json()
      console.log(data) // Debug: see what backend returns

      // Use Id, userId, or id for userId

      if (data.token) {
        localStorage.setItem('token', data.token)

        localStorage.setItem('userRole', data.role || 'basic')
        alert('Login Successful!')

        localStorage.setItem('token', data.Token || data.token)

        if (loginValues.email === 'ryno.debeer12@gmail.com') {
          localStorage.setItem('isAdmin', 'true')
        }
        // localStorage.setItem('isAdmin', data.IsAdmin?.toString() || 'false')

        if (data.IsAdmin) {
          alert('Welcome Admin!')
        } else {
          alert('Login successful!')
        }

        navigate('/')
        if (onLoginSuccess && loginValues.username) {
          onLoginSuccess(loginValues.username)
        }

        setShowTwoFactor(false)
        setLoginValues({ email: '', password: '', username: '' })
        setTwoFactorValues({ code: '', userId: '' })
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
        if (onSetError) onSetError(error.message)
        alert(error.message)
      } else {
        setError('An unexpected error occurred')
        if (onSetError) onSetError('An unexpected error occurred')
        alert('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = (): void => {
    setShowTwoFactor(false)
    setLoginValues({ email: '', password: '', username: '' })
    setTwoFactorValues({ code: '', userId: '' })
    setError('')
  }

  if (showTwoFactor) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="card w-96 bg-white shadow-lg">
          <div className="text-center my-6">
            <h2 className="text-2xl font-bold">Two-Factor Authentication</h2>
            <p>Please enter the code sent to your email</p>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault()
              onTwoFactorSubmit()
            }}
          >
            <div className="form-group">
              <label className="fieldset-legend">Code</label>
              <input
                type="text"
                name="code"
                value={TwoFactorValues.code}
                onChange={handleTwoFactorChange}
                placeholder="Enter 2FA code"
                className="input input-bordered input-custom"
                required
              />
            </div>

            {/* Submit */}
            <button type="submit" className="register-btn w-full">
              Verify Code
            </button>

            {/* Back to Login */}
            <button
              type="button"
              onClick={handleBackToLogin}
              className="btn btn-secondary w-full mt-3"
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    )
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

  return (
    <form
      className="register-form space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        onLoginFinish()
      }}
    >
      {/* Email */}
      <div className="form-group">
        <label className="fieldset-legend">Email</label>
        <input
          type="email"
          name="email"
          value={loginValues.email}
          onChange={handleLoginChange}
          placeholder="Email"
          className="input input-bordered input-custom"
          required
        />
      </div>

      {/* Username */}
      <div className="form-group">
        <label className="fieldset-legend">Username</label>
        <input
          type="text"
          name="username"
          value={loginValues.username}
          onChange={handleLoginChange}
          placeholder="Username"
          className="input input-bordered input-custom"
          required
        />
      </div>

      {/* Password */}
      <div className="form-group">
        <label className="fieldset-legend">Password</label>
        <input
          type="password"
          name="password"
          value={loginValues.password}
          onChange={handleLoginChange}
          placeholder="Password"
          className="input input-bordered input-custom"
          required
        />
      </div>

      {/* Submit */}
      <button type="submit" className="register-btn w-full">
        Log In
      </button>
    </form>
  )
}

export default LoginForm
