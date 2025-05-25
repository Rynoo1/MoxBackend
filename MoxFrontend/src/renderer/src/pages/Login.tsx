import React from 'react'
import LogInForm from '../components/LogInForm'

const LoginPage: React.FC = () => {
  return (
    <div className="bg-red-500 text-white p-4">
      <LogInForm />
      {/* Test Tailwind css
      <button className="btn btn-primary"> Test Button </button> */}
    </div>
  )
}

export default LoginPage
