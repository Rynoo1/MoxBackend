using System;
using MoxBackEnd.Data;
using MoxBackEnd.Interfaces;

namespace MoxBackEnd.Services;

public class SubTaskService : ISubTask
{
    private readonly AppDbContext _context;
    public SubTaskService(AppDbContext context)
    {
        _context = context;
    }


}
