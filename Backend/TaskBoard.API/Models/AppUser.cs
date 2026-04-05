namespace TaskBoard.API.Models
{
    /// <summary>
    /// Represents a registered user in the system.
    /// </summary>
    public class AppUser
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        /// <summary>Bcrypt-hashed password — never stored in plain text.</summary>
        public string PasswordHash { get; set; } = string.Empty;

        /// <summary>"User" or "Admin"</summary>
        public string Role { get; set; } = "User";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}
