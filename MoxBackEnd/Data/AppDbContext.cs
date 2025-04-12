using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.General;
using MoxBackEnd.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace MoxBackEnd.Data;

public class AppDbContext : IdentityDbContext<Users>
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
        {
        }

    public DbSet<Projects> Projects { get; set; }
    //public DbSet<Users> Users { get; set; }
    public DbSet<AppRoles> AppRoles { get; set; }
    public DbSet<Tasks> Tasks { get; set; }
    public DbSet<SubTasks> SubTasks { get; set; }
    public DbSet<FileUpload> FileUploads{ get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Users>()
            .HasMany(u => u.AppRoles)
            .WithOne(r => r.User)
            .HasForeignKey(r => r.UserID);
        
        modelBuilder.Entity<Projects>()
            .HasMany(p => p.AppRoles)
            .WithOne(r => r.Project)
            .HasForeignKey(r => r.ProjectID);

        modelBuilder.Entity<Tasks>()
            .HasMany(t => t.SubTasks)
            .WithOne(s => s.ParentTask)
            .HasForeignKey(s => s.ParentTaskId);

        modelBuilder.Entity<Projects>()
            .HasMany(p => p.Tasks)
            .WithOne(t => t.Projects)
            .HasForeignKey(t => t.ProjectsId);

        modelBuilder.Entity<FileUpload>()
            .HasOne(f => f.Project)
            .WithMany(p => p.FileUploads)
            .HasForeignKey(f => f.ProjectID);

        modelBuilder.Entity<SubTasks>()
            .HasMany(s => s.AssignedUsers)
            .WithMany(u => u.AssignedSubTasks)
            .UsingEntity(j => j.ToTable("SubTaskUserAssignments"));

    }

}
