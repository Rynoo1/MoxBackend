using System;
using System.ComponentModel.DataAnnotations;
using MoxBackEnd.Models;

namespace MoxBackEnd.DTOs
{
    public class TaskCreateDto
    {
        public int ProjectID { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public PriorityLevel Priority { get; set; }
        public WorkStatus Status { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? CompletedAt { get; set; }
        public bool IsEmergency { get; set; }
        public string? AssignedUserId { get; set; }
        // public string? AttachmentPath { get; set; }

    }

}
