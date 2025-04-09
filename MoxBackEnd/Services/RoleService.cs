using System;
using System.Threading.Tasks;
using MoxBackEnd.Data;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace MoxBackEnd.Services;

public class RoleService : IRole
{
    private readonly AppDbContext _context;
    private readonly int _adminRoleId;

    // Constructor accepts IConfiguration to get the AdminRoleId
    public RoleService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _adminRoleId = configuration.GetValue<int>("AppSettings:AdminRoleId");  // Configurable Admin Role ID
    }

    // Check if the user has admin permissions using the configurable _adminRoleId
    private async Task<bool> HasAdminPermissionsAsync(int userId)
    {
        return await _context.Roles.AnyAsync(r => r.UserID == userId && r.RoleID == _adminRoleId);
    }

    // Fetch Admin Role ID from the database (only if needed)
    private async Task<int> GetAdminRoleIdAsync()
    {
        var adminRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleDescription == "Admin");
        if (adminRole == null)
            throw new InvalidOperationException("Admin role not found");

        return adminRole.RoleID;  // Assuming you want to return the RoleID of the Admin role
    }

    // Set role for a user
    public async Task<Roles> SetRole(int userId, int projectId, int roleId)
    {
        if (!await HasAdminPermissionsAsync(userId))
            throw new UnauthorizedAccessException("User does not have admin permissions");

        var user = await _context.Users.FindAsync(userId);
        var project = await _context.Projects.FindAsync(projectId);

        if (user == null || project == null)
            throw new ArgumentException("User or project not found");

        var userRole = new Roles
        {
            UserID = userId,
            ProjectID = projectId,
            RoleID = roleId
        };

        _context.Roles.Add(userRole);
        await _context.SaveChangesAsync();

        return userRole;
    }

    // Get a user's role for a specific project
    public async Task<Roles?> GetUserRole(int userId, int projectId)
    {
        return await _context.Roles
            .FirstOrDefaultAsync(r => r.UserID == userId && r.ProjectID == projectId);
    }

    // Update a user's role for a project
    public async Task<Roles> UpdateUserRole(int userId, int projectId, int newRoleId)
    {
        if (!await HasAdminPermissionsAsync(userId))
            throw new UnauthorizedAccessException("User does not have admin permissions");

        var userRole = await _context.Roles
            .FirstOrDefaultAsync(r => r.UserID == userId && r.ProjectID == projectId);

        if (userRole == null)
            throw new ArgumentException("User role not found");

        userRole.RoleID = newRoleId;
        await _context.SaveChangesAsync();

        return userRole;
    }

    // Remove a user's role for a project
    public async Task<bool> RemoveUserRole(int userId, int projectId)
    {
        var userRole = await _context.Roles.FirstOrDefaultAsync(r => r.UserID == userId && r.ProjectID == projectId);
        if (userRole == null) return false;

        _context.Roles.Remove(userRole);
        await _context.SaveChangesAsync();
        return true;
    }
}