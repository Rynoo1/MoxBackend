using System;
using System.ComponentModel.DataAnnotations;

namespace MoxBackEnd.Models
{
    public class Roles
    {
        [Key]
        public string RoleID { get; set; } // Primary key
        public string RoleName { get; set; }
        public string RoleDescription { get; set; }
    }
}