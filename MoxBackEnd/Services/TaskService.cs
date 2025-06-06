using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MoxBackEnd.Data;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Models;
using MoxBackEnd.DTOs;

namespace MoxBackEnd.Services
{
    public class TaskService : ITask
    {
        private readonly AppDbContext _context;

        public TaskService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<TaskDto>> GetAllTasksAsync()
        {
            return await _context.Tasks
                .Include(t => t.SubTasks)
                .Select(t => new TaskDto
                {
                    TaskId = t.TaskId,
                    Title = t.Title,
                    Description = t.Description,
                    Priority = t.Priority,
                    IsEmergency = t.IsEmergency,
                    DueDate = t.DueDate,
                    Status = t.Status
                })
                .ToListAsync();
        }

        public async Task<List<Tasks>> GetTasksByProjectAsync(int projectId) =>
            await _context.Tasks
                .Where(t => t.ProjectID == projectId)
                .Include(t => t.SubTasks)
                .ToListAsync();

        public async Task<List<Tasks>> GetTasksByPriorityAsync(PriorityLevel level) =>
            await _context.Tasks
                .Where(t => t.Priority == level)
                .Include(t => t.SubTasks)
                .ToListAsync();

        public async Task<List<Tasks>> GetEmergencyTasksAsync() =>
            await _context.Tasks
                .Where(t => t.IsEmergency)
                .Include(t => t.SubTasks)
                .ToListAsync();

        public async Task<List<Tasks>> GetTasksByStatusAsync(WorkStatus status) =>
            await _context.Tasks
                .Where(t => t.Status == status)
                .Include(t => t.SubTasks)
                .ToListAsync();

        public async Task<Tasks?> GetTaskByIdAsync(int id) =>
            await _context.Tasks
                .Include(t => t.SubTasks)
                .FirstOrDefaultAsync(t => t.TaskId == id);

        public async Task<Tasks> CreateTaskAsync(TaskCreateDto taskDto)
        {
            var project = await _context.Projects.FindAsync(taskDto.ProjectID);
            if (project == null)
            {
                throw new Exception("Project not found.");
            }

            var task = new Tasks
            {
                ProjectID = taskDto.ProjectID,
                Title = taskDto.Title ?? string.Empty,
                Description = taskDto.Description,
                Priority = taskDto.Priority,
                IsEmergency = taskDto.IsEmergency,
                DueDate = taskDto.DueDate,
                CompletedAt = taskDto.CompletedAt,
                Status = taskDto.Status,
                Project = project
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<Tasks> CreateTaskAsync(Tasks task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
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