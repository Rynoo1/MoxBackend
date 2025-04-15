using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MoxBackEnd.Data;
using MoxBackEnd.Models;
using MoxBackEnd.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MoxBackEnd.Services
{
    public class ProjectService : IProjects
    {
        private readonly AppDbContext _context;

        public ProjectService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Projects> AddUserAsync(Users user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var project = await _context.Projects
                .Include(p => p.Users)
                .FirstOrDefaultAsync(p => p.Users.Contains(user));

            return project!;
        }

        public async Task<Projects> CreateProjectAsync(Projects project)
        {
            if (project == null)
            {
                throw new ArgumentNullException(nameof(project));
            }

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();
            return project;
        }

        public async Task<List<Projects>> GetAllProjects()
        {
            return await _context.Projects.ToListAsync();
        }

        public async Task<Projects?> GetProjectById(int id)
        {
            return await _context.Projects.FindAsync(id);
        }

        public async Task<Projects?> UpdateProjectAsync(int id, Projects updatedProject)
        {
            var existingProject = await _context.Projects.FindAsync(id);
            if (existingProject == null) return null;

            existingProject.ProjectName = updatedProject.ProjectName;
            existingProject.DueDate = updatedProject.DueDate;
            existingProject.GroupID = updatedProject.GroupID;

            await _context.SaveChangesAsync();
            return existingProject;
        }

        public async Task<bool> DeleteProjectAsync(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return false;

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}