using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoxBackEnd.Models
{
    public class Group
    {
        [Key]
        public string GroupID { get; set; } = Guid.NewGuid().ToString();  // Optional: auto-generate

        [Required]
        public string GroupName { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        // Assuming file uploads are stored as paths or URLs
        public string[] FileUploads { get; set; } = Array.Empty<string>();

        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
        public ICollection<User> Users { get; set; } = new List<User>();
        public ICollection<Role> Roles { get; set; } = new List<Role>();
    }
}
