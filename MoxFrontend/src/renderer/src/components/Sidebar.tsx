import React, { useState, useEffect } from "react";
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

const Sidebar: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("theme") === "dark");

  const toggleDarkMode = () => {
    const newMode = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newMode);
    document.body.classList.toggle("dark-mode", !isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>

      <ul className="sidebar-nav">
        <li>
          <Link to="/" className="nav-link hover:bg-base-300 p-2 rounded-md">
            <HomeIcon className="mr-2 h-5 w-5" />
            Home
          </Link>
        </li>
        <li>
          <Link to="/projects" className="nav-link hover:bg-base-300 p-2 rounded-md">
            <FolderIcon className="mr-2 h-5 w-5" />
            Projects
          </Link>
        </li>
        {/* Kanban with Timeline Icon */}
        <li>
          <Link to="/kanban" className="nav-link hover:bg-base-300 p-2 rounded-md">
            <TimelineIcon className="mr-2 h-5 w-5" /> {/* Timeline Icon */}
            Kanban Board
          </Link>
        </li>
        <li>
          <button
            onClick={toggleDarkMode}
            className="nav-link hover:bg-base-300 p-2 rounded-md w-full text-left"
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
          <Link to="/logout" className="nav-link hover:bg-base-300 p-2 rounded-md">
            <LogoutIcon className="mr-2 h-5 w-5" />
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
