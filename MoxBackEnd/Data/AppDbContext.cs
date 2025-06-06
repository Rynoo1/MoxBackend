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
    public DbSet<FileUpload> FileUploads { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<EmergencyMeeting> EmergencyMeetings { get; set; }
    public DbSet<ProjectUser> ProjectUsers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<AppRoles>()
            .HasOne(r => r.User)
            .WithMany(u => u.AppRoles)
            .HasForeignKey(r => r.UserID);

        modelBuilder.Entity<AppRoles>()
            .HasOne(r => r.Project)
            .WithMany(p => p.AppRoles)
            .HasForeignKey(r => r.ProjectID);

        modelBuilder.Entity<Tasks>()
            .HasMany(t => t.SubTasks)
            .WithOne(s => s.Task)
            .HasForeignKey(s => s.TaskId);

        modelBuilder.Entity<Projects>()
            .HasMany(p => p.Tasks)
            .WithOne(t => t.Project)
            .HasForeignKey(t => t.ProjectID);

        modelBuilder.Entity<Projects>()
            .HasMany(p => p.Users)
            .WithMany(u => u.Projects)
            .UsingEntity(j => j.ToTable("ProjectAssignments"));


        modelBuilder.Entity<FileUpload>()
            .HasOne(f => f.Project)
            .WithMany(p => p.FileUploads)
            .HasForeignKey(f => f.ProjectID);

        modelBuilder.Entity<SubTasks>()
            .HasMany(s => s.AssignedUsers)
            .WithMany(u => u.AssignedSubTasks)
            .UsingEntity(j => j.ToTable("SubTaskUserAssignments"));

        modelBuilder.Entity<EmergencyMeeting>()
            .HasOne(em => em.Project)
            .WithMany()
            .HasForeignKey(em => em.ProjectID)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<EmergencyMeeting>()
            .HasOne(em => em.CreatedBy)
            .WithMany(u => u.CreatedMeetings)
            .HasForeignKey(em => em.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<EmergencyMeeting>()
            .HasMany(em => em.Attendees)
            .WithMany(u => u.Meetings);

        modelBuilder.Entity<Comment>()
            .HasOne(sn => sn.Task)
            .WithMany(t => t.Comments)
            .HasForeignKey(sn => sn.TaskId);

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Task)
            .WithMany(t => t.Comments)
            .HasForeignKey(c => c.TaskId);

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Project)
            .WithMany(p => p.Comments)
            .HasForeignKey(c => c.ProjectID)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.CreatedBy)
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.CreatedByUserId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<ProjectUser>()
            .HasKey(pu => new { pu.ProjectID, pu.UserID });

        modelBuilder.Entity<ProjectUser>()
            .HasOne(pu => pu.Project)
            .WithMany(p => p.ProjectUsers)
            .HasForeignKey(pu => pu.ProjectID);

        modelBuilder.Entity<ProjectUser>()
            .HasOne(pu => pu.User)
            .WithMany(u => u.ProjectUsers)
            .HasForeignKey(pu => pu.UserID);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<Projects>())
        {
            if ((entry.State == EntityState.Added || entry.State == EntityState.Modified) && entry.Entity.Users != null)
            {
                var project = entry.Entity;

                var updatedUserIds = project.Users.Select(u => u.Id).ToHashSet();

                var existingUserIds = await ProjectUsers
                    .Where(pu => pu.ProjectID == project.ProjectID)
                    .Select(pu => pu.UserID)
                    .ToListAsync(cancellationToken);

                foreach (var userId in updatedUserIds.Except(existingUserIds))
                {
                    ProjectUsers.Add(new ProjectUser
                    {
                        ProjectID = project.ProjectID,
                        UserID = userId
                    });
                }

                foreach (var userId in existingUserIds.Except(updatedUserIds))
                {
                    var toRemove = await ProjectUsers
                        .FirstOrDefaultAsync(pu => pu.ProjectID == project.ProjectID && pu.UserID == userId, cancellationToken);

                    if (toRemove != null)
                        ProjectUsers.Remove(toRemove);
                }
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}