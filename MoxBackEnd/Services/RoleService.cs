using System;
using MoxBackEnd.Data;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Models;

namespace MoxBackEnd.Services;

public class RoleService : IRole
{
    private readonly AppDbContext _context;
    public RoleService(AppDbContext context)
    {
        _context = context;
    }

    public Task<Roles> SetRole(Roles role)
    {
        throw new NotImplementedException();
    }

    public Task<Roles> SetRole(int userID, int roleID)
    {
        throw new NotImplementedException();
    }
}
