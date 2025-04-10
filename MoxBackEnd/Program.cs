using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MoxBackEnd.Data;
using MoxBackEnd.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthorization();
builder.Services.AddAuthentication().AddCookie(IdentityConstants.ApplicationScheme);

//builder.Services.AddIdentityCore<ApplicationUser>
  //  .AddEntityFrameworkStore

var connectionstring = builder.Configuration.GetConnectionString("LiveConnection");
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionstring));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();



///TODO: CREATE INTERFACES, SERVICES, AND CONTROLLERS
/// - write all the endpoints for all the necessary functionality
/// - set up a DTO