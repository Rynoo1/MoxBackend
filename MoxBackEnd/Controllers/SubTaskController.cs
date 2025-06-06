using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using MoxBackEnd.Dtos;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Data;

namespace MoxBackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubTaskController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SubTaskController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{subtaskId}/users")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsersForSubTask(int subtaskId)
        {
            var subtask = await _context.SubTasks
                .Include(st => st.AssignedUsers)
                .FirstOrDefaultAsync(st => st.SubTaskID == subtaskId);

            if (subtask == null)
                return NotFound();

            var users = subtask.AssignedUsers.Select(u => new UserDto
            {
                Id = u.Id,
                UserName = u.UserName ?? string.Empty
            }).ToList();

            return Ok(users);
        }
    }
}