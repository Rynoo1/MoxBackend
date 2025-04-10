using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace MoxBackEnd.Models;

public class Users : IdentityUser
{
  // [Key]
  // [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  // public int UserID { get; set; } // PK
  // public string UserName { get; set; } = string.Empty;
  // public string UEmail { get; set; } = string.Empty;
  // public string UPassword { get; set; } = string.Empty;
  public string? ProfilePicture { get; set; }

  //Navigation Properties
  public List<AppRoles> AppRoles { get; set; } = []; 

  public ICollection<SubTasks> AssignedSubTasks { get; set; } = [];
}
