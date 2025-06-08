using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Models;
using MoxBackEnd.Services;

namespace MoxBackEnd.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StickyNoteController : ControllerBase
{
    private readonly IStickyNote _service;

    public StickyNoteController(IStickyNote service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllNotesAsync());

    [HttpGet("by-project/{projectId}")]
    public async Task<IActionResult> GetByProject(int projectId) => Ok(await _service.GetNotesByProjectAsync(projectId));

    [HttpGet("by-task/{taskId}")]
    public async Task<IActionResult> GetByTask(int taskId) => Ok(await _service.GetNotesByTaskAsync(taskId));

    [HttpGet("by-user/{userId}")]
    public async Task<IActionResult> GetByUser(string userId) => Ok(await _service.GetNotesByUserAsync(userId));

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var note = await _service.GetNoteByIdAsync(id);
        return note == null ? NotFound() : Ok(note);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] StickyNote note)
    {
        var created = await _service.CreateNoteAsync(note);
        
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] StickyNote note)
    {
        var updated = await _service.UpdateNoteAsync(id, note);
        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteNoteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}