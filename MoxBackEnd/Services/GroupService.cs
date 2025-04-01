using System;
using MoxBackEnd.Interfaces;


namespace MoxBackEnd.Services;

public class GroupService : IGroup
{
    public string GroupID { get; set; }
    public string GroupName { get; set; }
    public DateTime? DueDate { get; set; }
    public string[] FileUploads { get; set; }

}
