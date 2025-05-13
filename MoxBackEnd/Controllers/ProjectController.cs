using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Models;
using MoxBackEnd.Services;

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
        public async Task<IActionResult> CreateProject([FromBody] Projects project)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdProject = await _projectService.CreateProjectAsync(project);
            return CreatedAtAction(nameof(GetProjectById), new { id = createdProject.ProjectID}, createdProject);
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