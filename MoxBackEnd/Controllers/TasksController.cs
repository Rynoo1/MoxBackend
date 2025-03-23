using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoxBackEnd.Data;
using MoxBackEnd.Models;

namespace MoxBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TasksController(ApplicationDbContext context)
        {
            _context = context;
        }

        //(Get All Tasks)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks(
            [FromQuery] int? priority,
            [FromQuery] bool? isEmergency,
            [FromQuery] bool? isCompleted)
        {
            var query = _context.Tasks.AsQueryable();

            // Emergency override
            if (isEmergency.HasValue && isEmergency.Value)
                {
                    query = query.Where(t => t.IsEmergency == true && t.IsCompleted == false);
                }
                else
                {
                    if (priority.HasValue)
                        query = query.Where(t => t.Priority == priority.Value);

                    if (isCompleted.HasValue)
                        query = query.Where(t => t.IsCompleted == isCompleted.Value);
                }

                return await query.ToListAsync();
            }

        // Get Task by ID)
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItem>> GetTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }
            return task;
        }

        // (Create a Task)
        [HttpPost]
        public async Task<ActionResult<TaskItem>> CreateTask(TaskItem task)
        {
            // Validate assigned user
            if (task.AssignedUserId.HasValue)
            {
                var user = await _context.Users.FindAsync(task.AssignedUserId.Value);
                if (user == null)
                {
                    return BadRequest("Assigned user not found.");
                }
            }

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }

        // Update a Task)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, TaskItem task)
        {
            if (id != task.Id)
            {
                return BadRequest();
            }

            // If a task is completed, remove emergency status
            if (task.IsCompleted)
            {
                task.IsEmergency = false;
            }

            // Validate assigned user
            if (task.AssignedUserId.HasValue)
            {
                var user = await _context.Users.FindAsync(task.AssignedUserId.Value);
                if (user == null)
                {
                    return BadRequest("Assigned user not found.");
                }
            }

            _context.Entry(task).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // (Delete a Task)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}