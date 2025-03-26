using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoxBackEnd.Models
{
    public class TaskItem
    {
        [Key]
        public int Id { get; set; }

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

        // Assigned user
        public int? AssignedUserId { get; set; }
        public User? AssignedUser { get; set; }

        // Group/project this task belongs to
        public string? GroupID { get; set; }
        public Group? Group { get; set; }

        // Optional: For parent-child structure
        public int? ParentTaskId { get; set; }
        public TaskItem? ParentTask { get; set; }

        public ICollection<TaskItem> Subtasks { get; set; } = new List<TaskItem>();
    }
}