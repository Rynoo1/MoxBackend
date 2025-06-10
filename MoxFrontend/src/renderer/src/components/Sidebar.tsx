import React from 'react'
import { Link } from 'react-router-dom'
import {
  HomeIcon,
  FolderIcon,
  Squares2X2Icon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  UsersIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/solid'
import './styles/Sidebar.css'
import logo from '../assets/logo.svg'

interface SidebarProps {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <div className={`sidebar ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <ul className="sidebar-nav">
        <li>
          <Link to="/" className="nav-link">
            <HomeIcon className="mr-2 h-5 w-5" />
            Home
          </Link>
        </li>
        <li>
          <Link to="/projects" className="nav-link">
            <FolderIcon className="mr-2 h-5 w-5" />
            Projects
          </Link>
        </li>
        <li>
          <Link to="/kanban" className="nav-link">
            <Squares2X2Icon className="mr-2 h-5 w-5" />
            Kanban Board
          </Link>
        </li>
        <li>
          <Link to="/analytics" className="nav-link">
            <ChartBarIcon className="mr-2 h-5 w-5" />
            Analytics
          </Link>
        </li>
        <li>
          <Link to="/settings" className="nav-link">
            <Cog6ToothIcon className="mr-2 h-5 w-5" />
            Settings
          </Link>
        </li>
        <li>
          <Link to="/emergency-meeting" className="nav-link">
            <ChartBarIcon className="mr-2 h-5 w-5" />
            Emergency Meeting
          </Link>
        </li>
        <li>
          <Link to="/profile" className="nav-link">
            <UserCircleIcon className="mr-2 h-5 w-5" />
            Profile
          </Link>
        </li>
        <li>
          <Link to="/userman" className="nav-link">
            <UsersIcon className="mr-2 h-5 w-5" />
            User Management
          </Link>
        </li>
        <li className="nav-link w-full text-left flex items-center space-x-2">
          <button
            onClick={toggleDarkMode}
            className="flex items-center space-x-2 focus:outline-none"
          >
            {isDarkMode ? (
              <>
                <SunIcon className="mr-2 h-5 w-5" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <MoonIcon className="mr-2 h-5 w-5" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </li>
        <li>
          <Link to="/auth" className="nav-link">
            <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" />
            Logout
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
