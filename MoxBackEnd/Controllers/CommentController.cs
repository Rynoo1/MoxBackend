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
        public async Task<IActionResult> GetByProject(int projectId)
        {
            var comments = await _service.GetByProjectAsync(projectId);

            var dtoList = comments.Select(c => new CommentDto
            {
                CommentID = c.CommentID,
                Content = c.Content,
                CreatedAt = c.CreatedAt,
                CreatedByUserId = c.CreatedByUserId,
                CreatedByUserName = c.CreatedBy?.UserName ?? "Anonymous"
            });

            return Ok(dtoList);
        }

        [HttpGet("by-task/{taskId}")]
        public async Task<IActionResult> GetByTask(int taskId)
        {
            var comments = await _service.GetByTaskAsync(taskId);

            var dtoList = comments.Select(c => new CommentDto
            {
                CommentID = c.CommentID,
                Content = c.Content,
                CreatedAt = c.CreatedAt,
                CreatedByUserId = c.CreatedByUserId,
                CreatedByUserName = c.CreatedBy?.UserName ?? "Anonymous"
            });

            return Ok(dtoList);
        }

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

            var dto = new CommentDto
            {
                CommentID = created.CommentID,
                Content = created.Content,
                CreatedAt = created.CreatedAt,
                CreatedByUserId = created.CreatedByUserId,
                CreatedByUserName = created.CreatedBy?.UserName ?? "Anonymous"
            };

            return CreatedAtAction(nameof(Get), new { id = dto.CommentID }, dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Comment comment)
        {
            var updated = await _service.UpdateAsync(id, comment);
            if (updated == null) return NotFound();

            var dto = new CommentDto
            {
                CommentID = updated.CommentID,
                Content = updated.Content,
                CreatedAt = updated.CreatedAt,
                CreatedByUserId = updated.CreatedByUserId,
                CreatedByUserName = updated.CreatedBy?.UserName ?? "Anonymous"
            };

            return Ok(dto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}