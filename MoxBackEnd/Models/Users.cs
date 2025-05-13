using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace MoxBackEnd.Models;

public class Users : IdentityUser
{
  public string? ProfilePicture { get; set; }

  //Navigation Properties
  public List<AppRoles> AppRoles { get; set; } = []; 

  public ICollection<SubTasks> AssignedSubTasks { get; set; } = [];
  public ICollection<Group> Groups { get; set; } = new List<Group>();
  public ICollection<EmergencyMeeting> Meetings { get; set; } = new List<EmergencyMeeting>();
  public ICollection<EmergencyMeeting> CreatedMeetings { get; set; } = new List<EmergencyMeeting>();
  public ICollection<StickyNote> StickyNotes { get; set; } = new List<StickyNote>();
  public ICollection<Projects> Projects { get; set; } = new List<Projects>();
  public ICollection<Tasks> AssignedTasks { get; set; } = new List<Tasks>();
  
}
