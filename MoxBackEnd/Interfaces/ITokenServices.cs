using System;

namespace MoxBackEnd.Interfaces;

public interface ITokenServices
{
    string GenerateToken(string userId, string userEmail);
}
