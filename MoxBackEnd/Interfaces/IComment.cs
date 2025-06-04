using MoxBackEnd.Models;

namespace MoxBackEnd.Interfaces
{
    public interface IComment
    {
        Task<List<Comment>> GetAllAsync();
        Task<List<Comment>> GetByProjectAsync(int projectId);
        Task<List<Comment>> GetByTaskAsync(int taskId);
        Task<List<Comment>> GetByUserAsync(string userId);
        Task<Comment?> GetByIdAsync(int id);
        Task<Comment> CreateAsync(Comment comment);
        Task<Comment?> UpdateAsync(int id, Comment updatedComment);
        Task<bool> DeleteAsync(int id);
    }
}