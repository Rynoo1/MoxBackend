using System;
using MoxBackEnd.Models;
using MoxBackEnd.Interfaces;

namespace MoxBackEnd.Interfaces;

public interface IRole
{

    Task<Roles> SetRole(int userID, int projectID, int roleID);
    //public Task<bool> SetRole(int userID, int projectID, int roleID);


}
