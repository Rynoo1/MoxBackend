using System;
using MoxBackEnd.Models;
using System.ComponentModel.DataAnnotations;

namespace MoxBackEnd.DTOs
{
    public class TaskCreateDto
    {
        [Required]
        public int ProjectID { get; set; }

        [Required]
        public string? Title { get; set; }

        public string? Description { get; set; }

        [Required]
        public PriorityLevel Priority { get; set; }

        [Required]
        public bool IsEmergency { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        public DateTime? CompletedAt { get; set; }

        [Required]
        public WorkStatus Status { get; set; } = WorkStatus.NotStarted;
        public string? AssignedUserId { get; set; }

    }
}
