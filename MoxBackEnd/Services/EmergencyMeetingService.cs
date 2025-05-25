using System;
using Microsoft.EntityFrameworkCore;
using MoxBackEnd.Data;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Models;

namespace MoxBackEnd.Services;


public class EmergencyMeetingService : IEmergencyMeeting
{
    private readonly AppDbContext _context;

    public EmergencyMeetingService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<EmergencyMeeting>> GetAllMeetingsAsync() =>
        await _context.EmergencyMeetings
            .Include(m => m.CreatedBy)
            .Include(m => m.Attendees)
            .ToListAsync();

    public async Task<List<EmergencyMeeting>> GetMeetingsByProjectAsync(int projectId) =>
        await _context.EmergencyMeetings.Where(m => m.ProjectID == projectId).ToListAsync();

    public async Task<List<EmergencyMeeting>> GetMeetingsByUserAsync(string userId) =>
        await _context.EmergencyMeetings.Where(m => m.Attendees.Any(a => a.Id == userId)).ToListAsync();

    public async Task<EmergencyMeeting?> GetMeetingByIdAsync(int id) =>
        await _context.EmergencyMeetings.FindAsync(id);

    public async Task<EmergencyMeeting> CreateMeetingAsync(EmergencyMeeting meeting)
    {
        _context.EmergencyMeetings.Add(meeting);
        await _context.SaveChangesAsync();
        return meeting;
    }

    public async Task<bool> CancelMeetingAsync(int id)
    {
        var meeting = await _context.EmergencyMeetings.FindAsync(id);
        if (meeting == null) return false;

        meeting.IsResolved = true;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<Users>> GetUsersByIdsAsync(List<string> ids)
    {
        return await _context.Users
            .Where(u => ids.Contains(u.Id))
            .ToListAsync();
    }
}