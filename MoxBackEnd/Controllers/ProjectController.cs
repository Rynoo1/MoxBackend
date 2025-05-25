using Microsoft.AspNetCore.Mvc;
using MoxBackEnd.Dtos;
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
    public async Task<IActionResult> UpdateProjectAsync(int id, [FromBody] ProjectUpdateDto projectDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var updatedProject = await _projectService.UpdateProjectAsync(id, projectDto);
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
