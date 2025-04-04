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
    public string RoleDescription { get; set; } = string.Empty;



    //TODO - Navigation properties - ICollection does not exist
    // public ICollection<User> Users { get; set; } = new List<User>(); -- fetch/connect to a list
    public Users? User { get; set; } // fetch/connect to a single 
    public Projects? Projects { get; set; }
    // public ICollection<Projects> Projects { get; set; } = new List<Projects>();
}
