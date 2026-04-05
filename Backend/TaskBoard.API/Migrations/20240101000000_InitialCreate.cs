using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskBoard.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ── Create Users table ───────────────────────────────────────
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id          = table.Column<int>(nullable: false)
                                       .Annotation("SqlServer:Identity", "1, 1"),
                    Name        = table.Column<string>(maxLength: 100, nullable: false),
                    Email       = table.Column<string>(maxLength: 200, nullable: false),
                    PasswordHash= table.Column<string>(nullable: false),
                    Role        = table.Column<string>(maxLength: 20, nullable: false, defaultValue: "User"),
                    CreatedAt   = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            // Unique email index
            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            // ── Create Tasks table ───────────────────────────────────────
            migrationBuilder.CreateTable(
                name: "Tasks",
                columns: table => new
                {
                    Id          = table.Column<int>(nullable: false)
                                       .Annotation("SqlServer:Identity", "1, 1"),
                    Title       = table.Column<string>(maxLength: 200, nullable: false),
                    Description = table.Column<string>(maxLength: 1000, nullable: false),
                    Status      = table.Column<string>(maxLength: 20, nullable: false, defaultValue: "To Do"),
                    CreatedAt   = table.Column<DateTime>(nullable: false),
                    UpdatedAt   = table.Column<DateTime>(nullable: true),
                    UserId      = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tasks_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_UserId",
                table: "Tasks",
                column: "UserId");

            // ── Seed default Admin user ─────────────────────────────────
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Name", "Email", "PasswordHash", "Role", "CreatedAt" },
                values: new object[]
                {
                    1,
                    "Admin",
                    "admin@gmail.com",
                    // BCrypt hash of "Admin@123" — generated at code level; see AppDbContext.OnModelCreating
                    "$2a$11$rP5HGZBOWHwjL/2sZFqPsuQ7g3LJq5mNj0bGWX1vYS9UZpOj/IjFm",
                    "Admin",
                    new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "Tasks");
            migrationBuilder.DropTable(name: "Users");
        }
    }
}
