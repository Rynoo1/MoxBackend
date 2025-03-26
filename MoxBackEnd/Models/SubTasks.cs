using System;

namespace MoxBackEnd.Controllers;

public class SubTasks
{
    /// <summary>
    /// The ID of the task
    /// 
    /// </summary>
    
    [Key]
    public int TaskID { get; set; } 
    public string Title { get; set; }
    public string? Description { get; set; }
    public DateTime DueDate { get; set; }
    public bool IsCompleted { get; set; } = false;
    public DateTime? CompletedDate { get; set; }
    public int? AssignedUserID { get; set; }
    public User? AssignedUser { get; set; }
    public int Priority { get; set; }
    public int? ParentTaskId { get; set; }
    public TaskItem? ParentTask { get; set; }
    public ICollection<TaskItem> Subtasks { get; set; } = new List<TaskItem>();
    public ICollection<SubTasks> SubTasks { get; set; } = new List<SubTasks>();
    
    
}
