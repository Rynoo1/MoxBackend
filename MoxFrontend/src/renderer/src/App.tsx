import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import KanbanBoard from './pages/KanbanBoard'
import Projects from './pages/Projects'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Tasks from './pages/Tasks'
import Sidebar from './components/Sidebar'
// import './styles/main.css'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
  }

  useEffect(() => {
    const root = document.documentElement // This targets <html>
    if (isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <div className="flex-1 ml-64 p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/kanban" element={<KanbanBoard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/tasks" element={<Tasks />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
