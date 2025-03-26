using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoxBackEnd.Models
{
    public class EmergencyMeeting
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        public string? Location { get; set; }

        // Link to group/project (optional)
        public string? GroupID { get; set; }
        public Group? Group { get; set; }

        [Required]
        public int CreatedByUserId { get; set; }
        public User CreatedBy { get; set; } = null!;

        // Who should attend
        public ICollection<User> Attendees { get; set; } = new List<User>();
    }
}