using System;
using Microsoft.EntityFrameworkCore;
using MoxBackEnd.Data;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Models;

namespace MoxBackEnd.Services;

public class TaskService : ITask
{
    private readonly AppDbContext _context;

    public TaskService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Tasks>> GetAllTasksAsync() =>
        await _context.Tasks.ToListAsync();

    public async Task<List<Tasks>> GetTasksByProjectAsync(int projectId) =>
        await _context.Tasks.Where(t => t.ProjectID == projectId).ToListAsync();

    public async Task<List<Tasks>> GetTasksByPriorityAsync(PriorityLevel level) =>
        await _context.Tasks.Where(t => t.Priority == level).ToListAsync();

    public async Task<List<Tasks>> GetEmergencyTasksAsync() =>
        await _context.Tasks.Where(t => t.IsEmergency).ToListAsync();

    public async Task<List<Tasks>> GetTasksByStatusAsync(WorkStatus status) =>
        await _context.Tasks.Where(t => t.Status == status).ToListAsync();

    public async Task<Tasks?> GetTaskByIdAsync(int id) =>
        await _context.Tasks.FindAsync(id);

    public async Task<Tasks> CreateTaskAsync(Tasks task)
    {
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();
        return task;
    }

    public async Task<Tasks?> UpdateTaskAsync(int id, Tasks updatedTask)
    {
        var existing = await _context.Tasks.FindAsync(id);
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
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return false;

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return true;
    }
}