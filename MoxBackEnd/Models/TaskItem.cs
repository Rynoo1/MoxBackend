using System.ComponentModel.DataAnnotations;

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

        [Required]
        public bool IsCompleted { get; set; } = false;

        public int? AssignedUserId { get; set; }

        public User? AssignedUser { get; set; }

    }
}