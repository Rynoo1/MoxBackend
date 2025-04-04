using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoxBackEnd.Models;

public class Roles
{

    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int RoleID { get; set; } // PK


    public string RoleName { get; set; } = string.Empty;
    public string RoleDescription { get; set; } 



    //TODO - Navigation properties - ICollection does not exist
    // public ICollection<User> Users { get; set; } = new List<User>();
    // public ICollection<Projects> Projects { get; set; } = new List<Projects>();
}
