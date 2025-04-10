using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoxBackEnd.Models;

public class Projects
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ProjectsID { get; set; } // PK
    public string ProjectName { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }

    //Navigation Properties
    public List<FileUpload> FileUploads { get; set; } = new List<FileUpload>();
    public List<AppRoles> AppRoles { get; set; } = new List<AppRoles>();
    public List<Tasks> Tasks { get; set; } = [];
}
