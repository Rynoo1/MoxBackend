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
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.AspNetCore.Authentication.JwtBearer;

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
                await _userManager.SetTwoFactorEnabledAsync(user, true);

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

            var adminEmails = new HashSet<string>
            {
                "ryno.debeer12@gmail.com"
            };

            bool isAdmin = adminEmails.Contains(loginDto.Email.ToLower());

            if (await _userManager.GetTwoFactorEnabledAsync(user))
            {
                var code = await _userManager.GenerateTwoFactorTokenAsync(user, TokenOptions.DefaultEmailProvider);

                await _emailSender.SendEmailAsync(
                    loginDto.Email,
                    "Your 2FA Code",
                    $"Your 2FA code is: {code}");

                return Ok(new
                {
                    twoFactorRequired = true,
                    userId = user.Id,
                    message = "2FA code sent to your email"
                });
            }

            var token = _tokenservices.GenerateToken(
                user.Id,
                user.Email ?? string.Empty,
                user.UserName ?? string.Empty);
            return Ok(new { Token = token, IsAdmin = isAdmin });
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
                user, TokenOptions.DefaultEmailProvider, dto.TwoFactorCode);

            if (!isValid)
            {
                return Unauthorized("Invalid 2FA code");
            }

            var adminEmails = new HashSet<string>
            {
                "ryno.debeer12@gmail.com"
            };

            bool isAdmin = !string.IsNullOrEmpty(user.Email) && adminEmails.Contains(user.Email.ToUpper());

            var token = _tokenservices.GenerateToken(
                user.Id,
                user.Email ?? string.Empty,
                user.UserName ?? string.Empty);
            return Ok(new { Token = token, IsAdmin = isAdmin });
        }

        public class RegistrationRequest
        {
            [Required]
            public RegisterUserDTO? User { get; set; }

            [Required]
            [StringLength(50, MinimumLength = 6)]
            public string Password { get; set; } = string.Empty;
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("profile/{userId}")]
        public async Task<IActionResult> GetProfile(string userId)
        {
            try
            {
                if (string.IsNullOrEmpty(userId))
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "User ID must be provided"
                    });
                }

                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                var userProfile = new UserProfileDto
                {
                    UserName = user.UserName!,
                    Email = user.Email!,
                    ProfilePicture = user.ProfilePicture!
                };

                return Ok(new ApiResponse<UserProfileDto>
                {
                    Success = true,
                    Data = userProfile
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Profile error: {ex.Message}");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving the profile"
                });
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                            User.FindFirstValue("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier") ??
                            User.FindFirstValue("sub");


                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "User not authenticated - no user ID found in claims"
                    });
                }

                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                var userProfile = new UserProfileDto
                {
                    UserName = user.UserName!,
                    Email = user.Email!,
                    ProfilePicture = user.ProfilePicture!
                };

                return Ok(new ApiResponse<UserProfileDto>
                {
                    Success = true,
                    Data = userProfile
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Profile error: {ex.Message}");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "An error occured while retrieving the profile"
                });
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserProfileDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "User not found"
                });

            user.UserName = dto.UserName ?? user.UserName;
            user.Email = dto.Email ?? user.Email;
            user.ProfilePicture = dto.ProfilePicture ?? user.ProfilePicture;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Failed to update profile",
                    Data = result.Errors.Select(e => e.Description).ToList()
                });
            
            return Ok(new { success = true, message = "Profile updated successfully" });
        }

        [HttpDelete("delete-account")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> DeletUserAccount()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                            User.FindFirstValue("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier") ??
                            User.FindFirstValue("sub");

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "User not authenticated - no user Id found in claims"
                    });
                }

                var userToDelete = await _userManager.FindByIdAsync(userId);
                if (userToDelete == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                using var transaction = await _context.Database.BeginTransactionAsync();

                try
                {
                    var subTaskAssignments = await _context.SubTaskUserAssignments
                        .Where(sta => sta.AssignedUsersId == userId)
                        .ToListAsync();
                    _context.SubTaskUserAssignments.RemoveRange(subTaskAssignments);

                    var projectUsers = await _context.ProjectUsers
                        .Where(pu => pu.UserID == userId)
                        .ToListAsync();
                    _context.ProjectUsers.RemoveRange(projectUsers);

                    var appRoles = await _context.AppRoles
                        .Where(ar => ar.UserID == userId)
                        .ToListAsync();
                    _context.AppRoles.RemoveRange(appRoles);

                    var userComments = await _context.Comments
                        .Where(c => c.CreatedByUserId == userId)
                        .ToListAsync();

                    foreach (var comment in userComments)
                    {
                        comment.CreatedByUserId = null;
                    }

                    var createdMeetings = await _context.EmergencyMeetings
                        .Where(em => em.CreatedByUserId == userId)
                        .ToListAsync();

                    foreach (var meeting in createdMeetings)
                    {
                        meeting.CreatedByUserId = "";
                    }

                    var userWithMeetings = await _context.Users
                        .Include(u => u.Meetings)
                        .FirstOrDefaultAsync(u => u.Id == userId);

                    if (userWithMeetings?.Meetings != null)
                    {
                        userWithMeetings.Meetings.Clear();
                    }

                    // var ownedProjects = await _context.Projects
                    //     .Where(p => p.CreatedBy == userId)
                    //     .ToListAsync();

                    // foreach (var project in ownedProjects)
                    // {
                    //     project.CreatedBy = null;
                    // }

                    await _context.SaveChangesAsync();

                    var deleteResult = await _userManager.DeleteAsync(userToDelete);
                    if (!deleteResult.Succeeded)
                    {
                        await transaction.RollbackAsync();
                        var errors = string.Join(", ", deleteResult.Errors.Select(errors => errors.Description));
                        return BadRequest($"Failed to delete user from Identity system: {errors}");
                    }

                    await transaction.CommitAsync();

                    Console.WriteLine($"User {userId} successfully deleted their own account");

                    return Ok(new ApiResponse<object>
                    {
                        Success = true,
                        Message = "Account deleted successfully",
                        Data = new { shouldLogout = true }
                    });
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine($"Error deleting user {userId}: {ex}");
                    throw;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error deleting user account: {ex}");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "An error occured while deleting your account"
                });
            }
        }

        [HttpDelete("admin/{userId}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> AdminDeleteUser(string userId)
        {
            try
            {
                var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                                    User.FindFirstValue("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier") ??
                                    User.FindFirstValue("sub");

                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "User not authenticated - no user ID found in claims"
                    });
                }

                if (currentUserId == userId)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Use the delete-account endpoint to delete your own account"
                    });
                }

                var userToDelete = await _userManager.FindByIdAsync(userId);
                if (userToDelete == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                using var transaction = await _context.Database.BeginTransactionAsync();

                try
                {
                    var subTaskAssignments = await _context.SubTaskUserAssignments
                        .Where(sta => sta.AssignedUsersId == userId)
                        .ToListAsync();
                    _context.SubTaskUserAssignments.RemoveRange(subTaskAssignments);

                    var projectUsers = await _context.ProjectUsers
                        .Where(pu => pu.UserID == userId)
                        .ToListAsync();
                    _context.ProjectUsers.RemoveRange(projectUsers);

                    var appRoles = await _context.AppRoles
                        .Where(ar => ar.UserID == userId)
                        .ToListAsync();
                    _context.AppRoles.RemoveRange(appRoles);

                    var userComments = await _context.Comments
                        .Where(c => c.CreatedByUserId == userId)
                        .ToListAsync();

                    foreach (var comment in userComments)
                    {
                        comment.CreatedByUserId = null;
                    }

                    var createdMeetings = await _context.EmergencyMeetings
                        .Where(em => em.CreatedByUserId == userId)
                        .ToListAsync();

                    foreach (var meeting in createdMeetings)
                    {
                        meeting.CreatedByUserId = "";
                    }

                    var userWithMeetings = await _context.Users
                        .Include(u => u.Meetings)
                        .FirstOrDefaultAsync(u => u.Id == userId);

                    if (userWithMeetings?.Meetings != null)
                    {
                        userWithMeetings.Meetings.Clear();
                    }

                    // var ownedProjects = await _context.Projects
                    //     .Where(p => p.CreatedBy == userId)
                    //     .ToListAsync();

                    // foreach (var project in ownedProjects)
                    // {
                    //     project.CreatedBy = null;
                    // }

                    await _context.SaveChangesAsync();

                    var deleteResult = await _userManager.DeleteAsync(userToDelete);
                    if (!deleteResult.Succeeded)
                    {
                        await transaction.RollbackAsync();
                        var errors = string.Join(", ", deleteResult.Errors.Select(errors => errors.Description));
                        return BadRequest($"Failed to delete user from Identity system: {errors}");
                    }

                    await transaction.CommitAsync();

                    Console.WriteLine($"User {userId} successfully deleted by admin {currentUserId}");

                    return Ok(new ApiResponse<object>
                    {
                        Success = true,
                        Message = "User deleted successfully"
                    });
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine($"Error deleting user {userId}: {ex}");
                    throw;
                }
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, $"Unexpected error in admin delete user {userId}");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "An error occurred while deleting the user"
                });
            }
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

            var token = _tokenservices.GenerateToken(
                user.Id,
                user.Email ?? string.Empty,
                user.UserName ?? string.Empty);
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
                // Redirect to an error page or return a proper error response
                return BadRequest("Error loading external login information");
            }

            var result = await _signInManager.ExternalLoginSignInAsync(
                info.LoginProvider, info.ProviderKey, isPersistent: false, bypassTwoFactor: true);

            if (result.Succeeded)
            {
                var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);

                if (user == null)
                {
                    return BadRequest("User not found after external login.");
                }

                var token = _tokenservices.GenerateToken(
                    user.Id,
                    user.Email ?? string.Empty,
                    user.UserName ?? string.Empty);
                return Redirect($"{returnUrl}?token={token}&email={user.Email}&userId={user.Id}");
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

                        var token = _tokenservices.GenerateToken(
                            user.Id,
                            user.Email ?? string.Empty,
                            user.UserName ?? string.Empty);
                        return Ok(new { token });
                    }
                    else
                    {
                        return BadRequest("Failed to create user from external login");
                    }
                }
                else
                {
                    await _userManager.AddLoginAsync(user, info);
                    await _signInManager.SignInAsync(user, isPersistent: false);

                    var token = _tokenservices.GenerateToken(
                        user.Id,
                        user.Email ?? string.Empty,
                        user.UserName ?? string.Empty);
                    return Redirect($"{returnUrl}?token={token}&email={user.Email}&userId={user.Id}");;
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


        //TODO: Write get roles endpoint -- get projects? (own/add)
        //TODO: Test all endpoints

        //TODO: Write delete user endpoint? 
        //TODO: Set Role endpoint?
    }
}
