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
    public int ProjectID { get; set; } // FK to Projects table

    [Required]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateTime DueDate { get; set; }

    [Required]
    public WorkStatus SubTStatus { get; set; } = WorkStatus.NotStarted;

    public DateTime? CompletedDate { get; set; }

    // [Required]
    // //[ForeignKey("Users")]
    // public int? AssignedUserID { get; set; }

    // [Required]
    // public Users? AssignedUser { get; set; }


    [Required]
    public PriorityLevel Priority { get; set; } = PriorityLevel.Medium;

    public int? TaskId { get; set; } 
    public bool IsEmergency { get; set; } = false;


    // Navigation properties
    public Tasks? Task { get; set; } // Navigation property to parent task
    public Projects? Project { get; set; } // Navigation property to Projects table
    public ICollection<Users> AssignedUsers { get; set; } = []; // Many to Many navigation property
}
