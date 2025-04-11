using System;
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

            // Add the user to the database
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // you want to return the user's associated project
            var project = await _context.Projects
                .Include(p => p.Users)
                .FirstOrDefaultAsync(p => p.Users.Contains(user));

            return project;
        }

        public async Task<Projects> CreateProjectAsync(Projects project)
        {
            if (project == null)
            {
                throw new ArgumentNullException(nameof(project));
            }

            // Add the project to the database
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return project;
        }
    }
}