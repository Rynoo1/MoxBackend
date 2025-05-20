import Sidebar from "@renderer/components/Sidebar";
import React from "react";
import "../components/styles/Projects.css";
import ProjectCard from "@renderer/components/Projectcard";
import CreateProject from "@renderer/components/CreateProject"; // Import your CreateProject component

interface Project {
  projectID: number;
  projectName: string;
  dueDate: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [showCreateProject, setShowCreateProject] = React.useState(false);

  React.useEffect(() => {
    if (showCreateProject) return; // Don't fetch projects if creating a new one
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:5183/api/Project");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const projectsArray = Array.isArray(data.$values) ? data.$values : Array.isArray(data) ? data : [];
        setProjects(projectsArray);
        console.log("Projects data:", projectsArray);
      } catch (err: any) {
        setError(err.message || "Failed to fetch projects.");
      }
    };
    fetchProjects();
  }, [showCreateProject]);

  return (
    
      <div className="projects-page">
        <Sidebar
          isDarkMode={false}
          toggleDarkMode={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
        {error && <div className="error">{error}</div>}
        {!showCreateProject && (
          <button onClick={() => setShowCreateProject(true)} className="createprojectbutton">
            Create New Project
          </button>
        )}
        {showCreateProject ? (
          <CreateProject />
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project.projectID}
              ProjectID={project.projectID}
              ProjectName={project.projectName}
            />
          ))
        )}
      </div>
    
  );
};

export default Projects;