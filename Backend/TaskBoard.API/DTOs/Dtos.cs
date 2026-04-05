namespace TaskBoard.API.DTOs
{
    // ──────────────────────────────
    // Auth DTOs
    // ──────────────────────────────

    public class SignupDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }

    // ──────────────────────────────
    // Task DTOs
    // ──────────────────────────────

    public class CreateTaskDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "To Do";
    }

    public class UpdateTaskDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
    }

    public class TaskResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
    }

    // ──────────────────────────────
    // User / Admin DTOs
    // ──────────────────────────────

    public class UserResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int TaskCount { get; set; }
    }

    public class ChangeRoleDto
    {
        public string Role { get; set; } = string.Empty;
    }

    public class DashboardDto
    {
        public int TotalUsers { get; set; }
        public int TotalTasks { get; set; }
        public int TodoCount { get; set; }
        public int InProgressCount { get; set; }
        public int DoneCount { get; set; }
    }
}
