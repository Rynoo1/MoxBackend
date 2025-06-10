using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using MoxBackEnd.Interfaces;

namespace MoxBackEnd.Services;

public class TokenServices : ITokenServices
{
    private readonly IConfiguration _config;

    public TokenServices(IConfiguration configuration)
    {
        _config = configuration;
    }

    public string GenerateToken(string userId, string userEmail, string userName)
    {
        var jwtSettings = _config.GetSection("JwtSettings");
        var secret = jwtSettings["Secret"];
        if (string.IsNullOrEmpty(secret))
        {
            throw new InvalidOperationException("JWT Secret is not configured.");
        }
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));

        var claims = new[]
        {
            new Claim("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier", userId),
            new Claim("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress", userEmail),
            new Claim("username", userName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat,
                        DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
                        ClaimValueTypes.Integer64)
        };

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(30),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
