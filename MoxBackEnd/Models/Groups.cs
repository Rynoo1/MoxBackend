using System;

namespace MoxBackEnd.Models;

public class Groups
{
    
    
    public string GroupID { get; set; } // PK
    public string GroupName { get; set; }
    public TimeDate? DueDate { get; set; }
    public string[] FileUploads { get; set; }

    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<Roles> Roles { get; set; } = new List<Roles>();
    

}
