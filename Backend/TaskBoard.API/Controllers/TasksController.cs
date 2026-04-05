using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskBoard.API.Data;
using TaskBoard.API.DTOs;
using TaskBoard.API.Models;

namespace TaskBoard.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]   // All endpoints require a valid JWT
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _db;

        public TasksController(AppDbContext db)
        {
            _db = db;
        }

        // ── Helper: extract the logged-in user's ID from the JWT ────────
        private int GetCurrentUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // GET api/tasks  — get tasks for the logged-in user
        // Optional query param: ?status=To Do
        [HttpGet]
        public async Task<IActionResult> GetMyTasks([FromQuery] string? status)
        {
            var userId = GetCurrentUserId();

            var query = _db.Tasks
                .Include(t => t.User)
                .Where(t => t.UserId == userId);

            // Filter by status if provided
            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(t => t.Status == status);

            var tasks = await query
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => MapToDto(t))
                .ToListAsync();

            return Ok(tasks);
        }

        // GET api/tasks/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTask(int id)
        {
            var userId = GetCurrentUserId();
            var task = await _db.Tasks.Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (task == null) return NotFound(new { message = "Task not found." });

            return Ok(MapToDto(task));
        }

        // POST api/tasks
        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest(new { message = "Title is required." });

            // Validate status value
            var validStatuses = new[] { "To Do", "In Progress", "Done" };
            if (!validStatuses.Contains(dto.Status))
                return BadRequest(new { message = "Invalid status value." });

            var userId = GetCurrentUserId();
            var task = new TaskItem
            {
                Title = dto.Title.Trim(),
                Description = dto.Description?.Trim() ?? string.Empty,
                Status = dto.Status,
                UserId = userId
            };

            _db.Tasks.Add(task);
            await _db.SaveChangesAsync();

            // Reload with user for response
            await _db.Entry(task).Reference(t => t.User).LoadAsync();
            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, MapToDto(task));
        }

        // PUT api/tasks/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] UpdateTaskDto dto)
        {
            var userId = GetCurrentUserId();
            var task = await _db.Tasks.Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (task == null) return NotFound(new { message = "Task not found." });

            // Apply changes only for provided fields
            if (!string.IsNullOrWhiteSpace(dto.Title))
                task.Title = dto.Title.Trim();

            if (dto.Description != null)
                task.Description = dto.Description.Trim();

            if (!string.IsNullOrWhiteSpace(dto.Status))
            {
                var validStatuses = new[] { "To Do", "In Progress", "Done" };
                if (!validStatuses.Contains(dto.Status))
                    return BadRequest(new { message = "Invalid status value." });
                task.Status = dto.Status;
            }

            task.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return Ok(MapToDto(task));
        }

        // DELETE api/tasks/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var userId = GetCurrentUserId();
            var task = await _db.Tasks
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (task == null) return NotFound(new { message = "Task not found." });

            _db.Tasks.Remove(task);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Task deleted successfully." });
        }

        // ── Static mapper ───────────────────────────────────────────────
        private static TaskResponseDto MapToDto(TaskItem t) => new()
        {
            Id = t.Id,
            Title = t.Title,
            Description = t.Description,
            Status = t.Status,
            CreatedAt = t.CreatedAt,
            UpdatedAt = t.UpdatedAt,
            UserId = t.UserId,
            UserName = t.User?.Name ?? string.Empty,
            UserEmail = t.User?.Email ?? string.Empty
        };
    }
}
