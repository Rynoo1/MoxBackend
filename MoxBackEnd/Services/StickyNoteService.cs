using System;
using Microsoft.EntityFrameworkCore;
using MoxBackEnd.Data;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Models;

namespace MoxBackEnd.Services;

public class StickyNoteService : IStickyNote
{
    private readonly AppDbContext _context;

    public StickyNoteService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<StickyNote>> GetAllNotesAsync() =>
        await _context.StickyNotes.ToListAsync();

    public async Task<List<StickyNote>> GetNotesByProjectAsync(int projectId) =>
        await _context.StickyNotes.Where(n => n.ProjectID == projectId).ToListAsync();

    public async Task<List<StickyNote>> GetNotesByTaskAsync(int taskId) =>
        await _context.StickyNotes.Where(n => n.TaskId == taskId).ToListAsync();

    public async Task<List<StickyNote>> GetNotesByUserAsync(string userId) =>
        await _context.StickyNotes.Where(n => n.CreatedByUserId == userId).ToListAsync();

    public async Task<StickyNote?> GetNoteByIdAsync(int id) =>
        await _context.StickyNotes.FindAsync(id);

    public async Task<StickyNote> CreateNoteAsync(StickyNote note)
    {
        _context.StickyNotes.Add(note);
        await _context.SaveChangesAsync();
        return note;
    }

    public async Task<StickyNote?> UpdateNoteAsync(int id, StickyNote updatedNote)
    {
        var existing = await _context.StickyNotes.FindAsync(id);
        if (existing == null) return null;

        existing.Content = updatedNote.Content;
        existing.UpdatedAt = DateTime.UtcNow;
        existing.ColorHex = updatedNote.ColorHex;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteNoteAsync(int id)
    {
        var note = await _context.StickyNotes.FindAsync(id);
        if (note == null) return false;

        _context.StickyNotes.Remove(note);
        await _context.SaveChangesAsync();
        return true;
    }
}