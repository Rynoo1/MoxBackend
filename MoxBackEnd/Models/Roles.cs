using System;

namespace MoxBackEnd.Models;

public class Roles
{
    /// <summary>
    /// Roles table model
    /// RoleID : string PK
    /// RoleName : string
    /// RoleDescription : string
    /// </summary>
    
    public string RoleID { get; set; } // PK
    public string RoleName { get; set; }
    public string RoleDescription { get; set; }
    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<Groups> Groups { get; set; } = new List<Groups>();

    
}
