using System;
using Microsoft.EntityFrameworkCore;
using MoxBackEnd.Data;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Models;

namespace MoxBackEnd.Services;

public class GroupService : IGroup
{
    private readonly AppDbContext _context;

    public GroupService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Group>> GetAllGroupsAsync() =>
        await _context.Groups.ToListAsync();

    public async Task<Group?> GetGroupByIdAsync(string groupId) =>
        await _context.Groups.FindAsync(groupId);

    public async Task<Group> CreateGroupAsync(Group group)
    {
        _context.Groups.Add(group);
        await _context.SaveChangesAsync();
        return group;
    }

    public async Task<Group?> UpdateGroupAsync(string groupId, Group updatedGroup)
    {
        var existing = await _context.Groups.FindAsync(groupId);
        if (existing == null) return null;

        existing.GroupName = updatedGroup.GroupName;
        existing.DueDate = updatedGroup.DueDate;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteGroupAsync(string groupId)
    {
        var group = await _context.Groups.FindAsync(groupId);
        if (group == null) return false;

        _context.Groups.Remove(group);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> AddUserToGroupAsync(string groupId, string userId)
    {
        var group = await _context.Groups.Include(g => g.Users).FirstOrDefaultAsync(g => g.GroupID == groupId);
        var user = await _context.Users.FindAsync(userId);
        if (group == null || user == null) return false;

        group.Users.Add(user);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveUserFromGroupAsync(string groupId, string userId)
    {
        var group = await _context.Groups.Include(g => g.Users).FirstOrDefaultAsync(g => g.GroupID == groupId);
        var user = await _context.Users.FindAsync(userId);
        if (group == null || user == null) return false;

        group.Users.Remove(user);
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