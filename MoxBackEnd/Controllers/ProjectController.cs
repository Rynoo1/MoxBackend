using Microsoft.AspNetCore.Mvc;
using MoxBackEnd.Models;
using MoxBackEnd.Services;

namespace MoxBackEnd.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectController(IProjectService projectService) : ControllerBase
{
    private readonly IProjectService _projectService = projectService;

        [HttpGet]
        public IActionResult GetAllProjects()
        {
            var projects = _projectService.GetAllProjects();
            return Ok(projects);
        }

        [HttpGet("{id}")]
        public IActionResult GetProjectById(int id)
        {
            var project = _projectService.GetProjectById(id);
            if (project == null)
            {
                return NotFound();
            }
            return Ok(project);
        }

        [HttpPost]
        public IActionResult CreateProject([FromBody] Project project)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdProject = _projectService.CreateProject(project);
            return CreatedAtAction(nameof(GetProjectById), new { id = createdProject.Id }, createdProject);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateProject(int id, [FromBody] Project project)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedProject = _projectService.UpdateProject(id, project);
            if (updatedProject == null)
            {
                return NotFound();
            }

            return Ok(updatedProject);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProject(int id)
        {
            var deleted = _projectService.DeleteProject(id);
            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
}

