using System;
using MoxBackEnd.Models;

namespace MoxBackEnd.Interfaces;

public interface IRole
{
    public Task<AppRoles> SetRole(string userId, int projectId, int roleId);
    public Task<AppRoles?> GetUserRole(string userId, int projectId);
    public Task<AppRoles> UpdateUserRole(string userId, int projectId, int newRoleId);
    public Task<bool> RemoveUserRole(string userId, int projectId);
}
