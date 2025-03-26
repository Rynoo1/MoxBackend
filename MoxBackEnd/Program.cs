using Microsoft.AspNetCore.Authorization;
using MoxBackEnd.Data;
using MoxBackEnd.Interfaces;
using MoxBackEnd.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddScoped<IUser, UserService>();
builder.Services.AddScoped<ISubTask, SubTaskService>();
builder.Services.AddScoped<IRole, RoleService>();
builder.Services.AddScoped<IGroup, GroupService>();
builder.Services.AddScoped<IProject, ProjectService>();

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

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