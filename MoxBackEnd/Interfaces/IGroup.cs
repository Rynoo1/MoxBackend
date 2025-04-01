using System;

namespace MoxBackEnd.Interfaces;

public interface IGroup
{
    string GroupID { get; set; }
    string GroupName { get; set; }
    DateTime? DueDate { get; set; }
    string[] FileUploads { get; set; }
}
