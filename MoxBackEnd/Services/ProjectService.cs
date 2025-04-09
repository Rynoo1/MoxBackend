using System;
using MoxBackEnd.Data;
using MoxBackEnd.Models;
using MoxBackEnd.Interfaces;

namespace MoxBackEnd.Services
{
    public class ProjectService : IProjects
    {
        private readonly AppDbContext _context;
        public ProjectService(AppDbContext context)
        {
            _context = context;
        }

        public Task<Projects> AddUserAsync(Users user)
        {
            throw new NotImplementedException();
        }

        public Task<Projects> CreateProjectAsync(Projects projects)
        {
            throw new NotImplementedException();
        }
    }
}