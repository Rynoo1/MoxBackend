using System;

namespace MoxBackEnd.Models;

public class Roles
{
    public string RoleID { get; set; } // PK
    public string RoleName { get; set; }
    public string RoleDescription { get; set; }
    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<Projects> Projects { get; set; } = new List<Projects>();
}
