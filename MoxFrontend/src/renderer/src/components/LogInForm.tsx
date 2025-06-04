import React, { useEffect, useState } from 'react'

// Define interfaces for our component
interface LoginFormValues {
  username: string
  email: string
  password: string
}

// interface RegisterFormValues {
//   email: string
//   username: string
//   password: string
//   twofac: boolean
// }

interface LoginPageProps {
  onLoginSuccess?: (username: string) => void
  onSetError?: (error: string) => void
}

const LoginForm: React.FC<LoginPageProps> = ({ onLoginSuccess, onSetError }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [activeTabKey, setActiveTabKey] = useState<string>('1')
  const [loginValues, setLoginValues] = useState<LoginFormValues>({
    email: '',
    password: '',
    username: ''
  })
  // const [registerValues, setRegisterValues] = useState<RegisterFormValues>({
  //   email: '',
  //   username: '',
  //   password: '',
  //   twofac: false
  // })

  // Handle input changes for login form
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setLoginValues((prev) => ({ ...prev, [name]: value }))
  }

  // Handle input changes for register form
  // const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target
  //   setRegisterValues((prev) => ({ ...prev, [name]: value }))
  // }

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
  // const handleTabChange = (key: string): void => {
  //   setActiveTabKey(key)
  //   window.location.hash = key === '1' ? 'login' : 'register'
  // }

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
          password: loginValues.password
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const data = await response.json()

      if (data.twoFactorEnabled) {
        localStorage.setItem('userEmail', data.email)
        localStorage.setItem('userId', data.userId)
        localStorage.setItem('twofac', JSON.stringify(true))
        return
      }

      if (!data.twoFactorEnabled && data.token) {
        localStorage.setItem('jwt', data.token)
      }

      alert('Login successful!')
      console.log(data)

      if (onLoginSuccess && loginValues.username) {
        onLoginSuccess(loginValues.username)
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

  // Register Function
  // const onRegisterFinish = async (): Promise<void> => {
  //   setLoading(true)
  //   setError('')

  //   try {
  //     const response = await fetch('http://localhost:5183/api/user/register', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         user: {
  //           email: registerValues.email,
  //           username: registerValues.username
  //         },
  //         password: registerValues.password
  //       })
  //     })

  //     if (!response.ok) {
  //       const errorData = await response.json()
  //       throw new Error(errorData.errors || 'Registration failed')
  //     }

  //     const data = await response.json()
  //     alert('Registration successful! Please check your email to verify your account.')
  //     console.log(data)

  //     setActiveTabKey('1')
  //     window.location.hash = 'login'
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       setError(error.message)
  //       if (onSetError) onSetError(error.message)
  //       alert(error.message)
  //     } else {
  //       setError('An unexpected error occurred')
  //       if (onSetError) onSetError('An unexpected error occurred')
  //       alert('An unexpected error occurred')
  //     }
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  return (
    // <div className="flex justify-center items-center min-h-screen bg-gray-100">
    //   <div className="card w-96 bg-white shadow-lg">
    // <div className="text-center my-6">
    //   <h2 className="text-2xl font-bold">Welcome</h2>
    //   <p>Account Access</p>
    // </div>

    // {error && (
    //   <div className="alert alert-error mb-4">
    //     <span>{error}</span>
    //   </div>
    // )}

    // <div className="tabs">
    //   <button
    //     className={`tab tab-bordered ${activeTabKey === '1' ? 'tab-active' : ''}`}
    //     onClick={() => handleTabChange('1')}
    //   >
    //     Login
    //   </button>
    //   <button
    //     className={`tab tab-bordered ${activeTabKey === '2' ? 'tab-active' : ''}`}
    //     onClick={() => handleTabChange('2')}
    //   >
    //     Register
    //   </button>
    // </div>

    // <div role="tablist" className="tabs">
    //   <a role="tab" className="tab">
    //     Tab 1
    //   </a>
    //   <a role="tab" className="tab tab-active">
    //     Tab 2
    //   </a>
    //   <a role="tab" className="tab">
    //     Tab 3
    //   </a>
    // </div>

    // {activeTabKey === '1' && (
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

      {/* Switch to Register */}
      {/* <div className="register-footer">
        <a href="#register">Don’t have an account? Register now</a>
      </div> */}
    </form>
    // )}
    //   </div>
    // </div>
  )
}

export default LoginForm
