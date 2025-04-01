using System;
using MoxBackEnd.Interfaces;

namespace MoxBackEnd.Services;

public class SubTaskService : ISubTask
{
    public int TaskID { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public DateTime DueDate { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? CompletedDate { get; set; }
    public int? AssignedUserID { get; set; }
    public int Priority { get; set; }
    public int? ParentTaskId { get; set; }

}
