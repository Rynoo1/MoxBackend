using MoxBackEnd.Dtos;
using MoxBackEnd.Models;

namespace MoxBackEnd.Interfaces;

public interface IProjects
{
    Task<ProjectReadDto> CreateProjectAsync(ProjectCreateDto projectDto);
    Task<List<ProjectReadDto>> GetAllProjects();
    Task<ProjectReadDto?> GetProjectById(int id);
    Task<ProjectReadDto?> UpdateProjectAsync(int id, ProjectUpdateDto projectDto);
    Task<bool> DeleteProjectAsync(int id);
    Task<Projects> AddUserAsync(Users user);
    Task<IEnumerable<ProjectUserDto>> GetProjectMembersAsync(int projectId);
    Task<bool> AssignUserToProjectAsync(int projectId, string userId);
    Task<bool> UnassignUserFromProjectAsync(int projectId, string userId);
    Task<bool> UpdateProjectWithTasksAsync(ProjectCreateDto dto);
}
