using System;

namespace MoxBackEnd.Controllers;

public class SubTasks
{
    /// <summary>
    /// SubTasks table model
    /// SubTaskID : string PK
    /// Title : string
    /// Description : string
    /// State : string
    /// TaskID : string FK
    /// </summary>
    
    public string SubTaskID { get; set; } // PK
    public string Title { get; set; }
    public string Description { get; set; }
    public string State { get; set; }
    public string TaskID { get; set; } // FK
    
}
