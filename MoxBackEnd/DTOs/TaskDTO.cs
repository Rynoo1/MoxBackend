using MoxBackEnd.Models;

public class TaskDto
{
    public int TaskId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public PriorityLevel Priority { get; set; }
    public bool IsEmergency { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime? CompletedAt { get; set; }
    public WorkStatus Status { get; set; }
}

