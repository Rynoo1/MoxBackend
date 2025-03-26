using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MoxBackEnd.Models
{
    public class Tasks
    {
        [Key]
        public int TaskID { get; set; } // Primary key
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? CompletedDate { get; set; }
        public int? AssignedUserID { get; set; }
        public int Priority { get; set; }
        public int? ParentTaskId { get; set; }
        public ICollection<Tasks> Subtasks { get; set; } = new List<Tasks>();
    }
}