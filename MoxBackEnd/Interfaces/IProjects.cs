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
}
