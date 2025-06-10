using System;
using MoxBackEnd.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MoxBackEnd.DTOs
{
    public class SubTaskCreateDto
    {
        public int SubTaskID { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public PriorityLevel Priority { get; set; }

        public DateTime? DueDate { get; set; }

        public List<string> AssignedUserIds { get; set; } = new();
    }
}
