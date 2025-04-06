using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoxBackEnd.Models;

public class SubTasks
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int SubTaskID { get; set; } // PK

    //[Required]
    //[ForeignKey("Tasks")]
    //public int TaskID { get; set; } // FK to Tasks table
    
    [Required]
    //[ForeignKey("Projects")]
    public int ProjectsId { get; set; } // FK to Projects table

    [Required]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateTime DueDate { get; set; }

    public enum TaskStatus { NotStarted, InProgress, Completed, Canceled }
    public TaskStatus SubTStatus { get; set; } = TaskStatus.NotStarted;

    public DateTime? CompletedDate { get; set; }

    // [Required]
    // //[ForeignKey("Users")]
    // public int? AssignedUserID { get; set; }

    // [Required]
    // public Users? AssignedUser { get; set; }

    public enum PriorityLevel { Low, Medium, High }
    public PriorityLevel Priority { get; set; } = PriorityLevel.Low;

    public int? ParentTaskId { get; set; } = -1; // FK to parent task, -1 if no parent task
    public bool IsEmergency { get; set; } = false;


    
    // Navigation properties
    public Tasks? ParentTask { get; set; } // Navigation property to parent task
    public Projects? Projects { get; set; } // Navigation property to Projects table
    //public Users? Users { get; set; } // Navigation property to Users table

    public ICollection<Users> AssignedUsers { get; set; } = []; // Many to Many navigation property
}
