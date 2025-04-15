using System;
using MoxBackEnd.Models;

namespace MoxBackEnd.Interfaces;

public interface IStickyNote
{
    Task<List<StickyNote>> GetAllNotesAsync();
    Task<List<StickyNote>> GetNotesByProjectAsync(int projectId);
    Task<List<StickyNote>> GetNotesByTaskAsync(int taskId);
    Task<List<StickyNote>> GetNotesByUserAsync(string userId);
    Task<StickyNote?> GetNoteByIdAsync(int id);
    Task<StickyNote> CreateNoteAsync(StickyNote note);
    Task<StickyNote?> UpdateNoteAsync(int id, StickyNote updatedNote);
    Task<bool> DeleteNoteAsync(int id);
}