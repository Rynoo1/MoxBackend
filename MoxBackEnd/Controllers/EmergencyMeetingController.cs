using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Models;
using MoxBackEnd.Services;
using MoxBackEnd.Models.DTOs;

namespace MoxBackEnd.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmergencyMeetingController : ControllerBase
{
    private readonly IEmergencyMeeting _service;

    public EmergencyMeetingController(IEmergencyMeeting service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllMeetingsAsync());

    [HttpGet("by-group/{groupId}")]
    public async Task<IActionResult> GetByGroup(string groupId) => Ok(await _service.GetMeetingsByGroupAsync(groupId));

    [HttpGet("by-project/{projectId}")]
    public async Task<IActionResult> GetByProject(int projectId) => Ok(await _service.GetMeetingsByProjectAsync(projectId));

    [HttpGet("by-user/{userId}")]
    public async Task<IActionResult> GetByUser(string userId) => Ok(await _service.GetMeetingsByUserAsync(userId));

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var result = await _service.GetMeetingByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }

   [HttpPost]
    public async Task<IActionResult> Create([FromBody] EmergencyMeetingDto dto)
    {
        var attendees = await _service.GetUsersByIdsAsync(dto.Attendees);
        if (attendees.Count != dto.Attendees.Count)
            return BadRequest("One or more attendees could not be found.");

        var meeting = new EmergencyMeeting
        {
            Title = dto.Title,
            Description = dto.Description,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Location = dto.Location,
            GroupID = dto.GroupID,
            ProjectID = dto.ProjectID,
            CreatedByUserId = dto.CreatedByUserId,
            IsResolved = dto.IsResolved,
            Attendees = attendees
        };

        var created = await _service.CreateMeetingAsync(meeting);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }
}