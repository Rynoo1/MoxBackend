import React, { useState } from 'react'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import bg from '../assets/Auth_Background.jpg'
import logo from '../assets/logo.svg'
import '../styles/Auth.css'

const MoxAuth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')

  const handleRegister = async (data: { email: string; username: string; password: string }) => {
    try {
      const res = await fetch('http://localhost:5183/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { email: data.email, username: data.username },
          password: data.password
        })
      })

      if (!res.ok) throw new Error('Registration failed')
      alert('Registration successful!')
      setActiveTab('login')
    } catch (err) {
      alert((err as Error).message)
    }
  }

  return (
    <div
      className="flex w-full min-h-screen"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* LEFT SIDE */}
      <div className="grow flex flex-col justify-center items-center px-10">
        <img src={logo} alt="Mox Logo" className="w-48 mb-8" />

        {/* Tabs */}
        <div className="tabs tabs-bordered flex justify-center mb-6 w-full max-w-sm">
          <button
            className={`tab w-1/2 ${activeTab === 'login' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`tab w-1/2 ${activeTab === 'register' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {/* Form + Google */}
        <div className="w-full max-w-md space-y-6">
          {activeTab === 'login' ? (
            <LoginForm />
          ) : (
            <>
              <RegisterForm onRegister={handleRegister} />
              <div className="form-control mt-4 flex flex-row items-start gap-2">
                <input type="checkbox" className="checkbox validator" required id="terms" />
                <label htmlFor="terms" className="label cursor-pointer">
                  <span className="label-text font-medium">
                    I’ve read and I agree with your Terms &amp; Conditions
                  </span>
                </label>
              </div>
            </>
          )}

          {/* Google Auth Button */}
          <button className="btn google-btn w-full flex items-center justify-center gap-2">
            <svg
              aria-label="Google logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <g>
                <path d="m0 0H512V512H0" fill="#fff" />
                <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
                <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
                <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
                <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
              </g>
            </svg>
            Login with Google
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="grow flex items-center justify-center px-10">
        <div className="welcome-message">
          <div className="text-wrapper text-5xl font-bold text-center text-blue-900 mb-4">
            {activeTab === 'login' ? 'Welcome Back' : 'Welcome to Mox'}
          </div>
          <div className="div text-2xl font-medium text-center text-gray-700">
            {activeTab === 'login' ? 'Sign in to continue' : 'Register your account'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoxAuth
