using System;

namespace MoxBackEnd.Models;

public class Tasks
{
    /// <summary>
    /// Tasks table model
    /// TaskID : string PK
    /// TaskName : string
    /// State : string
    /// DueDate : DateTime
    /// GroupID : string FK
    /// </summary>
    
    public string TaskID { get; set; } // PK
    public string TaskName { get; set; }
    public string State { get; set; }
    public DateTime DueDate { get; set; }
    public string GroupID { get; set; } // FK
}
