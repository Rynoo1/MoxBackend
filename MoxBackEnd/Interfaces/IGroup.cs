using System;
using MoxBackEnd.Models;

namespace MoxBackEnd.Interfaces;

public interface IGroup
{
    Task<List<Group>> GetAllGroupsAsync();
    Task<Group?> GetGroupByIdAsync(string groupId);
    Task<Group> CreateGroupAsync(Group group);
    Task<Group?> UpdateGroupAsync(string groupId, Group updatedGroup);
    Task<bool> DeleteGroupAsync(string groupId);
    Task<bool> AddUserToGroupAsync(string groupId, string userId);
    Task<bool> RemoveUserFromGroupAsync(string groupId, string userId);
    Task<List<Users>> GetUsersByIdsAsync(List<string> ids);
}