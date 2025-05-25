using System;
using System.Collections.Generic;
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

        public int? ProjectID { get; set; }
        public Projects? Project { get; set; }

        [Required]
        public string CreatedByUserId { get; set; } = string.Empty;
        public Users CreatedBy { get; set; } = null!;

        public ICollection<Users> Attendees { get; set; } = new List<Users>();

        public bool IsResolved { get; set; } = false;
    }
}