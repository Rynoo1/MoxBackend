using Microsoft.EntityFrameworkCore;
using MoxBackEnd.Models;  // Update namespace if needed

namespace MoxBackEnd.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Example of setting constraints
            modelBuilder.Entity<TaskItem>()
                .Property(t => t.Priority)
                .HasDefaultValue(3); // Default priority level 3 (normal)
        }
    }
}