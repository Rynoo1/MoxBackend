using System;
using MoxBackEnd.Interfaces;
using System.ComponentModel.DataAnnotations;
using MoxBackEnd.Models;
using MoxBackEnd.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using MoxBackEnd.Exceptions;

namespace MoxBackEnd.Services;

public class UserService : IUser
{
    private readonly AppDbContext _context;
    private readonly UserManager<Users> _userManager;
    private readonly SignInManager<Users> _signInManager;
    public UserService(AppDbContext context, UserManager<Users> userManager, SignInManager<Users> signInManager)
    {
        _context = context;
        _userManager = userManager;
        _signInManager = signInManager;
    }


    public async Task<Users> GetUserWithID(string userID)
    {
        var user = await _userManager.FindByIdAsync(userID);

        if (user == null)
        {
            throw new UserNotFoundException(userID);
        }

        return user;
    }

    public async Task<IEnumerable<AppRoles>> GetUserRoles(string userID)
    {
        var user = await _userManager.FindByIdAsync(userID) ?? throw new UserNotFoundException(userID);

        return user.AppRoles ?? []; 
    }

    public Task<IEnumerable<SubTasks>> GetUserSubtasks(string userID)
    {
        throw new NotImplementedException();
    }

    // public Task<Tasks> GetUserTasks(string userID)
    // {
    //     throw new NotImplementedException();
    // }

    // public Task<string> HashPassword(string password)
    // {
    //     string HashedPassword = BCrypt.Net.BCrypt.EnhancedHashPassword(password, 13);
    //     return Task.FromResult(HashedPassword);
    // }

    public async Task<string> LoginUser(string email, string password)
    {
        // Users? userFromDB = UserExists(email).Result;

        // if (userFromDB == null)
        // {
        //     return Task.FromResult("User does not exist");
        // }

        // if (ValidatePassword(userFromDB, password).Result)
        // {
        //     return Task.FromResult("Password is incorrect");
        // }

        // return Task.FromResult("Login Successful!");

        var user = await _userManager.FindByEmailAsync(email);

        if (user == null)
        {
            return "User does not exist";
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, password, lockoutOnFailure: false);

        if (!result.Succeeded)
        {
            return "Password is incorrect";
        }

        await _signInManager.SignInAsync(user, isPersistent: false);

        return "Login Successful!";
    }

    public async Task<(bool Succeeded, string[] Errors)> RegisterUser(Users user, string password)
    {
        if (user == null)
        {
            return (false, new[] { "User cannot be null" });
        }

        if (string.IsNullOrWhiteSpace(user.Email))
        {
            return (false, new[] { "Email is required" });
        }

        if (string.IsNullOrWhiteSpace(password))
        {
            return (false, new[] { "Password is required" });
        }

        user.Email = user.Email.Trim().ToLower();
        user.UserName ??= user.Email;

        var existingUser = await _userManager.FindByEmailAsync(user.Email);
        if (existingUser != null)
        {
            return (false, new[] { "User with this email already exists" });
        }

        var result = await _userManager.CreateAsync(user, password);

        if (result.Succeeded)
        {
            return (true, Array.Empty<string>());
        } else
        {
            return (false, result.Errors.Select(e => e.Description).ToArray());
        }

    }

    // public async Task<Users?> UserExists(string email)
    // {
    //     Users? userFromFB = await _context.Users.FirstOrDefaultAsync(userInDB => userInDB.Email == email);

    //     return userFromFB;
    // }

    // public Task<bool> ValidatePassword(Users user, string password)
    // {
    //     bool isPasswordValid = BCrypt.Net.BCrypt.EnhancedVerify(password, user.PasswordHash);
    //     return Task.FromResult(isPasswordValid);
    // }
}