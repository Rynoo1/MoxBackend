using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoxBackEnd.Models
{
    public class SubTask
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        public bool IsCompleted { get; set; } = false;

        public DateTime? CompletedDate { get; set; }

        public int? AssignedUserId { get; set; }
        public User? AssignedUser { get; set; }

        [Required]
        public int Priority { get; set; }

        // Link to parent TaskItem
        public int? TaskItemId { get; set; }
        public TaskItem? TaskItem { get; set; }
    }
}