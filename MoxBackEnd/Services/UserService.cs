using System;
using MoxBackEnd.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace MoxBackEnd.Services;

public class UserService : IUser
{
    public string UserName { get; set; }
    public string UserID { get; set; }
    public string UEmail { get; set; }
    public string UPassword { get; set; }
    public string ComfirmPassword { get; set; }
    public string UFirstName { get; set; }
    public string ULastName { get; set; }
    public string UPhoneNumber { get; set; }
    public string ProfileImage { get; set; }

}