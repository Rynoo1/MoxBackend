using MoxBackEnd.Dtos;
using Microsoft.AspNetCore.Mvc;
using MoxBackEnd.Interfaces;

namespace MoxBackEnd.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectController(IProjects projectService) : ControllerBase
{
    private readonly IProjects _projectService = projectService;

    [HttpGet]
    public async Task<IActionResult> GetAllProjects()
    {
        var projects = await _projectService.GetAllProjects();
        return Ok(projects);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProjectById(int id)
    {
        var project = await _projectService.GetProjectById(id);
        if (project == null)
        {
            return NotFound();
        }
        return Ok(project);
    }

    // [HttpGet("c")]
    // public async Task<IActionResult> GetMembers(int projectId)
    // {
    //     var members = await _projectService.GetProjectMembersAsync(projectId);
    //     return Ok(members);
    // }

    [HttpGet("{projectId}/members")]
    public async Task<IActionResult> GetMembers(int projectId)
    {
        var members = await _projectService.GetProjectMembersAsync(projectId);
        return Ok(members);
    }

    [HttpPost("{projectId}/assign")]
    public async Task<IActionResult> AssignMember(int projectId, [FromBody] string userId)
    {
        var success = await _projectService.AssignUserToProjectAsync(projectId, userId);
        if (!success) return BadRequest("User already assigned.");
        return Ok();
    }

    [HttpPost("{projectId}/unassign")]
    public async Task<IActionResult> UnassignMember(int projectId, [FromBody] string userId)
    {
        var success = await _projectService.UnassignUserFromProjectAsync(projectId, userId);
        if (!success) return NotFound("User not assigned.");
        return Ok();
    }

    [HttpPost]
    public async Task<IActionResult> CreateProject([FromBody] ProjectCreateDto projectDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var createdProject = await _projectService.CreateProjectAsync(projectDto);
        return CreatedAtAction(nameof(GetProjectById), new { id = createdProject.ProjectID }, createdProject);
    }



    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProjectWithTasks(int id, [FromBody] ProjectCreateDto projectDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var updated = await _projectService.UpdateProjectWithTasksAsync(projectDto);
        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProjectAsync(int id)
    {
        var deleted = await _projectService.DeleteProjectAsync(id);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
