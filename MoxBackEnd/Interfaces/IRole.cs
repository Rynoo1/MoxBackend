using System;
using MoxBackEnd.Models;
using MoxBackEnd.Interfaces;


namespace MoxBackEnd.Interfaces;

public interface IRole
{
    string RoleID { get; set; }
    string RoleName { get; set; }
    string RoleDescription { get; set; }
}
