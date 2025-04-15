using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Models;
using MoxBackEnd.Services;

namespace MoxBackEnd.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TaskController : ControllerBase
{
    private readonly ITask _service;

    public TaskController(ITask service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllTasksAsync());

    [HttpGet("by-project/{projectId}")]
    public async Task<IActionResult> GetByProject(int projectId) => Ok(await _service.GetTasksByProjectAsync(projectId));

    [HttpGet("by-priority/{level}")]
    public async Task<IActionResult> GetByPriority(PriorityLevel level) => Ok(await _service.GetTasksByPriorityAsync(level));

    [HttpGet("emergency")]
    public async Task<IActionResult> GetEmergency() => Ok(await _service.GetEmergencyTasksAsync());

    [HttpGet("by-status/{status}")]
    public async Task<IActionResult> GetByStatus(WorkStatus status) => Ok(await _service.GetTasksByStatusAsync(status));

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var task = await _service.GetTaskByIdAsync(id);
        return task == null ? NotFound() : Ok(task);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Tasks task)
    {
        var created = await _service.CreateTaskAsync(task);
        return CreatedAtAction(nameof(Get), new { id = created.TaskId }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Tasks task)
    {
        var updated = await _service.UpdateTaskAsync(id, task);
        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteTaskAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}