using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MoxBackEnd.Data;
using MoxBackEnd.Interfaces;

namespace MoxBackEnd.Models;

public class AppRoles
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int RoleID { get; set; } // PK
    public string UserID { get; set; } = string.Empty; //FK
    public int ProjectID { get; set; } //FK
    public string RoleDescription { get; set; } = string.Empty; // rolename


    // Navigation properties
    public Users? User { get; set; }
    public Projects? Project { get; set; }
}
