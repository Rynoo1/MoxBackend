import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, useLocation, useParams } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import KanbanBoard from './pages/KanbanBoard'
import Projects from './pages/Projects'
import Settings from './pages/Settings'
import MoxAuth from './pages/MoxAuth'
import EditProject from './components/EditProject'
// import Login from './pages/Login';
// import Signup from './pages/Signup';
import { Sidebar } from './components/Sidebar'
import './styles/main.css'
import TaskDetails from './pages/TaskDetails'

const AppContent = () => {
  const location = useLocation()
  const hideSidebar = location.pathname === '/auth'

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
          <Route path="/projects" element={<Projects />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/auth" element={<MoxAuth />} />
          <Route path="/edit-project" element={<EditProject />} />
          <Route path="/task/:taskId" element={<TaskDetails />} />
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
