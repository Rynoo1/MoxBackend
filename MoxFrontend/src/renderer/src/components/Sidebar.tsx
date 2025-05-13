import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar w-64 bg-base-200 h-full p-4 fixed left-0 top-0">
      <ul className="menu text-base-content">
        <li>
          <Link to="/" className="hover:bg-base-300 p-2 rounded-md">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/kanban" className="hover:bg-base-300 p-2 rounded-md">
            Kanban Board
          </Link>
        </li>
        {/* Add more links if necessary */}
      </ul>
    </div>
  );
};

export default Sidebar;
