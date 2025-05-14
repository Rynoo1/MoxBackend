import React from "react";
import { Link } from "react-router-dom";
import {
  HouseDoor as HomeIcon,
  Folder as FolderIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  BoxArrowRight as LogoutIcon,
  Calendar as TimelineIcon,
} from "react-bootstrap-icons";
import "./styles/Sidebar.css";
import logo from "../assets/logo.svg";

interface SidebarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <div className={`sidebar ${isDarkMode ? "dark-mode" : ""}`}>
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
            <TimelineIcon className="mr-2 h-5 w-5" />
            Kanban Board
          </Link>
        </li>
        <li>
          <button
            onClick={toggleDarkMode}
            className="nav-link w-full text-left"
          >
            {isDarkMode ? (
              <>
                <SunIcon className="mr-2 h-5 w-5" />
                Light Mode
              </>
            ) : (
              <>
                <MoonIcon className="mr-2 h-5 w-5" />
                Dark Mode
              </>
            )}
          </button>
        </li>
        <li>
          <Link to="/logout" className="nav-link">
            <LogoutIcon className="mr-2 h-5 w-5" />
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
