using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MoxBackEnd.Interfaces;

public interface ITask
{
    public Task<bool> CreateTask(Tasks task);
    public Task<bool> UpdateTask(Tasks task);
    public Task<bool> DeleteTask(int taskId);
    public Task<Tasks?> GetTaskById(int taskId);
    public Task<List<Tasks>> GetAllTasksByProjectId(int projectId);
    public Task<List<Tasks>> GetAllTasksByUserId(int userId);
    public Task<List<Tasks>> GetAllTasksByStatus(bool isCompleted);
    public Task<List<Tasks>> GetAllTasksByPriority(int priorityLevel);
    public Task<List<Tasks>> GetAllTasksByDueDate(DateTime dueDate);
    public Task<List<Tasks>> GetAllTasksByEmergency(bool isEmergency);
    public Task<List<Tasks>> GetAllTasksByDateRange(DateTime startDate, DateTime endDate);
    public Task<List<Tasks>> GetAllTasksByProjectIdAndStatus(int projectId, bool isCompleted);
    public Task<List<Tasks>> GetAllTasksByUserIdAndStatus(int userId, bool isCompleted);
}
