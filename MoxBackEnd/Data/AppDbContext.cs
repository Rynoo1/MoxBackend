using System;
using Microsoft.EntityFrameworkCore;
using MoxBackEnd.Models;

namespace MoxBackEnd.Data;

public class AppDbContext : DbContext
{

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}

    public DbSet<Projects> Projects { get; set; }
    public DbSet<Users> Users { get; set; }
    public DbSet<Roles> Roles { get; set; }
    public DbSet<Tasks> Tasks { get; set; }
    public DbSet<SubTasks> SubTasks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Users>()
            .HasMany(u => u.Roles)
            .WithOne(r => r.User)
            .HasForeignKey(r => r.UserID);
        
        modelBuilder.Entity<Projects>()
            .HasMany(p => p.Roles)
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

        modelBuilder.Entity<SubTasks>()
            .HasMany(s => s.AssignedUsers)
            .WithMany(u => u.AssignedSubTasks)
            .UsingEntity(j => j.ToTable("SubTaskUserAssignments"));

    }

}
