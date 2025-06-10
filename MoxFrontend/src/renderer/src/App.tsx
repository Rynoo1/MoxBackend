import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import KanbanBoard from './pages/KanbanBoard'
import Projects from './pages/Projects'
import Settings from './pages/Settings'
import MoxAuth from './pages/MoxAuth'
import EditProject from './components/EditProject'
// import Login from './pages/Login';
// import Signup from './pages/Signup';
import Sidebar from './components/Sidebar'
import './styles/main.css'
import TaskDetails from './pages/TaskDetails'
import ProfilePage from './pages/Profile'
import UserManagement from './pages/UserManagement'
import { AuthProvider } from './pages/AuthContext'
import Analytics from './pages/Analytics'

const AppContent = () => {
  const location = useLocation()
  const hideSidebar = location.pathname === '/auth'
  const userRole = localStorage.getItem('userRole') || 'basic'
  const userId = Number(localStorage.getItem('userId')) || 0

  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
  }

  useEffect(() => {
    const root = document.documentElement
    if (isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <div className="flex min-h-screen">
      {!hideSidebar && <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
      <div className={`${!hideSidebar ? 'ml-64' : ''} flex-1 p-4`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/kanban" element={<KanbanBoard />} />
          <Route path="/projects" element={<Projects userRole={userRole} userId={userId} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/auth" element={<MoxAuth />} />
          <Route path="/edit-project" element={<EditProject />} />
          <Route path="/task/:taskId" element={<TaskDetails />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/userman" element={<UserManagement />} />
          <Route path="/analytics" element={<Analytics userRole="admin" userId={''} />} />
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
