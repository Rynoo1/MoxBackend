import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "../styles/dashboard.css";

interface Project {
  projectID: number;
  projectName: string;
  dueDate: string;
}

const Dashboard = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const [date, setDate] = useState<Date | undefined>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const username = null;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:5183/api/Project");
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        const projectsArray = Array.isArray(data.$values)
          ? data.$values
          : Array.isArray(data)
          ? data
          : [];
        setProjects(projectsArray);
      } catch (err: any) {
        setError(err.message || "Failed to fetch projects.");
      }
    };
    fetchProjects();
  }, []);

  const upcomingProjects = projects.filter((project) => {
    const due = new Date(project.dueDate);
    return due >= new Date();
  });

  return (
    <div className="w-full">
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-semibold">Home</h1>
        <span className="text-gray-600">{formattedDate}</span>
      </header>

      <main className="px-6 py-4">
        {username && (
          <div className="text-center mb-6">
            <h2 className="text-3xl font-light">Good morning, {username}</h2>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 shadow rounded flex items-center justify-between">
            <div>
              <h4 className="text-lg font-medium">Tasks Completed</h4>
              <p className="text-4xl font-bold text-green-600">12</p>
            </div>
            <span role="img" aria-label="check" className="text-3xl">✅</span>
          </div>

          <div className="bg-white p-6 shadow rounded flex items-center justify-between">
            <div>
              <h4 className="text-lg font-medium">Collaborators</h4>
              <p className="text-4xl font-bold text-blue-600">4</p>
            </div>
            <span role="img" aria-label="users" className="text-3xl">👥</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 shadow rounded">
            <h3 className="text-xl font-semibold mb-2">Activity Log</h3>
            <p>Recent updates</p>
          </div>

          <div className="bg-white p-4 shadow rounded">
            <h3 className="text-xl font-semibold mb-2">Upcoming Deadlines</h3>
            {error && <p className="text-red-500">{error}</p>}
            {upcomingProjects.length === 0 ? (
              <p>No upcoming projects.</p>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                {upcomingProjects.slice(0, 5).map((project) => (
                  <li key={project.projectID}>
                    {project.projectName} – due{" "}
                    {new Date(project.dueDate).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card bg-base-100 shadow-sm w-full">
            <div className="card-body">
              <h3 className="card-title">Mini Calendar</h3>
              <DayPicker
                mode="single"
                selected={date}
                onSelect={setDate}
                className="react-day-picker"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
