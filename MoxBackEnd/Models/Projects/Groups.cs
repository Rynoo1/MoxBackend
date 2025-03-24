using System;

namespace MoxBackEnd.Models.Projects;

public class Groups
{
    /// <summary>
    /// Groups table model
    /// GroupID : string PK
    /// GroupName : string
    /// DueDate : DateTime
    /// FileUploads : array
    /// </summary>
    
    public string GroupID { get; set; } // PK
    public string GroupName { get; set; }
    public DateTime DueDate { get; set; }
    public string[] FileUploads { get; set; }
}
