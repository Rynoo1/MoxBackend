import React, { useEffect, useState } from 'react'

// Define interfaces for our component
interface LoginFormValues {
  username: string
  email: string
  password: string
}

interface RegisterFormValues {
  email: string
  username: string
  password: string
  twofac: boolean
}

interface LoginPageProps {
  onLoginSuccess?: (username: string) => void
}

const LoginForm: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [activeTabKey, setActiveTabKey] = useState<string>('1')
  const [loginValues, setLoginValues] = useState<LoginFormValues>({
    email: '',
    password: '',
    username: ''
  })
  const [registerValues, setRegisterValues] = useState<RegisterFormValues>({
    email: '',
    username: '',
    password: '',
    twofac: false
  })

  // Handle input changes for login form
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginValues((prev) => ({ ...prev, [name]: value }))
  }

  // Handle input changes for register form
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegisterValues((prev) => ({ ...prev, [name]: value }))
  }

  // Handle hash-based navigation
  useEffect(() => {
    const hash = window.location.hash
    if (hash === '#register') {
      setActiveTabKey('2')
    } else if (hash === '#login') {
      setActiveTabKey('1')
    }

    const handleHashChange = (): void => {
      const newHash = window.location.hash
      if (newHash === '#register') {
        setActiveTabKey('2')
      } else if (newHash === '#login') {
        setActiveTabKey('1')
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Handle tab changes
  const handleTabChange = (key: string): void => {
    setActiveTabKey(key)
    window.location.hash = key === '1' ? 'login' : 'register'
  }

  // Login Function
  const onLoginFinish = async (): Promise<void> => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5183/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: loginValues.email,
          password: loginValues.password
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const data = await response.json()

      if (data.twoFactorEnabled) {
        window.location.href = '/twofactor'
        return
      }

      alert('Login successful!')
      console.log(data)

      if (onLoginSuccess && loginValues.username) {
        onLoginSuccess(loginValues.username)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
        alert(error.message)
      } else {
        setError('An unexpected error occurred')
        alert('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  // Register Function
  const onRegisterFinish = async (): Promise<void> => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5183/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: {
            email: registerValues.email,
            username: registerValues.username
          },
          password: registerValues.password
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.errors || 'Registration failed')
      }

      const data = await response.json()
      alert('Registration successful! Please check your email to verify your account.')
      console.log(data)

      setActiveTabKey('1')
      window.location.hash = 'login'
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
        alert(error.message)
      } else {
        setError('An unexpected error occurred')
        alert('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="card w-96 bg-white shadow-lg">
        <div className="text-center my-6">
          <h2 className="text-2xl font-bold">Welcome</h2>
          <p>Account Access</p>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <div className="tabs">
          <button
            className={`tab tab-bordered ${activeTabKey === '1' ? 'tab-active' : ''}`}
            onClick={() => handleTabChange('1')}
          >
            Login
          </button>
          <button
            className={`tab tab-bordered ${activeTabKey === '2' ? 'tab-active' : ''}`}
            onClick={() => handleTabChange('2')}
          >
            Register
          </button>
        </div>
        <div role="tablist" className="tabs">
          <a role="tab" className="tab">
            Tab 1
          </a>
          <a role="tab" className="tab tab-active">
            Tab 2
          </a>
          <a role="tab" className="tab">
            Tab 3
          </a>
        </div>

        {activeTabKey === '1' && (
          <form
            className="p-4"
            onSubmit={(e) => {
              e.preventDefault()
              onLoginFinish()
            }}
          >
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="Email"
                value={loginValues.email}
                onChange={handleLoginChange}
                placeholder="Email"
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                name="Username"
                value={loginValues.username}
                onChange={handleLoginChange}
                placeholder="Username"
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="Password"
                value={loginValues.password}
                onChange={handleLoginChange}
                placeholder="Password"
                className="input input-bordered"
                required
              />
            </div>

            <button className={`btn btn-primary w-full ${loading ? 'loading' : ''}`} type="submit">
              Log in
            </button>

            <div className="text-center mt-4">
              <a href="#register" className="link">
                Don&apos;t have an account? Register now
              </a>
            </div>
          </form>
        )}

        {activeTabKey === '2' && (
          <form
            className="p-4"
            onSubmit={(e) => {
              e.preventDefault()
              onRegisterFinish()
            }}
          >
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={registerValues.email}
                onChange={handleRegisterChange}
                placeholder="Email"
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                name="username"
                value={registerValues.username}
                onChange={handleRegisterChange}
                placeholder="Username"
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={registerValues.password}
                onChange={handleRegisterChange}
                placeholder="Password"
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control mb-4">
              <label className="cursor-pointer flex items-center">
                <input type="checkbox" className="checkbox" />
                <span className="label-text ml-2">TwoFactor Authentication</span>
              </label>
            </div>

            <button className={`btn btn-primary w-full ${loading ? 'loading' : ''}`} type="submit">
              Register
            </button>

            <div className="text-center mt-4">
              <a href="#login" className="link">
                Already have an account? Login now
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default LoginForm
