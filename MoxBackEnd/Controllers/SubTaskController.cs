using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using MoxBackEnd.Dtos;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Data;
using MoxBackEnd.Models;

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
            // Query the join table and join with Users to get user details
            var users = await _context.SubTaskUserAssignments
                .Where(a => a.AssignedSubTasksSubTaskID == subtaskId)
                .Join(_context.Users,
                      a => a.AssignedUsersId,
                      u => u.Id,
                      (a, u) => new UserDto
                      {
                          Id = u.Id,
                          UserName = u.UserName ?? string.Empty
                      })
                .ToListAsync();

            return Ok(users);
        }

      

         [HttpPut("{subTaskId}/status")]
public async Task<IActionResult> UpdateStatus(int subTaskId, [FromBody] SubTaskStatusDto dto)
{
    var subtask = await _context.SubTasks.FindAsync(subTaskId);
    if (subtask == null) return NotFound();
    subtask.SubTStatus = (MoxBackEnd.Models.WorkStatus)dto.SubTStatus;
    await _context.SaveChangesAsync();
    return Ok(subtask);
}

        [HttpGet("by-task/{taskId}")]
        public IActionResult GetSubTasksByTaskId(int taskId)
        {
            var subtasks = _context.SubTasks.Where(st => st.TaskId == taskId).ToList();
            return Ok(subtasks);
        }
    }

    public class SubTaskStatusDto
    {
        public int SubTStatus { get; set; }
    }
}