using System;

namespace MoxBackEnd.Models;

public class Projects
{
        public string ProjectsID { get; set; } // PK
    public string ProjectsName { get; set; }
    public TimeDate? DueDate { get; set; }
    public string[] FileUploads { get; set; }

    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<Roles> Roles { get; set; } = new List<Roles>();
}
