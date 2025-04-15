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
        public int ProjectID { get; set; } // FK to Projects table

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; } = string.Empty;

        [Required]
        public PriorityLevel Priority { get; set; } = PriorityLevel.Medium;


        [Required]
        public bool IsEmergency { get; set; } = false;

        [Required]
        public DateTime DueDate { get; set; } 
        public DateTime? CompletedAt { get; set; }

        [Required]
        public WorkStatus Status { get; set; } = WorkStatus.NotStarted;

        // Navigation properties
        public Projects? Project { get; set; } // Navigation property to Projects table
        public List<SubTasks> SubTasks { get; set; } = [];
        public ICollection<StickyNote> StickyNotes { get; set; } = new List<StickyNote>();

        public string? AssignedUserId { get; set; }
        public Users? AssignedUser { get; set; }
}
