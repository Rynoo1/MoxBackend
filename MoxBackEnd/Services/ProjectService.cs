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




    }
}