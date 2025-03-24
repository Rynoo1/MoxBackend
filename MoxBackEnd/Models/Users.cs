using System;

namespace MoxBackEnd.Models;

public class Users
{
    /// <summary>
    /// User table model
    /// 
    /// UserName : string
    /// UserID : string PK
    /// UEmail : string
    /// UPassword : strink
    /// </summary>
    
    public string UserName { get; set; }
    public string UserID { get; set; } // PK
    public string UEmail { get; set; } 
    public string UPassword { get; set; }


}
