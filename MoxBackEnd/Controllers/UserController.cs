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
        public UserController(IUser user, AppDbContext context, UserManager<Users> userManager, IEmailSender emailSender, ITokenServices tokenServices)
        {
            _user = user;
            _context = context;
            _userManager = userManager;
            _emailSender = emailSender;
            _tokenservices = tokenServices;
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
        [HttpPost("generate-toke")]
        public async Task<IActionResult> GenerateToken([FromBody] DirectTokenRequest request)
        {
            var token = _tokenservices.GenerateToken(request.UserId, request.Email);
            return await Task.FromResult(Ok(new { Token = token }));
        }

        public class DirectTokenRequest
        {
            public string UserId { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
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
