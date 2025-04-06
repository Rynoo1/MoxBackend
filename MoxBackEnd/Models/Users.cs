using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoxBackEnd.Models;

public class Users
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  public int UserID { get; set; } // PK
  public string UserName { get; set; } = string.Empty;
  public string UEmail { get; set; } = string.Empty;
  public string UPassword { get; set; } = string.Empty;
  public string? ProfilePicture { get; set; }

  //Navigation Properties
  public List<Roles> Roles { get; set; } = []; 

  public ICollection<SubTasks> AssignedSubTasks { get; set; } = [];
}
