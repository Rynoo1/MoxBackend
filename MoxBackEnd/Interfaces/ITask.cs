using System;
using MoxBackEnd.Models;
using MoxBackEnd.DTOs;

namespace MoxBackEnd.Interfaces;

public interface ITask
{
    Task<List<TaskDto>> GetAllTasksAsync();
    Task<List<Tasks>> GetTasksByProjectAsync(int projectId);
    Task<List<Tasks>> GetTasksByPriorityAsync(PriorityLevel level);
    Task<List<Tasks>> GetEmergencyTasksAsync();
    Task<List<Tasks>> GetTasksByStatusAsync(WorkStatus status);
    Task<Tasks?> GetTaskByIdAsync(int id);
    Task<Tasks> CreateTaskAsync(TaskCreateDto taskDto);
    Task<Tasks> CreateTaskAsync(Tasks task);
    Task<Tasks?> UpdateTaskAsync(int id, Tasks updatedTask);
    Task<bool> DeleteTaskAsync(int id);
}