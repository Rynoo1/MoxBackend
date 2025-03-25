using System;

namespace MoxBackEnd.Models;

public class Users
{
     
    [Key]
    public string UserName { get; set; }
    public string UserID { get; set; } // PK
    public string UEmail { get; set; } 
    public string UPassword { get; set; }  
    public string ComfirmPassword { get; set; } 
    public string UFirstName { get; set; }
    public string ULastName { get; set; }
    public string UPhoneNumber { get; set; }
    public string ProfileImage { get; set; }
    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    public ICollection<Groups> Groups { get; set; } = new List<Groups>();
    public ICollection<Roles> Roles { get; set; } = new List<Roles>();
    
}
