using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Models;
using MoxBackEnd.Services;
using MoxBackEnd.Models.DTOs;

namespace MoxBackEnd.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GroupController : ControllerBase
{
    private readonly IGroup _service;

    public GroupController(IGroup service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllGroupsAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(string id)
    {
        var group = await _service.GetGroupByIdAsync(id);
        return group == null ? NotFound() : Ok(group);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] GroupDto dto)
    {
        var users = await _service.GetUsersByIdsAsync(dto.MemberIds);

        var group = new Group
        {
            GroupName = dto.GroupName,
            DueDate = dto.DueDate,
            FileUploads = dto.FileUploads,
            Users = users
        };

        var created = await _service.CreateGroupAsync(group);
        return CreatedAtAction(nameof(Get), new { id = created.GroupID }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] Group group)
    {
        var updated = await _service.UpdateGroupAsync(id, group);
        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _service.DeleteGroupAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPost("{groupId}/add-user/{userId}")]
    public async Task<IActionResult> AddUser(string groupId, string userId)
    {
        var added = await _service.AddUserToGroupAsync(groupId, userId);
        return added ? Ok() : NotFound();
    }

    [HttpDelete("{groupId}/remove-user/{userId}")]
    public async Task<IActionResult> RemoveUser(string groupId, string userId)
    {
        var removed = await _service.RemoveUserFromGroupAsync(groupId, userId);
        return removed ? Ok() : NotFound();
    }
}