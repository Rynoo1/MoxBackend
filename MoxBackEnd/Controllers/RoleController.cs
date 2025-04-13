using Microsoft.AspNetCore.Mvc;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Models;
using System.Threading.Tasks;

namespace MoxBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRole _roleService;

        public RoleController(IRole roleService)
        {
            _roleService = roleService;
        }

        [HttpPost("SetRole")]
        public async Task<IActionResult> SetRole(string userId, int projectId, int roleId)
        {
            try
            {
                var result = await _roleService.SetRole(userId, projectId, roleId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetUserRole")]
        public async Task<IActionResult> GetUserRole(string userId, int projectId)
        {
            var result = await _roleService.GetUserRole(userId, projectId);
            if (result == null)
                return NotFound("User role not found");

            return Ok(result);
        }

        [HttpPut("UpdateUserRole")]
        public async Task<IActionResult> UpdateUserRole(string userId, int projectId, int newRoleId)
        {
            try
            {
                var result = await _roleService.UpdateUserRole(userId, projectId, newRoleId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("RemoveUserRole")]
        public async Task<IActionResult> RemoveUserRole(string userId, int projectId)
        {
            var result = await _roleService.RemoveUserRole(userId, projectId);
            if (!result)
                return NotFound("User role not found");

            return Ok("User role removed successfully");
        }
    }
}
