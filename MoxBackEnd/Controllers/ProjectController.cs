using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoxBackEnd.Data;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Models;

namespace MoxBackEnd.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectController : ControllerBase
{
    private readonly IProjects _projectService;
    private readonly AppDbContext _context;

    public ProjectController(IProjects projectService, AppDbContext context)
    {
        _projectService = projectService;
        _context = context;
    }

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

    [HttpGet("{projectId}/assigned-users")]
    public async Task<IActionResult> GetAssignedUsers(int projectId)
    {
        var project = await _context.Projects
            .Include(p => p.Users)
            .FirstOrDefaultAsync(p => p.ProjectID == projectId);

        if (project == null)
            return NotFound("Project not found.");

        return Ok(project.Users.Select(u => new
        {
            u.Id,
            u.UserName,
            u.Email
        }));
    }

    [HttpPost]
    public async Task<IActionResult> CreateProject([FromBody] Projects project)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var createdProject = await _projectService.CreateProjectAsync(project);
        return CreatedAtAction(nameof(GetProjectById), new { id = createdProject.ProjectID }, createdProject);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProjectAsync(int id, [FromBody] Projects project)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var updatedProject = await _projectService.UpdateProjectAsync(id, project);
        if (updatedProject == null)
        {
            return NotFound();
        }

        return Ok(updatedProject);
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
