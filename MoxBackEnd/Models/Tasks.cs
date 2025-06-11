using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoxBackEnd.Models;

public class Tasks
{
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TaskId { get; set; }

        [Required]
        public int ProjectID { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; } = string.Empty;

        [Required]
        public PriorityLevel Priority { get; set; } = PriorityLevel.Medium;


        [Required]
        public bool IsEmergency { get; set; } = false;


        [Column(TypeName = "timestamp with time zone")]
        public DateTime? DueDate { get; set; }

        [Column(TypeName = "timestamp with time zone")]
        public DateTime? CompletedAt { get; set; }

        [Required]
        public WorkStatus Status { get; set; } = WorkStatus.NotStarted;

        public Projects? Project { get; set; }
        public List<SubTasks> SubTasks { get; set; } = [];
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        

        public string? AssignedUserId { get; set; }
        public Users? AssignedUser { get; set; }


}
