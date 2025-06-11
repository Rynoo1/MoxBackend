using MoxBackEnd.Data;
using MoxBackEnd.Models;
using MoxBackEnd.Dtos;
using MoxBackEnd.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;


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
            DueDate = dto.DueDate.HasValue
                ? DateTime.SpecifyKind(dto.DueDate.Value, DateTimeKind.Utc)
                : null
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();


        if (dto.Tasks != null)
        {
            foreach (var taskDto in dto.Tasks)
            {
                var task = new Tasks
                {
                    Title = taskDto.Title,
                    Description = taskDto.Description,
                    Priority = (PriorityLevel)taskDto.Priority,
                    DueDate = taskDto.DueDate.HasValue
                        ? DateTime.SpecifyKind(taskDto.DueDate.Value, DateTimeKind.Utc)
                        : default(DateTime),
                    ProjectID = project.ProjectID
                };
                _context.Tasks.Add(task);
                await _context.SaveChangesAsync();

                if (taskDto.SubTasks != null)
                {
                    foreach (var subDto in taskDto.SubTasks)
                    {
                        var subTask = new SubTasks
                        {
                            Title = subDto.Title,
                            Description = subDto.Description,
                            Priority = (PriorityLevel)subDto.Priority,
                            DueDate = subDto.DueDate.HasValue
                                ? DateTime.SpecifyKind(subDto.DueDate.Value, DateTimeKind.Utc)
                                : default(DateTime),
                            TaskId = task.TaskId,
                            ProjectID = project.ProjectID
                        };


                        if (subDto.AssignedUserIds != null)
                        {
                            foreach (var userId in subDto.AssignedUserIds)
                            {
                                var user = await _context.Users.FindAsync(userId);
                                if (user != null)
                                {
                                    subTask.AssignedUsers.Add(user);
                                }
                            }
                        }

                        _context.SubTasks.Add(subTask);
                        await _context.SaveChangesAsync();
                    }
                }
            }
        }

        return new ProjectReadDto
        {
            ProjectID = project.ProjectID,
            ProjectName = project.ProjectName,
            DueDate = project.DueDate
        };
    }

    public async Task<ProjectReadDto?> GetProjectById(int id)
    {
        var project = await _context.Projects
            .Include(p => p.Tasks)
                .ThenInclude(t => t.SubTasks)
                    .ThenInclude(st => st.AssignedUsers)
            .FirstOrDefaultAsync(p => p.ProjectID == id);

        if (project == null) return null;

        return new ProjectReadDto
        {
            ProjectID = project.ProjectID,
            ProjectName = project.ProjectName,
            DueDate = project.DueDate,
            Tasks = new List<TaskReadDto>(
                project.Tasks.Select(t => new TaskReadDto
                {
                    TaskId = t.TaskId,
                    Title = t.Title,
                    Description = t.Description ?? string.Empty,
                    Priority = (int)t.Priority,
                    DueDate = t.DueDate,
                    SubTasks = new List<SubTaskReadDto>(
                        t.SubTasks.Select(st => new SubTaskReadDto
                        {
                            SubTaskID = st.SubTaskID,
                            Title = st.Title,
                            Description = st.Description ?? string.Empty,
                            Priority = (int)st.Priority,
                            DueDate = st.DueDate,
                            AssignedUsers = new List<UserDto>(
                                st.AssignedUsers.Select(u => new UserDto
                                {
                                    Id = u.Id,
                                    UserName = u.UserName ?? string.Empty
                                })
                            )
                        })
                    )
                })
            )
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


    public async Task<bool> UpdateProjectWithTasksAsync(ProjectCreateDto dto)
    {
        var project = await _context.Projects
            .Include(p => p.Tasks)
                .ThenInclude(t => t.SubTasks)
            .FirstOrDefaultAsync(p => p.ProjectID == dto.ProjectID);

        if (project == null) return false;

        project.ProjectName = dto.ProjectName;
        project.DueDate = dto.DueDate.HasValue
            ? DateTime.SpecifyKind(dto.DueDate.Value, DateTimeKind.Utc)
            : null;


        var dtoTaskIds = dto.Tasks?.Select(t => t.TaskId).ToHashSet() ?? new HashSet<int>();
        var tasksToRemove = project.Tasks.Where(t => !dtoTaskIds.Contains(t.TaskId)).ToList();
        foreach (var task in tasksToRemove)
        {
            _context.SubTasks.RemoveRange(task.SubTasks);
            _context.Tasks.Remove(task);
        }


        if (dto.Tasks != null)
        {
            foreach (var taskDto in dto.Tasks)
            {
                var task = project.Tasks.FirstOrDefault(t => t.TaskId == taskDto.TaskId);
                if (task == null)
                {

                    task = new Tasks
                    {
                        Title = taskDto.Title,
                        Description = taskDto.Description,
                        DueDate = taskDto.DueDate.HasValue
                            ? DateTime.SpecifyKind(taskDto.DueDate.Value, DateTimeKind.Utc)
                            : default(DateTime),
                        Priority = (PriorityLevel)taskDto.Priority,
                        ProjectID = project.ProjectID,
                        SubTasks = new List<SubTasks>()
                    };
                    _context.Tasks.Add(task);
                }
                else
                {

                    task.Title = taskDto.Title;
                    task.Description = taskDto.Description;
                    task.DueDate = taskDto.DueDate.HasValue
                        ? DateTime.SpecifyKind(taskDto.DueDate.Value, DateTimeKind.Utc)
                        : default(DateTime);
                    task.Priority = (PriorityLevel)taskDto.Priority;
                }


                var dtoSubIds = taskDto.SubTasks?.Select(st => st.SubTaskID).ToHashSet() ?? new HashSet<int>();
                var subsToRemove = task.SubTasks.Where(st => !dtoSubIds.Contains(st.SubTaskID)).ToList();
                foreach (var sub in subsToRemove)
                {
                    task.SubTasks.Remove(sub);
                    _context.SubTasks.Remove(sub);
                }

                if (taskDto.SubTasks != null)
                {
                    foreach (var subDto in taskDto.SubTasks)
                    {
                        var sub = task.SubTasks.FirstOrDefault(st => st.SubTaskID == subDto.SubTaskID);
                        if (sub == null)
                        {
                            sub = new SubTasks
                            {
                                Title = subDto.Title,
                                Description = subDto.Description,
                                DueDate = subDto.DueDate.HasValue
                                    ? DateTime.SpecifyKind(subDto.DueDate.Value, DateTimeKind.Utc)
                                    : default(DateTime),
                                Priority = (PriorityLevel)subDto.Priority,
                                TaskId = task.TaskId,
                                ProjectID = project.ProjectID
                            };
                            task.SubTasks.Add(sub);
                        }
                        else
                        {
                            sub.Title = subDto.Title;
                            sub.Description = subDto.Description;
                            sub.DueDate = subDto.DueDate.HasValue
                                ? DateTime.SpecifyKind(subDto.DueDate.Value, DateTimeKind.Utc)
                                : default(DateTime);
                            sub.Priority = (PriorityLevel)subDto.Priority;
                        }


                        if (subDto.AssignedUserIds != null)
                        {
                            // Remove all existing assignments for this subtask from the join table
                            var existingAssignments = _context.SubTaskUserAssignments
                                .Where(a => a.AssignedSubTasksSubTaskID == sub.SubTaskID);
                            _context.SubTaskUserAssignments.RemoveRange(existingAssignments);

                            // Save changes to ensure deletes are executed before inserts
                            await _context.SaveChangesAsync();

                            // Add new assignments (deduplicated)
                            foreach (var userId in subDto.AssignedUserIds.Distinct())
                            {
                                _context.SubTaskUserAssignments.Add(new SubTaskUserAssignment
                                {
                                    AssignedSubTasksSubTaskID = sub.SubTaskID,
                                    AssignedUsersId = userId
                                });
                            }
                        }
                    }
                }
            }
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<ProjectReadDto?> UpdateProjectAsync(int id, ProjectUpdateDto dto)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null) return null;

        project.ProjectName = dto.ProjectName;
        project.DueDate = dto.DueDate.HasValue
            ? DateTime.SpecifyKind(dto.DueDate.Value, DateTimeKind.Utc)
            : null;

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

    public Task<Projects> AddUserAsync(Users user)
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<ProjectUserDto>> GetProjectMembersAsync(int projectId)
    {
        var members = await _context.ProjectUsers
            .Where(pu => pu.ProjectID == projectId)
            .Select(pu => new ProjectUserDto
            {
                Id = pu.User.Id,
                UserName = pu.User.UserName,
                Email = pu.User.Email
            })
            .ToListAsync();

        return members;
    }


    public Task<bool> AssignUserToProjectAsync(int projectId, string userId)
    {
        throw new NotImplementedException();
    }

    public Task<bool> UnassignUserFromProjectAsync(int projectId, string userId)
    {
        throw new NotImplementedException();
    }
}



