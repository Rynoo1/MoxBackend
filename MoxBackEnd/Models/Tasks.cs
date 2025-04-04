using System;

namespace MoxBackEnd.Models;

public class Tasks
{
         [Key]
        public int TaskId { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public int Priority { get; set; }

        [Required]
        public bool IsEmergency { get; set; } = false;

        [Required]
        public DateTime DueDate { get; set; }

        public DateTime? CompletedAt { get; set; }

        [Required]
        public bool IsCompleted { get; set; } = false;

        public int? AssignedUserId { get; set; }
        public User? AssignedUser { get; set; }

        public string? ProjectsID { get; set; }
        public Group? Projects { get; set; }

        public int? ParentTaskId { get; set; }
        public TaskItem? ParentTask { get; set; }

        public ICollection<TaskItem> Subtasks { get; set; } = new List<TaskItem>();
}
