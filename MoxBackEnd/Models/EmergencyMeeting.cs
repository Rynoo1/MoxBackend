using System;

namespace MoxBackEnd.Models;

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

        public string? ProjectsID { get; set; }
        public Projects? Projects { get; set; }

        [Required]
        public int CreatedByUserId { get; set; }
        public User CreatedBy { get; set; } = null!;

        // Who should attend
        public ICollection<User> Attendees { get; set; } = new List<User>();
}
