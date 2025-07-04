using System;
using System.ComponentModel.DataAnnotations;
using MoxBackEnd.Models;
using System.Text.Json.Serialization;

namespace MoxBackEnd.DTOs;

public class UserDTO
{
    public string Id { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public List<UserRolesDTO> AppRoles { get; set; } = [];
    public List<UserSubTaskDTO> SubTasks { get; set; } = [];

}

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T Data { get; set; } = default!;
    public string Message { get; set; } = string.Empty;
}

public class UserProfileDto
{
    [JsonPropertyName("UserName")]
    public string UserName { get; set; } = string.Empty;
    [JsonPropertyName("Email")]
    public string Email { get; set; } = string.Empty;
    [JsonPropertyName("ProfilePicture")]
    public string ProfilePicture { get; set; } = string.Empty;
}


public class RegisterUserDTO
{
    public required string Username { get; set; }

    [EmailAddress]
    public required string Email { get; set; }
}

public class LoginDto
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    
}

public class UpdateUserProfileDto
{
    public string? UserName { get; set; } = string.Empty;
    public string? Email { get; set; } = string.Empty;
    public string? ProfilePicture { get; set; } = string.Empty;
}

public class TwoFactorDto
{
    public string UserId { get; set; } = string.Empty;
    public string TwoFactorCode { get; set; } = string.Empty;

}

public class UserRolesDTO
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
}

public class UserSubTaskDTO
{
    public int Id { get; set; }
    public int ProjectID { get; set; }
    public string Title { get; set; } = string.Empty;
    public WorkStatus SubTStatus { get; set; } = WorkStatus.NotStarted;
}
