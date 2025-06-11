import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import KanbanBoard from './pages/KanbanBoard'
import Projects from './pages/Projects'
import Settings from './pages/Settings'
import MoxAuth from './pages/MoxAuth'
import EditProject from './components/EditProject'
import Sidebar from './components/Sidebar'
import './styles/main.css'
import TaskDetails from './pages/TaskDetails'
import ProfilePage from './pages/Profile'
import UserManagement from './pages/UserManagement'
import { AuthProvider } from './pages/AuthContext'
import Analytics from './pages/Analytics'
import AuthCallback from './components/AuthCallback'
import PrivateRoute from './components/PrivateRoute'
import EmerencyMeeting from './pages/EmergencyMeeting'
import AuthHandler from './pages/AuthHandler'

const AppContent = () => {
  const location = useLocation()
  const hideSidebar = location.pathname === '/auth'
  const userId = localStorage.getItem('userId') || ''
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  const [isDarkMode, setIsDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('fontSize') || 'normal')

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev)

  useEffect(() => {
    const root = document.documentElement
    isDarkMode ? root.classList.add('dark') : root.classList.remove('dark')
  }, [isDarkMode])

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize)
    document.body.classList.remove('font-normal', 'font-large', 'font-xl')
    document.body.classList.add(`font-${fontSize}`)
  }, [fontSize])

  return (
    <div className="flex min-h-screen">
      {!hideSidebar && <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
      <div className={`${!hideSidebar ? 'ml-64' : ''} flex-1 p-4`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/auth" element={<MoxAuth />} />
          <Route path="/auth-callback" element={<AuthCallback />} />
          <Route path="/auth-handler" element={<AuthHandler />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/kanban"
            element={
              <PrivateRoute>
                <KanbanBoard />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <PrivateRoute>
                <Projects isAdmin={isAdmin} userId={userId} />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-project"
            element={
              <PrivateRoute>
                <EditProject />
              </PrivateRoute>
            }
          />
          <Route
            path="/task/:taskId"
            element={
              <PrivateRoute>
                <TaskDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/userman"
            element={
              <PrivateRoute>
                <UserManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <PrivateRoute>
                <Analytics isAdmin={isAdmin} userId={userId} />
              </PrivateRoute>
            }
          />
          <Route
            path="/emergency-meeting"
            element={
              <PrivateRoute>
                <EmerencyMeeting />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  )
}

function App(): React.ReactElement {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
