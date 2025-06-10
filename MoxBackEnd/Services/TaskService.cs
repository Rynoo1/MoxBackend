using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MoxBackEnd.Data;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Models;

namespace MoxBackEnd.Services
{
    public class TaskService : ITask
    {
        private readonly AppDbContext _context;

        public TaskService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Tasks> CreateTaskAsync(Tasks task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<List<Tasks>> GetAllTasksAsync()
        {
            return await _context.Tasks
                .Include(t => t.SubTasks)
                .ToListAsync();
        }

        public async Task<List<Tasks>> GetTasksByProjectAsync(int projectId)
        {
            return await _context.Tasks
                .Where(t => t.ProjectID == projectId)
                .Include(t => t.SubTasks)
                .ToListAsync();
        }

        public async Task<List<Tasks>> GetOverdueTasksAsync()
        {
            return await _context.Tasks
                .Where(t => t.DueDate < DateTime.UtcNow && t.Status != WorkStatus.Completed)
                .ToListAsync();
        }


        public async Task<List<Tasks>> GetTasksByPriorityAsync(PriorityLevel level)
        {
            return await _context.Tasks
                .Where(t => t.Priority == level)
                .Include(t => t.SubTasks)
                .ToListAsync();
        }

        public async Task<List<Tasks>> GetEmergencyTasksAsync()
        {
            return await _context.Tasks
                .Where(t => t.IsEmergency)
                .Include(t => t.SubTasks)
                .ToListAsync();
        }

        public async Task<List<Tasks>> GetTasksByStatusAsync(WorkStatus status)
        {
            return await _context.Tasks
                .Where(t => t.Status == status)
                .Include(t => t.SubTasks)
                .ToListAsync();
        }

        public async Task<Tasks?> GetTaskByIdAsync(int id)
        {
            return await _context.Tasks
                .Include(t => t.SubTasks)
                .FirstOrDefaultAsync(t => t.TaskId == id);
        }

        public async Task<Tasks?> UpdateTaskAsync(int id, Tasks updatedTask)
        {
            var existing = await _context.Tasks
                .Include(t => t.SubTasks)
                .FirstOrDefaultAsync(t => t.TaskId == id);

            if (existing == null) return null;

            existing.Title = updatedTask.Title;
            existing.Description = updatedTask.Description;
            existing.DueDate = updatedTask.DueDate;
            existing.Priority = updatedTask.Priority;
            existing.Status = updatedTask.Status;
            existing.IsEmergency = updatedTask.IsEmergency;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteTaskAsync(int id)
        {
            var task = await _context.Tasks
                .Include(t => t.SubTasks)
                .FirstOrDefaultAsync(t => t.TaskId == id);

            if (task == null) return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
