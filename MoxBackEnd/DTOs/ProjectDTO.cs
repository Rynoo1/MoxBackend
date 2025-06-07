namespace MoxBackEnd.Dtos;

public class ProjectCreateDto
{
    public int ProjectID { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public List<TaskCreateDto> Tasks { get; set; } = new();
    
}

public class ProjectUpdateDto
{
    public int ProjectID { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public List<TaskCreateDto> Tasks { get; set; } = new();
}

public class TaskCreateDto
{
    public int TaskId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Priority { get; set; } 
    public DateTime? DueDate { get; set; }
    public List<SubTaskCreateDto> SubTasks { get; set; } = new();
}

public class SubTaskCreateDto
{
    public int SubTaskID { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Priority { get; set; } 
    public DateTime? DueDate { get; set; }
    public List<string> AssignedUserIds { get; set; } = new();
}

public class ProjectReadDto
{
    public int ProjectID { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public List<TaskReadDto>? Tasks { get; set; }

}

public class TaskReadDto
{
    public int TaskId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Priority { get; set; }
    public DateTime? DueDate { get; set; }
    public List<SubTaskReadDto> SubTasks { get; set; } = new();
}

public class SubTaskReadDto
{
    public int SubTaskID { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Priority { get; set; }
    public DateTime? DueDate { get; set; }
    public List<UserDto> AssignedUsers { get; set; } = new();
    
}

public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
}
