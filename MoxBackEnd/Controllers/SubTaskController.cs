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

        [HttpPut("{id}/complete")]
        public async Task<IActionResult> MarkComplete(int id)
        {
            var subTask = await _context.SubTasks.FindAsync(id);
            if (subTask == null)
                return NotFound();

            subTask.SubTStatus = (WorkStatus)1;
            subTask.CompletedDate = System.DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok(subTask);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] SubTaskStatusDto dto)
        {
            var subTask = await _context.SubTasks.FindAsync(id);
            if (subTask == null)
                return NotFound();

            subTask.SubTStatus = (WorkStatus)dto.SubTStatus;
            if (dto.SubTStatus == 1)
                subTask.CompletedDate = System.DateTime.UtcNow;
            else
                subTask.CompletedDate = null;

            await _context.SaveChangesAsync();
            return Ok(subTask);
        }

        [HttpGet("by-task/{taskId}")]
        public IActionResult GetSubTasksByTaskId(int taskId)
        {
            var subtasks = _context.SubTasks.Where(st => st.TaskId == taskId).ToList();
            return Ok(subtasks);
        }
    }
}