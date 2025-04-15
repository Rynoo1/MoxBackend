using System.ComponentModel.DataAnnotations;

namespace MoxBackEnd.Models.DTOs;

public class GroupDto
{
    [Required]
    public string GroupName { get; set; } = string.Empty;

    public DateTime? DueDate { get; set; }

    public string[] FileUploads { get; set; } = Array.Empty<string>();

    public List<string> MemberIds { get; set; } = new();
}