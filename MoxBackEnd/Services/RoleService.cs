using System;
using MoxBackEnd.Interfaces;


namespace MoxBackEnd.Services;

public class RoleService : IRole
{
    public string RoleID { get; set; }
    public string RoleName { get; set; }
    public string RoleDescription { get; set; }

}
