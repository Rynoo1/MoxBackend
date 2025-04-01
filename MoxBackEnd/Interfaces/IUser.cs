using System;

namespace MoxBackEnd.Interfaces;

public interface IUser
{
    string UserName { get; set; }
    string UserID { get; set; }
    string UEmail { get; set; }
    string UPassword { get; set; }
    string ComfirmPassword { get; set; }
    string UFirstName { get; set; }
    string ULastName { get; set; }
    string UPhoneNumber { get; set; }
    string ProfileImage { get; set; }
}

