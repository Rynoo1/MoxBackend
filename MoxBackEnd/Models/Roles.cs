using System;

namespace MoxBackEnd.Models;

public class Roles
{
    /// <summary>
    /// Roles table model 
    /// RoleID : string PK
    /// UserID : string FK
    /// GroupID : string FK
    /// RoleName : string
    /// </summary>
    
    public string RoleID { get; set; } // PK
    public string UserID { get; set; } // FK
    public string GroupID { get; set; } // FK
    public string RoleName { get; set; }
}
