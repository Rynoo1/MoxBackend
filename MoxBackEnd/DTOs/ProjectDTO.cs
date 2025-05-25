namespace MoxBackEnd.Dtos;

public class ProjectCreateDto
{
    public string ProjectName { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    
}

public class ProjectUpdateDto
{
    public string ProjectName { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    
}

public class ProjectReadDto
{
    public int ProjectID { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    
}
