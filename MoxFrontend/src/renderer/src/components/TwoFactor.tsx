import React, { useState } from 'react'

const TwoFactorCard: React.FC = () => {
  const [code, setCode] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    const userId = localStorage.getItem('userId') || ''

    try {
      const response = await fetch('http://localhost:5183/api/login/2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          twoFactorCode: code
        })
      })

      if (!response.ok) {
        throw new Error('Invalid code')
      }

      const data = await response.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('isLoggedIn', 'true')

      alert('2FA Successful! You are now logged in')
      window.location.href = '/home'
    } catch (error) {
      const handleError = (error: unknown): string => {
        if (error instanceof Error) {
          return error.message
        }
        return 'An unexpected error occured'
      }
      alert(handleError(error))
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="card w-96 bg-white shadow-lg p-4" onSubmit={handleSubmit}>
        <h2 className="text-center text-2xl font-bold mb-4">Two-Factor Authentication</h2>
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Enter 2FA Code</span>
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="2FA Code"
            className="input input-bordered"
            required
          />
        </div>
        <button className="btn btn-primary w-full" type="submit">
          Verify
        </button>
      </form>
    </div>
  )
}

export default TwoFactorCard
