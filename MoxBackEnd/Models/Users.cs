using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MoxBackEnd.Models
{
    public class Users
    {
        [Key]
        public string UserID { get; set; } // Primary key
        public string UserName { get; set; }
        public string UEmail { get; set; }
        public string UPassword { get; set; }
        public string ComfirmPassword { get; set; }
        public string UFirstName { get; set; }
        public string ULastName { get; set; }
        public string UPhoneNumber { get; set; }
        public string ProfileImage { get; set; }
        public ICollection<Tasks> Tasks { get; set; } = new List<Tasks>();
        public ICollection<Roles> Roles { get; set; } = new List<Roles>();
    }
}