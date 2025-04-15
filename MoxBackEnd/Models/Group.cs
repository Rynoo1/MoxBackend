using System;
using System.ComponentModel.DataAnnotations;

namespace MoxBackEnd.Models
{
    public class Group
    {
        [Key]
        public string GroupID { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string GroupName { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        public string[] FileUploads { get; set; } = Array.Empty<string>();

        public ICollection<Tasks> Tasks { get; set; } = new List<Tasks>();
        public ICollection<Users> Users { get; set; } = new List<Users>();
        public ICollection<AppRoles> Roles { get; set; } = new List<AppRoles>();

        public ICollection<Projects> Projects { get; set; } = new List<Projects>();
    }
}