using Microsoft.EntityFrameworkCore;
using MoxBackEnd.Data;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Models;

namespace MoxBackEnd.Services
{
    public class CommentService : IComment
    {
        private readonly AppDbContext _context;

        public CommentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Comment>> GetAllAsync() =>
            await _context.Comments.Include(c => c.CreatedBy).ToListAsync();

        public async Task<List<Comment>> GetByProjectAsync(int projectId) =>
            await _context.Comments
                .Include(c => c.CreatedBy)
                .Where(c => c.ProjectID == projectId)
                .ToListAsync();

        public async Task<List<Comment>> GetByTaskAsync(int taskId) =>
            await _context.Comments
                .Include(c => c.CreatedBy)
                .Where(c => c.TaskId == taskId)
                .ToListAsync();

        public async Task<List<Comment>> GetByUserAsync(string userId) =>
            await _context.Comments
                .Include(c => c.CreatedBy)
                .Where(c => c.CreatedByUserId == userId)
                .ToListAsync();

        public async Task<Comment?> GetByIdAsync(int id) =>
            await _context.Comments
                .Include(c => c.CreatedBy)
                .FirstOrDefaultAsync(c => c.CommentID == id);


        public async Task<Comment> CreateAsync(Comment comment)
        {
            if (!string.IsNullOrEmpty(comment.CreatedByUserId))
            {
                comment.CreatedBy = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == comment.CreatedByUserId);
            }

            comment.CreatedAt = DateTime.UtcNow;

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            await _context.Entry(comment).Reference(c => c.CreatedBy).LoadAsync();

            return comment;
        }


        public async Task<Comment?> UpdateAsync(int id, Comment updatedComment)
        {
            var existing = await _context.Comments
                .Include(c => c.CreatedBy)
                .FirstOrDefaultAsync(c => c.CommentID == id);

            if (existing == null) return null;

            existing.Content = updatedComment.Content;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return false;

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}