using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoxBackEnd.Data;
using MoxBackEnd.DTOs;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Models;
using MoxBackEnd.Services;
using Microsoft.AspNetCore.Identity.UI.Services;
using QRCoder;
using System.Text.Json;
using System.Security.Claims;

namespace MoxBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUser _user;
        private readonly AppDbContext _context;
        private readonly UserManager<Users> _userManager;
        private readonly IEmailSender _emailSender;
        private readonly ITokenServices _tokenservices;
        private readonly SignInManager<Users> _signInManager;
        public UserController(IUser user, AppDbContext context, UserManager<Users> userManager, IEmailSender emailSender, ITokenServices tokenServices, SignInManager<Users> signInManager)
        {
            _user = user;
            _context = context;
            _userManager = userManager;
            _emailSender = emailSender;
            _tokenservices = tokenServices;
            _signInManager = signInManager;
        }

        // [Authorize]
        [HttpGet("enable2fa")]
        public async Task<IActionResult> Enable2FA(string Id)
        {
            var user = await _userManager.FindByIdAsync(Id);
            if (user == null)
            {
                return NotFound();
            }

            var key = await _userManager.GetAuthenticatorKeyAsync(user);
            if (string.IsNullOrWhiteSpace(key))
            {
                await _userManager.ResetAuthenticatorKeyAsync(user);
                key = await _userManager.GetAuthenticatorKeyAsync(user);
            }

            string appName = "Mox";
            var uri = $"otpauth://totp/{appName}:{user.Email}?secret={key}&issuer={appName}";

            using var qrGenerator = new QRCodeGenerator();
            using var qrCodeData = qrGenerator.CreateQrCode(uri, QRCodeGenerator.ECCLevel.Q);
            using var qrCode = new Base64QRCode(qrCodeData);
            string qrCodeImage = qrCode.GetGraphic(20);

            return Ok(new
            {
                sharedKey = key,
                authenticationUri = uri,
                qrCodeImage = $"data:image/png;base64,{qrCodeImage}"
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.UserName
                })
                .ToListAsync();

            return Ok(users);
        }

        //Register endpoint
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] RegistrationRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            // Add null checking before?
            var user = new Users
            {
                Email = request.User!.Email,
                UserName = request.User.Username,
            };

            var (succeeded, errors) = await _user.RegisterUser(user, request.Password);

            if (succeeded)
            {
                return Ok(new { success = true, message = "User registeered successfully", userId = user.Id });
            } else
            {
                return BadRequest(new { success = false, errors = errors });
            }

        }

        //Login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
            {
                return Unauthorized("Invalid email or password");
            }

            var passwordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!passwordValid)
            {
                return Unauthorized("Invalid email or password");
            }

            if (await _userManager.GetTwoFactorEnabledAsync(user))
            {
                var code = await _userManager.GenerateTwoFactorTokenAsync(user, TokenOptions.DefaultEmailProvider);

                await _emailSender.SendEmailAsync(
                    user.Email,
                    "Your 2FA Code",
                    $"Your 2FA code is: {code}");

                return Ok(new
                {
                    twoFactorRequired = true,
                    userId = user.Id,
                });
            }

            var token = _tokenservices.GenerateToken(user.Id, user.Email); 
            return Ok(new { Token = token });

            // var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, lockoutOnFailure: false);
            // if (result.RequiresTwoFactor)
            // {
            //     return Ok(new { RequiresTwoFactor = true, UserId = user.Id });
            // }

            // if (!result.Succeeded)
            // {
            //     return Unauthorized("Invalid email or password");
            // }
            
            // var token = _tokenservices.GenerateToken(user.Id, user.Email);
            // return Ok(new { Token = token });

            // if (result.Succeeded)
            // {
            //     return Ok("Login successful");
            // }

            // return Unauthorized("Invalid username or password");
        }

        //Login 2FA
        [HttpPost("login/2fa")]
        public async Task<IActionResult> Login2FA([FromBody] TwoFactorDto dto)
        {
            var user = await _userManager.FindByIdAsync(dto.UserId);
            if (user == null)
            {
                return Unauthorized("User not found");
            }

            var isValid = await _userManager.VerifyTwoFactorTokenAsync(
                user, TokenOptions.DefaultAuthenticatorProvider, dto.TwoFactorCode);

            if (!isValid)
            {
                return Unauthorized("Invalid 2FA code");
            }

            var token = _tokenservices.GenerateToken(user.Id, user.Email);
            return Ok(new { Token = token });

            // var result = await _signInManager.TwoFactorAuthenticatorSignInAsync(dto.TwoFactorCode, isPersistent: false, rememberClient: false);

            // if (!result.Succeeded)
            // {
            //     return Unauthorized("Invalid 2FA code");
            // }

            // var token = _tokenservices.GenerateToken(user.Id, user.Email);
            // return Ok(new { Token = token });
        }

        public class RegistrationRequest
        {
            [Required]
            public RegisterUserDTO? User { get; set; }

            [Required]
            [StringLength(50, MinimumLength = 6)]
            public string Password { get; set; } = string.Empty;
        }

        //Get with ID
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetUserWithId(string id)
        {
            var Userr = await _context.Users.Select(Userr => new UserDTO
            {
                Id = Userr.Id,
                UserName = Userr.UserName!,
                Email = Userr.Email!,
            }).FirstOrDefaultAsync(Userr => Userr.Id == id);

            if (Userr == null)
            {
                return NotFound();
            }

            var json = JsonSerializer.Serialize(Userr);
            return Content(json, "application/json");

        }

        //Get Subtasks w ID
        [HttpGet("{id}/subtasks")]
        public async Task<ActionResult<UserDTO>> GetUserSubtasks(string id) 
        {
            var UserD = await _context.Users
                .Select(user => new UserDTO
                {
                    Id = user.Id,
                    UserName = user.UserName!,
                    Email = user.Email!,
                    SubTasks = user.AssignedSubTasks.Select(subTask => new UserSubTaskDTO
                    {
                        Id = subTask.SubTaskID,
                        ProjectID = subTask.ProjectID,
                        Title = subTask.Title,
                        SubTStatus = subTask.SubTStatus
                    }).ToList()
                })
                .FirstOrDefaultAsync(user => user.Id == id);
        
            if (UserD == null)
            {
                return NotFound();
            }
        
            return Ok(UserD);
        }

        //GenerateJWTToken
        [HttpPost("generate-token")]
        public async Task<IActionResult> GenerateToken([FromBody] GenerateTokenRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var token = _tokenservices.GenerateToken(user.Id, user.Email);
            return Ok(new { Token = token });
        }

        public class GenerateTokenRequest
        {
            // public string UserId { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
        }

                // Google Login Initiation
        [HttpGet("external-login")]
        public IActionResult ExternalLogin(string provider, string returnUrl = "/")
        {
            var redirectUrl = Url.Action(nameof(ExternalLoginCallback), "Auth",
                new { returnUrl = returnUrl });

            var properties = _signInManager.ConfigureExternalAuthenticationProperties(
                provider, redirectUrl);

            return Challenge(properties, provider);
        }

        // Google login callback
        [HttpGet("external-login-callback")]
        public async Task<IActionResult> ExternalLoginCallback(string? returnUrl = null)
        {
            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                return RedirectToAction("Error loading external login information");
            }

            var result = await _signInManager.ExternalLoginSignInAsync(
                info.LoginProvider, info.ProviderKey, isPersistent: false, bypassTwoFactor: true);

            if (result.Succeeded)
            {
                var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
                var token = _tokenservices.GenerateToken(user.Id, user.Email);

                return Ok(new { token });
            }

            if (result.IsLockedOut)
            {
                return BadRequest("User account locked out");
            }

            var email = info.Principal.FindFirstValue(ClaimTypes.Email);
            if (email != null)
            {
                var user = await _userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    user = new Users
                    {
                        UserName = email,
                        Email = email,
                        EmailConfirmed = true
                    };

                    var createResult = await _userManager.CreateAsync(user);
                    if (createResult.Succeeded)
                    {
                        await _userManager.AddLoginAsync(user, info);
                        await _signInManager.SignInAsync(user, isPersistent: false);

                        var token = _tokenservices.GenerateToken(user.Id, user.Email);
                        return Ok(new { token });
                    }
                }
                else
                {
                    await _userManager.AddLoginAsync(user, info);
                    await _signInManager.SignInAsync(user, isPersistent: false);

                    var token = _tokenservices.GenerateToken(user.Id, user.Email);
                    return Redirect("redirect");
                }
            }

            return BadRequest("Error processing external login");
        }


        [HttpPost("test-email")]
        public async Task<IActionResult> TestEmail()
        {
            await _emailSender.SendEmailAsync(
                "221361@virtualwindow.co.za",
                "Test Subject",
                "<b>Hello from MailKit!</b>");

            return Ok("Email sent");

        }


        //TODO: Write Login endpoint -- built in
        //TODO: Write get with ID endpoint -- switch to mail?
        //TODO: Write get subtasks endpoint -- switch to mail?
        //TODO: Write get roles endpoint -- get projects? (own/add)
        //TODO: Test all endpoints
        
        //TODO: Write delete user endpoint? 
        //TODO: Set Role endpoint?
    }
}