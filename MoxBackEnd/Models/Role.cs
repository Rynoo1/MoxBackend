using System;
using System.ComponentModel.DataAnnotations;

namespace MoxBackEnd.Models
{
    public class Role
    {
        [Key]
        public string RoleID { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string RoleName { get; set; } = string.Empty;

        public string? RoleDescription { get; set; }

        // Navigation properties
        public ICollection<User> Users { get; set; } = new List<User>();
        public ICollection<Group> Groups { get; set; } = new List<Group>();
    }
}