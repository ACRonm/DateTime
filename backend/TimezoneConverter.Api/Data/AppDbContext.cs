using Microsoft.EntityFrameworkCore;
using TimezoneConverter.Api.Models;

namespace TimezoneConverter.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserPreference> UserPreferences { get; set; }
        public DbSet<Event> Events { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User entity configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Username).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // UserPreference entity configuration
            modelBuilder.Entity<UserPreference>(entity =>
            {
                entity.HasKey(e => e.UserId);
                entity.Property(e => e.DefaultTimezone).IsRequired().HasMaxLength(100);
                entity.HasOne(e => e.User)
                      .WithOne(e => e.Preferences)
                      .HasForeignKey<UserPreference>(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Event entity configuration
            modelBuilder.Entity<Event>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Timezone).IsRequired().HasMaxLength(100);
                entity.HasOne(e => e.User)
                      .WithMany(e => e.Events)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasIndex(e => e.StartTime);
                entity.HasIndex(e => e.UserId);
            });
        }
    }
}
