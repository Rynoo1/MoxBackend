import React, { useState } from 'react'

interface Props {
  onRegister: (data: { email: string; username: string; password: string }) => void
}

const RegisterForm: React.FC<Props> = ({ onRegister }) => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onRegister({ email, username, password })
  }

  return (
    <form className="register-form space-y-5" onSubmit={handleSubmit}>
      {/* Full Name */}
      <div className="form-group">
        <label className="fieldset-legend">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input input-bordered input-custom"
          required
        />
      </div>

      <div className="form-group">
        <label className="fieldset-legend">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered input-custom"
          required
        />
      </div>

      <div className="form-group">
        <label className="fieldset-legend">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input input-bordered input-custom"
          required
        />
      </div>

      <button type="submit" className="register-btn">
        Sign Up
      </button>
    </form>
  )
}

export default RegisterForm
