using System;
using System.ComponentModel.DataAnnotations;

namespace MoxBackEnd.Models
{
    public class SubTasks
    {
        [Key]
        public int SubTaskID { get; set; } // Primary key
        public string Title { get; set; }
        public string? Description { get; set; }
        public DateTime DueDate { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? CompletedDate { get; set; }
        public int? AssignedUserID { get; set; }
        public int Priority { get; set; }
        public int? ParentTaskId { get; set; }
    }
}