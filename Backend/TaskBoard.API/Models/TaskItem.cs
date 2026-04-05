namespace TaskBoard.API.Models
{
    /// <summary>
    /// Represents a task created by a user.
    /// </summary>
    public class TaskItem
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        /// <summary>Status: "To Do", "In Progress", or "Done"</summary>
        public string Status { get; set; } = "To Do";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Foreign key
        public int UserId { get; set; }

        // Navigation property
        public AppUser User { get; set; } = null!;
    }
}
