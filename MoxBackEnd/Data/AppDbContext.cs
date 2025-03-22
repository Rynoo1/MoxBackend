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

    ///TODO: Set up relationships
    /// - create models for each table
    /// - include navigation properties in models
    /// - complete override with rest of relationships
    /// - create a migration (STILL NEED TO DO INITIAL MIGRATION AND DB SETUP)
    /// - update the database to sync the changes

    // protected override void OnModelCreating(ModelBuilder modelBuilder)
    // {
    //     base.OnModelCreating(modelBuilder);

    //     modelBuilder.Entity<Users>()
    //         .HasMany(u => u.Roles)
    //         .WithOne(r => r.Users)
    //         .HasForeignKey(r => r.UserId);

    // }

}
