using System;
using MoxBackEnd.Data;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Models;

namespace MoxBackEnd.Services;

public class SubTaskService : ISubTask
{
    private readonly AppDbContext _context;
    public SubTaskService(AppDbContext context)
    {
        _context = context;
    }


    public Task<bool> CreateSubTask(SubTasks subTask)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteSubTask(int subTaskId)
    {
        throw new NotImplementedException();
    }

    public Task<List<SubTasks>> GetAllSubTasksByDateRange(DateTime startDate, DateTime endDate)
    {
        throw new NotImplementedException();
    }

    public Task<List<SubTasks>> GetAllSubTasksByDueDate(DateTime dueDate)
    {
        throw new NotImplementedException();
    }

    public Task<List<SubTasks>> GetAllSubTasksByEmergency(bool isEmergency)
    {
        throw new NotImplementedException();
    }

    public Task<List<SubTasks>> GetAllSubTasksByPriority(int priorityLevel)
    {
        throw new NotImplementedException();
    }

    public Task<List<SubTasks>> GetAllSubTasksByStatus(bool isCompleted)
    {
        throw new NotImplementedException();
    }

    public Task<List<SubTasks>> GetAllSubTasksByTaskId(int taskId)
    {
        throw new NotImplementedException();
    }

    public Task<List<SubTasks>> GetAllSubTasksByTaskIdAndStatus(int taskId, bool isCompleted)
    {
        throw new NotImplementedException();
    }

    public Task<List<SubTasks>> GetAllSubTasksByTaskIdAndUserId(int taskId, int userId)
    {
        throw new NotImplementedException();
    }

    public Task<List<SubTasks>> GetAllSubTasksByTaskIdAndUserIdAndStatus(int taskId, int userId, bool isCompleted)
    {
        throw new NotImplementedException();
    }

    public Task<List<SubTasks>> GetAllSubTasksByUserId(int userId)
    {
        throw new NotImplementedException();
    }

    public Task<List<SubTasks>> GetAllSubTasksByUserIdAndStatus(int userId, bool isCompleted)
    {
        throw new NotImplementedException();
    }

    public Task<SubTasks?> GetSubTaskById(int subTaskId)
    {
        throw new NotImplementedException();
    }

    public Task<bool> UpdateSubTask(SubTasks subTask)
    {
        throw new NotImplementedException();
    }
}
