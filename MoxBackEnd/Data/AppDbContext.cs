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
    public DbSet<StickyNote> StickyNotes { get; set; }
    public DbSet<EmergencyMeeting> EmergencyMeetings { get; set; }
    public DbSet<Group> Groups { get; set; }


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

    modelBuilder.Entity<FileUpload>()
        .HasOne(f => f.Project)
        .WithMany(p => p.FileUploads)
        .HasForeignKey(f => f.ProjectID);

    modelBuilder.Entity<SubTasks>()
        .HasMany(s => s.AssignedUsers)
        .WithMany(u => u.AssignedSubTasks)
        .UsingEntity(j => j.ToTable("SubTaskUserAssignments"));

    modelBuilder.Entity<Group>()
        .HasMany(g => g.Users)
        .WithMany(u => u.Groups);

    modelBuilder.Entity<Group>()
        .HasMany(g => g.Projects)
        .WithOne(p => p.Group)
        .HasForeignKey(p => p.GroupID)
        .OnDelete(DeleteBehavior.SetNull);

    modelBuilder.Entity<Group>()
        .HasMany(g => g.Tasks)
        .WithOne()
        .OnDelete(DeleteBehavior.SetNull);

    modelBuilder.Entity<Group>()
        .HasMany(g => g.Roles)
        .WithOne()
        .OnDelete(DeleteBehavior.SetNull);

    modelBuilder.Entity<EmergencyMeeting>()
        .HasOne(em => em.Group)
        .WithMany()
        .HasForeignKey(em => em.GroupID)
        .OnDelete(DeleteBehavior.SetNull);

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

    modelBuilder.Entity<StickyNote>()
        .HasOne(sn => sn.Task)
        .WithMany(t => t.StickyNotes)
        .HasForeignKey(sn => sn.TaskId);

    modelBuilder.Entity<StickyNote>()
        .HasOne(sn => sn.Project)
        .WithMany(p => p.StickyNotes)
        .HasForeignKey(sn => sn.ProjectID)
        .OnDelete(DeleteBehavior.SetNull);

    modelBuilder.Entity<StickyNote>()
        .HasOne(sn => sn.CreatedBy)
        .WithMany(u => u.StickyNotes)
        .HasForeignKey(sn => sn.CreatedByUserId)
        .OnDelete(DeleteBehavior.SetNull);
    }
}