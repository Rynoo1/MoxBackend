using System;
using MoxBackEnd.Models;

namespace MoxBackEnd.Interfaces;

public interface IUser
{
    public Task<bool> RegisterUser(Users user);
    public Task<string> HashPassword(string password);
    public Task<Users?> UserExists(string email);
    public Task<bool> LoginUser(string email, string password);
    public Task<bool> VaildatePassword(Users user, string password);
    
    Task<Users> GetUserID (int userID);
    Task<Tasks> GetUserTasks (int userID);
    Task<SubTasks> GetUserSubtasks (int userID);
    Task<Roles> GetUserRoles (int userID);

}

