using System;
using MoxBackEnd.Data;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Models;


namespace MoxBackEnd.Services;

public class UserService : IUser
{
    private readonly AppDbContext _context;
    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public Task<Users> GetUserID(int userID)
    {
        throw new NotImplementedException();
    }

    public Task<Roles> GetUserRoles(int userID)
    {
        throw new NotImplementedException();
    }

    public Task<SubTasks> GetUserSubtasks(int userID)
    {
        throw new NotImplementedException();
    }

    public Task<Tasks> GetUserTasks(int userID)
    {
        throw new NotImplementedException();
    }

    public Task<string> HashPassword(string password)
    {
        throw new NotImplementedException();
    }

    public Task<bool> LoginUser(string email, string password)
    {
        throw new NotImplementedException();
    }

    public Task<bool> RegisterUser(Users user)
    {
        throw new NotImplementedException();
    }

    public Task<Users?> UserExists(string email)
    {
        throw new NotImplementedException();
    }

    public Task<bool> VaildatePassword(Users user, string password)
    {
        throw new NotImplementedException();
    }
}