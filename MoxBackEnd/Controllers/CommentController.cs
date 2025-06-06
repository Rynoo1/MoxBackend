using Microsoft.AspNetCore.Mvc;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Models;

namespace MoxBackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentController : ControllerBase
    {
        private readonly IComment _service;

        public CommentController(IComment service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _service.GetAllAsync());

        [HttpGet("by-project/{projectId}")]
        public async Task<IActionResult> GetByProject(int projectId) =>
            Ok(await _service.GetByProjectAsync(projectId));

        [HttpGet("by-task/{taskId}")]
        public async Task<IActionResult> GetByTask(int taskId) =>
            Ok(await _service.GetByTaskAsync(taskId));

        [HttpGet("by-user/{userId}")]
        public async Task<IActionResult> GetByUser(string userId) =>
            Ok(await _service.GetByUserAsync(userId));

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var comment = await _service.GetByIdAsync(id);
            return comment == null ? NotFound() : Ok(comment);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Comment comment)
        {
            var created = await _service.CreateAsync(comment);
            return CreatedAtAction(nameof(Get), new { id = created.CommentID }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Comment comment)
        {
            var updated = await _service.UpdateAsync(id, comment);
            return updated == null ? NotFound() : Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}