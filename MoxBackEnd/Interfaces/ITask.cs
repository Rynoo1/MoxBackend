using System;
using MoxBackEnd.Models;

namespace MoxBackEnd.Interfaces;

public interface ITask
{
    Task<List<Tasks>> GetAllTasksAsync();
    Task<List<Tasks>> GetTasksByProjectAsync(int projectId);
    Task<List<Tasks>> GetTasksByPriorityAsync(PriorityLevel level);
    Task<List<Tasks>> GetEmergencyTasksAsync();
    Task<List<Tasks>> GetTasksByStatusAsync(WorkStatus status);
    Task<Tasks?> GetTaskByIdAsync(int id);
    Task<Tasks> CreateTaskAsync(Tasks task);
    Task<Tasks?> UpdateTaskAsync(int id, Tasks updatedTask);
    Task<bool> DeleteTaskAsync(int id);
}