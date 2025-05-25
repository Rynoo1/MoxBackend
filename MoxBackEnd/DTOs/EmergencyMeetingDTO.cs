using System.ComponentModel.DataAnnotations;

namespace MoxBackEnd.Models.DTOs;

public class EmergencyMeetingDto
{
    [Required]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required]
    public DateTime StartTime { get; set; }

    [Required]
    public DateTime EndTime { get; set; }

    public string? Location { get; set; }

    public int? ProjectID { get; set; }

    [Required]
    public string CreatedByUserId { get; set; } = string.Empty;

    public List<string> Attendees { get; set; } = new();

    public bool IsResolved { get; set; }
}