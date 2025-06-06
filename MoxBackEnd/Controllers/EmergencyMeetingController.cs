using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Data;
using MoxBackEnd.Models;
using MoxBackEnd.Services;
using MoxBackEnd.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace MoxBackEnd.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmergencyMeetingController : ControllerBase
{
    private readonly IEmergencyMeeting _service;
    private readonly AppDbContext _context;

    public EmergencyMeetingController(AppDbContext context, IEmergencyMeeting service)
    {
        _context = context;
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var meetings = await _service.GetAllMeetingsAsync();

        var result = meetings.Select(m => new
        {
            m.Id,
            m.Title,
            m.Description,
            m.StartTime,
            m.EndTime,
            m.Location,
            m.ProjectID,
            m.IsResolved,
            CreatedBy = m.CreatedBy?.UserName ?? "Unknown",
            Attendees = m.Attendees.Select(a => new
            {
                a.Id,
                a.UserName
            })
        });

        return Ok(result);
    }

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

    [HttpGet("project-attendees/{projectId}")]
    public async Task<IActionResult> GetProjectAttendees(int projectId)
    {
        var users = await _service.GetUsersByProjectIdAsync(projectId);
        var result = users.Select(u => new
        {
            u.Id,
            u.UserName
        });

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] EmergencyMeetingDto dto)
    {
        var attendees = await _service.GetUsersByIdsAsync(dto.Attendees);
        if (attendees.Count != dto.Attendees.Count)
            return BadRequest("One or more attendees could not be found.");

        var creator = await _context.Users.FindAsync(dto.CreatedByUserId);
        if (creator == null)
            return BadRequest("Creator user not found.");

        var meeting = new EmergencyMeeting
        {
            Title = dto.Title,
            Description = dto.Description,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Location = dto.Location,
            ProjectID = dto.ProjectID,
            CreatedByUserId = dto.CreatedByUserId,
            CreatedBy = creator,
            IsResolved = dto.IsResolved,
            Attendees = attendees
        };

        var created = await _service.CreateMeetingAsync(meeting);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] EmergencyMeetingDto dto)
    {
        var meeting = await _context.EmergencyMeetings
            .Include(m => m.Attendees)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (meeting == null) return NotFound();

        meeting.Title = dto.Title;
        meeting.Description = dto.Description;
        meeting.Location = dto.Location;
        meeting.StartTime = dto.StartTime;
        meeting.EndTime = dto.EndTime;
        meeting.ProjectID = dto.ProjectID;
        meeting.IsResolved = dto.IsResolved;

        if (dto.Attendees?.Any() == true)
        {
            var users = await _context.Users
                .Where(u => dto.Attendees.Contains(u.Id))
                .ToListAsync();

            meeting.Attendees.Clear();
            foreach (var user in users)
                meeting.Attendees.Add(user);
        }

        await _context.SaveChangesAsync();
        return Ok(meeting);
    }

    [HttpPatch("{id}/cancel")]
    public async Task<IActionResult> Cancel(int id)
    {
        var meeting = await _context.EmergencyMeetings.FindAsync(id);
        if (meeting == null) return NotFound();

        meeting.IsResolved = true;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Meeting cancelled." });
    }
}