using System;

namespace MoxBackEnd.Interfaces;

public interface ISubTask
{
    public Task<bool> CreateSubTask(SubTasks subTask);
    public Task<bool> UpdateSubTask(SubTasks subTask);
    public Task<bool> DeleteSubTask(int subTaskId);
    public Task<SubTasks?> GetSubTaskById(int subTaskId);
    public Task<List<SubTasks>> GetAllSubTasksByTaskId(int taskId);
    public Task<List<SubTasks>> GetAllSubTasksByUserId(int userId);
    public Task<List<SubTasks>> GetAllSubTasksByStatus(bool isCompleted);
    public Task<List<SubTasks>> GetAllSubTasksByPriority(int priorityLevel);
    public Task<List<SubTasks>> GetAllSubTasksByDueDate(DateTime dueDate);
    public Task<List<SubTasks>> GetAllSubTasksByEmergency(bool isEmergency);
    public Task<List<SubTasks>> GetAllSubTasksByDateRange(DateTime startDate, DateTime endDate);
    public Task<List<SubTasks>> GetAllSubTasksByTaskIdAndStatus(int taskId, bool isCompleted);
    public Task<List<SubTasks>> GetAllSubTasksByUserIdAndStatus(int userId, bool isCompleted);
    public Task<List<SubTasks>> GetAllSubTasksByTaskIdAndUserId(int taskId, int userId);
    public Task<List<SubTasks>> GetAllSubTasksByTaskIdAndUserIdAndStatus(int taskId, int userId, bool isCompleted);
}
