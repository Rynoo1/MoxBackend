using System.ComponentModel.DataAnnotations;

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

        // Optional: connect to a group/project
        public int? GroupId { get; set; }
        public Group? Group { get; set; }

        // Who created the meeting
        [Required]
        public int CreatedByUserId { get; set; }
        public User CreatedBy { get; set; } = null!;

        // Attendees (many-to-many)
        public ICollection<User> Attendees { get; set; } = new List<User>();
    }
}