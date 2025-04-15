using System;
using System.ComponentModel.DataAnnotations;
using MoxBackEnd.Models;

namespace MoxBackEnd.DTOs;

public class UserDTO
{
    public string Id { get; set; } = string.Empty;
    [Required]
    public string UserName { get; set; } = string.Empty;
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public List<UserRolesDTO> AppRoles { get; set; } = [];
    public List<UserSubTaskDTO> SubTasks { get; set; } = [];

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
