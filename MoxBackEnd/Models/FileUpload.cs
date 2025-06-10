using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;

namespace MoxBackEnd.Models;

public class FileUpload
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int FileUploadID { get; set; }
    [Required]
    public int ProjectID { get; set; } //FK
    public int? SubTaskID { get; set; }
    public int TaskId { get; set; }

    [Required]
    public string FilePath { get; set; } = string.Empty;
    [Required]
    public string FileName { get; set; } = string.Empty;
    public DateTime UploadDate { get; set; }

    //Navigation properties
    public Projects? Project { get; set; }
    public Tasks Task { get; set; } = null!;


}
