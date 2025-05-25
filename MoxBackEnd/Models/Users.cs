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
  public ICollection<EmergencyMeeting> Meetings { get; set; } = [];
  public ICollection<EmergencyMeeting> CreatedMeetings { get; set; } = [];
  public ICollection<StickyNote> StickyNotes { get; set; } = [];
  public ICollection<Projects> Projects { get; set; } = [];
  public ICollection<Tasks> AssignedTasks { get; set; } = [];
  
}
