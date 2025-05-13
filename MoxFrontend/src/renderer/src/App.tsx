// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import KanbanBoard from "./pages/KanbanBoard";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Content area */}
        <div className="flex-1 ml-64 p-4">
          {/* Routes */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/kanban" element={<KanbanBoard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
