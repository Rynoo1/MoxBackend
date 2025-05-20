import OverdueTasksChart from '@renderer/components/charts/OverdueTasksChart';
import PriorityBreakdownChart from '@renderer/components/charts/PriorityBreakdownChart';
import UserWorkloadChart from '@renderer/components/charts/UserWorkloadChart';
import ProjectCompletionChart from '@renderer/components/charts/ProjectCompletionChart';
import UpcomingDeadlinesChart from '@renderer/components/charts/UpcomingDeadlinesChart';
import TasksOverTimeChart from '@renderer/components/charts/TasksOverTimeChart';
import React, { useEffect, useState } from 'react';
import TaskStatusChart from '@renderer/components/charts/TaskStatusChart';

const chartOptionsAdmin = [
  { value: 'completion', label: 'Project Completion Overview' },
  { value: 'status', label: 'Task Status Distribution' },
  { value: 'overTime', label: 'Tasks Completed Over Time' },
  { value: 'deadlines', label: 'Upcoming Deadlines' },
  { value: 'priority', label: 'Priority Breakdown' },
  { value: 'workload', label: 'User Workload' },
  { value: 'overdue', label: 'Overdue Tasks' },
];

const chartOptionsBasic = [
  { value: 'completion', label: 'Project Completion Overview' },
  { value: 'status', label: 'Task Status Distribution' },
  { value: 'overTime', label: 'Tasks Completed Over Time' },
  { value: 'deadlines', label: 'Upcoming Deadlines' },
  { value: 'priority', label: 'Priority Breakdown' },
];

interface AnalyticsProps {
  userRole: 'admin' | 'basic';
  userId: string;
}

const Analytics: React.FC<AnalyticsProps> = ({ userRole, userId }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [chartType, setChartType] = useState<string>('');
  const chartOptions = userRole === 'admin' ? chartOptionsAdmin : chartOptionsBasic;

  useEffect(() => {
    // Fetch projects based on user role
    fetch(userRole === 'admin'
      ? 'http://localhost:5183/api/projects'
      : `http://localhost:5183/api/projects?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        // Handle $values serialization if present
        const projectsArray = Array.isArray(data.$values) ? data.$values : Array.isArray(data) ? data : [];
        setProjects(projectsArray);
        if (projectsArray.length > 0) {
          // Randomly select a project
          const randomProject = projectsArray[Math.floor(Math.random() * projectsArray.length)];
          setSelectedProject(randomProject);
        } else {
          setSelectedProject(null);
        }
      });
    setChartType(chartOptions[0].value);
    // eslint-disable-next-line
  }, [userRole, userId]);

  // Handle project selection change
  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const project = projects.find(p => p.id === Number(e.target.value));
    setSelectedProject(project);
  };

  // Handle chart type selection change
  const handleChartTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChartType(e.target.value);
  };

  return (
    <div className="analytics-container">
      <div className="dropdowns">
        <select
          value={selectedProject?.id || ''}
          onChange={handleProjectChange}
        >
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.title}</option>
          ))}
        </select>
        <select
          value={chartType}
          onChange={handleChartTypeChange}
        >
          {chartOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="chart-area">
        {chartType === 'completion' && (
          <ProjectCompletionChart
            data={
              selectedProject
                ? [
                    {
                      name: selectedProject.title || 'Project',
                      completion: selectedProject.completion ?? 0,
                    },
                  ]
                : []
            }
          />
        )}
        {chartType === 'status' && (
          <TaskStatusChart
            data={
              selectedProject && selectedProject.statusData
                ? selectedProject.statusData
                : []
            }
          />
        )}
        {chartType === 'overTime' && (
          <TasksOverTimeChart
            data={selectedProject && selectedProject.tasksOverTime ? selectedProject.tasksOverTime : []}
          />
        )}
        {chartType === 'deadlines' && (
          <UpcomingDeadlinesChart
            data={
              selectedProject && selectedProject.upcomingDeadlines
                ? selectedProject.upcomingDeadlines
                : []
            }
          />
        )}
        {chartType === 'priority' && (
          <PriorityBreakdownChart
            data={
              selectedProject && selectedProject.priorityData
                ? selectedProject.priorityData
                : []
            }
          />
        )}
        {userRole === 'admin' && chartType === 'workload' && (
          <UserWorkloadChart
            data={
              selectedProject && selectedProject.userWorkload
                ? selectedProject.userWorkload
                : []
            }
          />
        )}
        {userRole === 'admin' && chartType === 'overdue' && (
          <OverdueTasksChart
            data={
              selectedProject && selectedProject.overdueTasks
                ? selectedProject.overdueTasks
                : []
            }
          />
        )}
      </div>
    </div>
  );
};

export default Analytics;