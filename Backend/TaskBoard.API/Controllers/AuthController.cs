using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskBoard.API.Data;
using TaskBoard.API.DTOs;
using TaskBoard.API.Helpers;
using TaskBoard.API.Models;

namespace TaskBoard.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly JwtHelper _jwtHelper;

        public AuthController(AppDbContext db, JwtHelper jwtHelper)
        {
            _db = db;
            _jwtHelper = jwtHelper;
        }

        // POST api/auth/signup
        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] SignupDto dto)
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(dto.Name) ||
                string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "All fields are required." });

            // Check if email is already registered
            if (await _db.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
                return Conflict(new { message = "Email is already registered." });

            // Hash the password using BCrypt
            var user = new AppUser
            {
                Name = dto.Name.Trim(),
                Email = dto.Email.Trim().ToLower(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "User"          // default role
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            // Return token immediately so the user is logged in after signup
            var token = _jwtHelper.GenerateToken(user);
            return Ok(new AuthResponseDto
            {
                Token = token,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            });
        }

        // POST api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "Email and password are required." });

            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());

            if (user == null)
                return Unauthorized(new { message = "Invalid email or password." });

            // Verify the provided password against the stored hash
            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid email or password." });

            var token = _jwtHelper.GenerateToken(user);
            return Ok(new AuthResponseDto
            {
                Token = token,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            });
        }
    }
}
