using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoxBackEnd.Models;

public class Tasks
{
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TaskId { get; set; } // PK

        [Required]
        //[ForeignKey("Projects")]
        public int ProjectsId { get; set; } // FK to Projects table

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; } = string.Empty;

        [Required]
        public int Priority { get; set; } = 0; // 0 = Low, 1 = Medium, 2 = High

        [Required]
        public bool IsEmergency { get; set; } = false;

        [Required]
        public DateTime DueDate { get; set; } 
        public DateTime? CompletedAt { get; set; }

        public enum TaskStatus { NotStarted, InProgress, Completed, Canceled }
        [Required]
        public TaskStatus Status { get; set; } = TaskStatus.NotStarted;

        // Navigation properties
        public Projects? Projects { get; set; } // Navigation property to Projects table
        public List<SubTasks> SubTasks { get; set; } = [];
}
