using Microsoft.AspNetCore.Mvc;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Models;
using MoxBackEnd.DTOs;

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

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TaskCreateDto dto)
    {
        var task = new Tasks
        {
            Title = dto.Title,
            Description = dto.Description,
            Priority = dto.Priority,
            Status = dto.Status,
            DueDate = dto.DueDate,
            CompletedAt = dto.CompletedAt,
            IsEmergency = dto.IsEmergency,
            ProjectID = dto.ProjectID,
            AssignedUserId = dto.AssignedUserId
        };

        var created = await _service.CreateTaskAsync(task);
        return CreatedAtAction(nameof(Get), new { id = created.TaskId }, created);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _service.GetAllTasksAsync());

    [HttpGet("by-project/{projectId}")]
    public async Task<IActionResult> GetByProject(int projectId) =>
        Ok(await _service.GetTasksByProjectAsync(projectId));

    [HttpGet("by-priority/{level}")]
    public async Task<IActionResult> GetByPriority(PriorityLevel level) =>
        Ok(await _service.GetTasksByPriorityAsync(level));

    [HttpGet("emergency")]
    public async Task<IActionResult> GetEmergency() =>
        Ok(await _service.GetEmergencyTasksAsync());

    [HttpGet("by-status/{status}")]
    public async Task<IActionResult> GetByStatus(WorkStatus status) =>
        Ok(await _service.GetTasksByStatusAsync(status));

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var task = await _service.GetTaskByIdAsync(id);
        return task == null ? NotFound() : Ok(task);
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

    [HttpGet("overdue")]
    public async Task<IActionResult> GetOverdueTasks() =>
        Ok(await _service.GetOverdueTasksAsync());
}
