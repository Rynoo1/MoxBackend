using MoxBackEnd.Models;

namespace MoxBackEnd.Interfaces
{
    public interface ITask
    {
        Task<Tasks> CreateTaskAsync(Tasks task);

        Task<List<Tasks>> GetAllTasksAsync();
        Task<Tasks?> GetTaskByIdAsync(int id);
        Task<List<Tasks>> GetTasksByProjectAsync(int projectId);
        Task<List<Tasks>> GetTasksByPriorityAsync(PriorityLevel level);
        Task<List<Tasks>> GetTasksByStatusAsync(WorkStatus status);
        Task<List<Tasks>> GetOverdueTasksAsync();

        Task<List<Tasks>> GetEmergencyTasksAsync();
        Task<Tasks?> UpdateTaskAsync(int id, Tasks updatedTask);
        Task<bool> DeleteTaskAsync(int id);

    }
}
