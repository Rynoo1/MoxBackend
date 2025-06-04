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

    public List<FileUpload> FileUploads { get; set; } = [];
    public List<AppRoles> AppRoles { get; set; } = [];
    public List<Tasks> Tasks { get; set; } = [];
    public ICollection<Comment> Comments { get; set; } = [];
    public ICollection<Users> Users { get; set; } = [];
    public ICollection<ProjectUser> ProjectUsers { get; set; } = new List<ProjectUser>();
}