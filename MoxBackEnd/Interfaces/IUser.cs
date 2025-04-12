using System;
using MoxBackEnd.Models;

namespace MoxBackEnd.Interfaces;

public interface IUser
{
    public Task<(bool Succeeded, string[] Errors)> RegisterUser(Users user, string password);
    //public Task<string> HashPassword(string password);
    // public Task<Users?> UserExists(string email);
    public Task<string> LoginUser(string email, string password);
    // public Task<bool> ValidatePassword(Users user, string password);
    
    Task<Users> GetUserWithID (string userID);
    //Task<Tasks> GetUserTasks (int userID);
    Task<IEnumerable<SubTasks>> GetUserSubtasks (string userID);
    Task<IEnumerable<AppRoles>> GetUserRoles (string userID);

}

