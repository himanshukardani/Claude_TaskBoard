using Microsoft.EntityFrameworkCore;
using TaskBoard.API.Models;

namespace TaskBoard.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<AppUser> Users { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ── AppUser config ──────────────────────────────────────────
            modelBuilder.Entity<AppUser>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.HasIndex(u => u.Email).IsUnique();  // email must be unique
                entity.Property(u => u.Name).IsRequired().HasMaxLength(100);
                entity.Property(u => u.Email).IsRequired().HasMaxLength(200);
                entity.Property(u => u.PasswordHash).IsRequired();
                entity.Property(u => u.Role).IsRequired().HasMaxLength(20).HasDefaultValue("User");
            });

            // ── TaskItem config ─────────────────────────────────────────
            modelBuilder.Entity<TaskItem>(entity =>
            {
                entity.HasKey(t => t.Id);
                entity.Property(t => t.Title).IsRequired().HasMaxLength(200);
                entity.Property(t => t.Description).HasMaxLength(1000);
                entity.Property(t => t.Status).IsRequired().HasMaxLength(20).HasDefaultValue("To Do");

                // Each task belongs to one user
                entity.HasOne(t => t.User)
                      .WithMany(u => u.Tasks)
                      .HasForeignKey(t => t.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ── Seed default Admin ──────────────────────────────────────
            // Password: Admin@123  (pre-hashed with BCrypt work factor 11)
            modelBuilder.Entity<AppUser>().HasData(new AppUser
            {
                Id = 1,
                Name = "Admin",
                Email = "Admin@gmail.com",
                // BCrypt hash of "Admin@123"
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = "Admin",
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            });
        }
    }
}
