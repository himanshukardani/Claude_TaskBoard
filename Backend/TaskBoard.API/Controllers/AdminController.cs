using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskBoard.API.Data;
using TaskBoard.API.DTOs;

namespace TaskBoard.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]   // Only Admins can access these endpoints
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AdminController(AppDbContext db)
        {
            _db = db;
        }

        // ── Dashboard ────────────────────────────────────────────────────

        // GET api/admin/dashboard
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var totalUsers = await _db.Users.CountAsync();
            var totalTasks = await _db.Tasks.CountAsync();
            var todoCount = await _db.Tasks.CountAsync(t => t.Status == "To Do");
            var inProgressCount = await _db.Tasks.CountAsync(t => t.Status == "In Progress");
            var doneCount = await _db.Tasks.CountAsync(t => t.Status == "Done");

            return Ok(new DashboardDto
            {
                TotalUsers = totalUsers,
                TotalTasks = totalTasks,
                TodoCount = todoCount,
                InProgressCount = inProgressCount,
                DoneCount = doneCount
            });
        }

        // ── All Tasks (Admin view) ────────────────────────────────────────

        // GET api/admin/tasks  — optionally filter by ?status=
        [HttpGet("tasks")]
        public async Task<IActionResult> GetAllTasks([FromQuery] string? status)
        {
            var query = _db.Tasks.Include(t => t.User).AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(t => t.Status == status);

            var tasks = await query
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new TaskResponseDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt,
                    UserId = t.UserId,
                    UserName = t.User.Name,
                    UserEmail = t.User.Email
                })
                .ToListAsync();

            return Ok(tasks);
        }

        // DELETE api/admin/tasks/{id}  — admin can delete any task
        [HttpDelete("tasks/{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _db.Tasks.FindAsync(id);
            if (task == null) return NotFound(new { message = "Task not found." });

            _db.Tasks.Remove(task);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Task deleted by admin." });
        }

        // ── User Management ───────────────────────────────────────────────

        // GET api/admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _db.Users
                .OrderBy(u => u.Id)
                .Select(u => new UserResponseDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    Role = u.Role,
                    CreatedAt = u.CreatedAt,
                    TaskCount = u.Tasks.Count
                })
                .ToListAsync();

            return Ok(users);
        }

        // PUT api/admin/users/{id}/role  — change User <-> Admin
        [HttpPut("users/{id}/role")]
        public async Task<IActionResult> ChangeRole(int id, [FromBody] ChangeRoleDto dto)
        {
            var validRoles = new[] { "User", "Admin" };
            if (!validRoles.Contains(dto.Role))
                return BadRequest(new { message = "Role must be 'User' or 'Admin'." });

            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found." });

            user.Role = dto.Role;
            await _db.SaveChangesAsync();

            return Ok(new { message = $"Role updated to {dto.Role}.", userId = id, role = dto.Role });
        }
    }
}
