using Microsoft.AspNetCore.Identity;
using Microsoft.CodeAnalysis.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MoxBackEnd.Data;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Models;
using MoxBackEnd.Services;
using Microsoft.AspNetCore.Identity.UI.Services;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddScoped<IProjects, ProjectService>();
builder.Services.AddScoped<IRole, RoleService>();
builder.Services.AddScoped<ISubTask, SubTaskService>();
builder.Services.AddScoped<IUser, UserService>();
builder.Services.AddTransient<IEmailSender, EmailSender>();
builder.Services.AddScoped<IComment, CommentService>();
builder.Services.AddScoped<IEmergencyMeeting, EmergencyMeetingService>();
builder.Services.AddScoped<ITask, TaskService>();
builder.Services.AddScoped<ITokenServices, TokenServices>();
builder.Services.AddScoped<IFirebaseStorageService, FirebaseStorageService>();


builder.Services.AddControllers()
    .AddJsonOptions(Options =>
    {
        Options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
    });

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secret = jwtSettings["Secret"];
if (string.IsNullOrEmpty(secret))
{
    throw new InvalidOperationException("JWT Secret is not configured. Please set 'JwtSettings:Secret' in your configuration.");
}
var key = Encoding.UTF8.GetBytes(secret);

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
 .AddJwtBearer(options =>
 {
     options.TokenValidationParameters = new TokenValidationParameters
     {
         ValidateIssuer = true,
         ValidateAudience = true,
         ValidateLifetime = true,
         ValidateIssuerSigningKey = true,
         ValidIssuer = jwtSettings["Issuer"],
         ValidAudience = jwtSettings["Audience"],
         IssuerSigningKey = new SymmetricSecurityKey(key)
     };

     options.Events = new JwtBearerEvents
     {
         OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"Authentication failed: {context.Exception.Message}");
            return Task.CompletedTask;
        },
         OnTokenValidated = context =>
         {
             var claims = context.Principal?.Claims?.Select(c => $"{c.Type}: {c.Value}").ToArray() ?? [];
             Console.WriteLine($"Token validated. Claims: {string.Join(", ", claims)}");
             return Task.CompletedTask;
         }
     };
 })
 .AddGoogle(GoogleOptions =>
 {
     GoogleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"] ?? string.Empty;
     GoogleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"] ?? string.Empty;
     GoogleOptions.CallbackPath = "/api/user/signin-google";

     GoogleOptions.Scope.Add("email");
     GoogleOptions.Scope.Add("profile");

     GoogleOptions.SaveTokens = true;
 });

builder.Services.AddAuthorization();


builder.Services.AddIdentity<Users, IdentityRole>(Options =>
{
    Options.SignIn.RequireConfirmedAccount = true;
    Options.SignIn.RequireConfirmedEmail = true;

    Options.Password.RequireDigit = true;
    Options.Password.RequiredLength = 8;
    Options.Password.RequireNonAlphanumeric = false;


    Options.Lockout.MaxFailedAccessAttempts = 5;
    Options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);

    Options.Tokens.AuthenticatorTokenProvider = TokenOptions.DefaultAuthenticatorProvider;
})
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders()
    .AddTokenProvider<AuthenticatorTokenProvider<Users>>(TokenOptions.DefaultAuthenticatorProvider)
    .AddApiEndpoints();
//     builder.Services.ConfigureApplicationCookie(options =>
// {
//     options.Events.OnRedirectToLogin = context =>
//     {
//         context.Response.StatusCode = 401;
//         return Task.CompletedTask;
//     };
//     options.Events.OnRedirectToAccessDenied = context =>
//     {
//         context.Response.StatusCode = 403;
//         return Task.CompletedTask;
//     };
// });

var connectionstring = builder.Configuration.GetConnectionString("LiveConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionstring, npgsqlOptions => npgsqlOptions.EnableRetryOnFailure())
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") //change to port
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// app.UseCors("AllowFrontend");
// app.UseAuthentication();
// app.UseAuthorization();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles(); // Enables serving files from wwwroot

app.UseCors("AllowFrontend");

app.Use(async (context, next) =>
{
    if (context.Request.Path.StartsWithSegments("/api"))
    {
        Console.WriteLine($"\n=== DEBUG: API Request ===");
        Console.WriteLine($"Path: {context.Request.Path}");
        Console.WriteLine($"Method: {context.Request.Method}");
        Console.WriteLine($"Authorization Header: {context.Request.Headers.Authorization}");

        // Check if JWT token is present
        var authHeader = context.Request.Headers.Authorization.ToString();
        if (authHeader.StartsWith("Bearer "))
        {
            var token = authHeader.Substring("Bearer ".Length).Trim();
            Console.WriteLine($"JWT Token (first 50 chars): {token.Substring(0, Math.Min(50, token.Length))}...");
        }
    }

    await next();

    if (context.Request.Path.StartsWithSegments("/api"))
    {
        Console.WriteLine($"Response Status: {context.Response.StatusCode}");
        Console.WriteLine($"User.Identity.IsAuthenticated: {context.User?.Identity?.IsAuthenticated}");
        Console.WriteLine($"User.Identity.Name: {context.User?.Identity?.Name}");
        Console.WriteLine($"User Claims Count: {context.User?.Claims?.Count() ?? 0}");
        if (context.User?.Claims?.Any() == true)
        {
            var claims = context.User.Claims.Select(c => $"{c.Type}: {c.Value}").Take(5);
            Console.WriteLine($"First 5 Claims: {string.Join(", ", claims)}");
        }
        Console.WriteLine($"=== END DEBUG ===\n");
    }
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapIdentityApi<Users>();

app.Run();



///TODO: CREATE INTERFACES, SERVICES, AND CONTROLLERS
/// - write all the endpoints for all the necessary functionality
/// - set up a DTO