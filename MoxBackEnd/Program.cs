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

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
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
 });
//  .AddGoogle(GoogleOptions =>
{
    GoogleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"] ?? string.Empty;
    GoogleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"] ?? string.Empty;
    GoogleOptions.CallbackPath = "/signin-google"; // Ensure this matches your Google API settings

    GoogleOptions.Scope.Add("email");
    GoogleOptions.Scope.Add("profile");

    GoogleOptions.SaveTokens = true;
}
;

builder.Services.AddAuthorization();
// builder.Services.AddAuthentication().Add

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

var connectionstring = builder.Configuration.GetConnectionString("LiveConnection");
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionstring));

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

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();
app.UseStaticFiles(); // Enables serving files from wwwroot

app.MapControllers();

app.MapIdentityApi<Users>();

app.Run();



///TODO: CREATE INTERFACES, SERVICES, AND CONTROLLERS
/// - write all the endpoints for all the necessary functionality
/// - set up a DTO