import { Navigate } from 'react-router-dom'
import { useAuth } from '../pages/useAuth'

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <div className="p-10 text-center">Loading...</div>

  return isAuthenticated ? children : <Navigate to="/auth" replace />
}

export default PrivateRoute
