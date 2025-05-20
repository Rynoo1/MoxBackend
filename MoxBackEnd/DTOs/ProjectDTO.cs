namespace MoxBackEnd.Dtos;

public class ProjectCreateDto
{
    public string ProjectName { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public string GroupName { get; set; } = string.Empty;
}

public class ProjectUpdateDto
{
    public string ProjectName { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public string Group { get; set; } = string.Empty;
}

public class ProjectReadDto
{
    public int ProjectID { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public string GroupID { get; set; } = string.Empty;
}
