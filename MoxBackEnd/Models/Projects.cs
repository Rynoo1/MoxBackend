using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoxBackEnd.Models;

public class Projects
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ProjectID { get; set; }

    public string ProjectName { get; set; } = string.Empty;

    public DateTime? DueDate { get; set; }

    // ✅ Foreign Key to Group
    [Required]
    public string GroupID { get; set; } = string.Empty;

    // ✅ Navigation to Group
    public Group? Group { get; set; }

    public List<FileUpload> FileUploads { get; set; } = new List<FileUpload>();
    public List<AppRoles> AppRoles { get; set; } = new List<AppRoles>();
    public List<Tasks> Tasks { get; set; } = new List<Tasks>();
    public ICollection<StickyNote> StickyNotes { get; set; } = new List<StickyNote>();
    public ICollection<Users> Users { get; set; } = new List<Users>();
}