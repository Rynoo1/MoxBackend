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

    public RoleService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _adminRoleId = configuration.GetValue<int>("AppSettings:AdminRoleId");  // Configurable Admin Role ID
    }

    private async Task<bool> HasAdminPermissionsAsync(string userId)
    {
        return await _context.AppRoles.AnyAsync(r => r.UserID == userId && r.RoleID == _adminRoleId);
    }

    private async Task<int> GetAdminRoleIdAsync()
    {
        var adminRole = await _context.AppRoles.FirstOrDefaultAsync(r => r.RoleDescription == "Admin");
        if (adminRole == null)
            throw new InvalidOperationException("Admin role not found");

        return adminRole.RoleID;
    }


    public async Task<AppRoles> SetRole(string userId, int projectId, int roleId)
    {
        if (!await HasAdminPermissionsAsync(userId))
            throw new UnauthorizedAccessException("User does not have admin permissions");

        var user = await _context.Users.FindAsync(userId);
        var project = await _context.Projects.FindAsync(projectId);

        if (user == null || project == null)
            throw new ArgumentException("User or project not found");

        var userRole = new AppRoles
        {
            UserID = userId,
            ProjectID = projectId,
            RoleID = roleId
        };

        _context.AppRoles.Add(userRole);
        await _context.SaveChangesAsync();

        return userRole;
    }


    public async Task<AppRoles?> GetUserRole(string userId, int projectId)
    {
        return await _context.AppRoles
            .FirstOrDefaultAsync(r => r.UserID == userId && r.ProjectID == projectId);
    }


    public async Task<AppRoles> UpdateUserRole(string userId, int projectId, int newRoleId)
    {
        if (!await HasAdminPermissionsAsync(userId))
            throw new UnauthorizedAccessException("User does not have admin permissions");

        var userRole = await _context.AppRoles
            .FirstOrDefaultAsync(r => r.UserID == userId && r.ProjectID == projectId);

        if (userRole == null)
            throw new ArgumentException("User role not found");

        userRole.RoleID = newRoleId;
        await _context.SaveChangesAsync();

        return userRole;
    }


    public async Task<bool> RemoveUserRole(string userId, int projectId)
    {
        var userRole = await _context.AppRoles.FirstOrDefaultAsync(r => r.UserID == userId && r.ProjectID == projectId);
        if (userRole == null) return false;

        _context.AppRoles.Remove(userRole);
        await _context.SaveChangesAsync();
        return true;
    }
}