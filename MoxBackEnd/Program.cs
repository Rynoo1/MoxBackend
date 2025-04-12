using Microsoft.AspNetCore.Identity;
using Microsoft.CodeAnalysis.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MoxBackEnd.Data;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Models;
using MoxBackEnd.Services;
using Microsoft.AspNetCore.Identity.UI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddScoped<IProjects, ProjectService>();
builder.Services.AddScoped<IRole, RoleService>();
builder.Services.AddScoped<ISubTask, SubTaskService>();
builder.Services.AddScoped<IUser, UserService>();
builder.Services.AddTransient<IEmailSender, EmailSender>();

builder.Services.AddControllers()
    .AddJsonOptions(Options => {
        Options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
    });

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthorization();
// builder.Services.AddAuthentication().Add

builder.Services.AddIdentity<Users, IdentityRole>(Options => {

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

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapIdentityApi<Users>();

app.Run();



///TODO: CREATE INTERFACES, SERVICES, AND CONTROLLERS
/// - write all the endpoints for all the necessary functionality
/// - set up a DTO