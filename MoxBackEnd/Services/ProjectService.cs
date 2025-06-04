using MoxBackEnd.Data;
using MoxBackEnd.Models;
using MoxBackEnd.Dtos;
using MoxBackEnd.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MoxBackEnd.Services;

public class ProjectService : IProjects
{
    private readonly AppDbContext _context;

    public ProjectService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ProjectReadDto> CreateProjectAsync(ProjectCreateDto dto)
    {
        var project = new Projects
        {
            ProjectName = dto.ProjectName,
            DueDate = dto.DueDate
            
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return new ProjectReadDto
        {
            ProjectID = project.ProjectID,
            ProjectName = project.ProjectName,
            DueDate = project.DueDate
            
        };
    }

    public async Task<List<ProjectReadDto>> GetAllProjects()
    {
        var projects = await _context.Projects.ToListAsync();
        return projects.Select(p => new ProjectReadDto
        {
            ProjectID = p.ProjectID,
            ProjectName = p.ProjectName,
            DueDate = p.DueDate
            
        }).ToList();
    }

    public async Task<ProjectReadDto?> GetProjectById(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null) return null;

        return new ProjectReadDto
        {
            ProjectID = project.ProjectID,
            ProjectName = project.ProjectName,
            DueDate = project.DueDate
            
        };
    }

    public async Task<ProjectReadDto?> UpdateProjectAsync(int id, ProjectUpdateDto dto)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null) return null;

        project.ProjectName = dto.ProjectName;
        project.DueDate = dto.DueDate;
        

        await _context.SaveChangesAsync();

        return new ProjectReadDto
        {
            ProjectID = project.ProjectID,
            ProjectName = project.ProjectName,
            DueDate = project.DueDate
            
        };
    }

    public async Task<bool> DeleteProjectAsync(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null) return false;

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Projects> AddUserAsync(Users user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var project = await _context.Projects
            .Include(p => p.Users)
            .FirstOrDefaultAsync(p => p.Users.Contains(user));

        return project!;
    }

    public async Task<IEnumerable<ProjectUserDto>> GetProjectMembersAsync(int projectId)
    {
        return await _context.ProjectUsers
            .Where(pu => pu.ProjectID == projectId)
            .Include(pu => pu.User)
            .Select(pu => new ProjectUserDto
            {
                Id = pu.User.Id,
                UserName = pu.User.UserName,
                Email = pu.User.Email
            })
            .ToListAsync();
    }

    public async Task<bool> AssignUserToProjectAsync(int projectId, string userId)
    {
        var exists = await _context.ProjectUsers.AnyAsync(pu => pu.ProjectID == projectId && pu.UserID == userId);
        if (exists) return false;

        _context.ProjectUsers.Add(new ProjectUser
        {
            ProjectID = projectId,
            UserID = userId
        });

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UnassignUserFromProjectAsync(int projectId, string userId)
    {
        var entry = await _context.ProjectUsers
            .FirstOrDefaultAsync(pu => pu.ProjectID == projectId && pu.UserID == userId);

        if (entry == null) return false;

        _context.ProjectUsers.Remove(entry);
        await _context.SaveChangesAsync();
        return true;
    }
}
