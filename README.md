# TaskBoard — Full Stack Task Management App

A complete task management application built with **ASP.NET Core 8 Web API** + **React** + **SQL Server**.

---

## 📁 Project Structure

```
TaskBoard/
├── Backend/
│   └── TaskBoard.API/
│       ├── Controllers/
│       │   ├── AuthController.cs       # POST /api/auth/signup, /api/auth/login
│       │   ├── TasksController.cs      # CRUD for user's own tasks
│       │   └── AdminController.cs      # Admin dashboard, all tasks, user mgmt
│       ├── Data/
│       │   └── AppDbContext.cs         # EF Core DbContext + seed data
│       ├── DTOs/
│       │   └── Dtos.cs                 # All request/response DTOs
│       ├── Helpers/
│       │   └── JwtHelper.cs            # JWT token generation
│       ├── Migrations/                 # EF Core migrations
│       ├── Models/
│       │   ├── AppUser.cs              # User entity
│       │   └── TaskItem.cs             # Task entity
│       ├── appsettings.json            # Config (DB conn, JWT settings)
│       ├── Program.cs                  # App startup, middleware, DI
│       └── TaskBoard.API.csproj
│
└── Frontend/
    ├── public/
    │   └── index.html                  # Bootstrap 5 + Bootstrap Icons CDN
    └── src/
        ├── components/
        │   ├── ConfirmDialog.js        # Reusable confirm modal
        │   ├── Navbar.js               # Top navbar (role-aware)
        │   ├── ProtectedRoute.js       # Route guards (auth + admin)
        │   ├── StatusBadge.js          # Coloured status pill
        │   └── TaskModal.js            # Create/edit task modal
        ├── context/
        │   └── AuthContext.js          # Global auth state + localStorage
        ├── pages/
        │   ├── LoginPage.js
        │   ├── SignupPage.js
        │   ├── MyTasksPage.js          # User: view/create/edit/delete own tasks
        │   ├── AdminDashboard.js       # Admin: stats + progress bars
        │   ├── AdminTasksPage.js       # Admin: all tasks table + delete
        │   └── AdminUsersPage.js       # Admin: user list + role change
        ├── services/
        │   └── api.js                  # Axios instance + all API calls
        ├── App.js                      # React Router routes
        ├── index.css                   # Global styles
        └── index.js                    # React entry point
```

---

## 🚀 API Endpoints

### Auth (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |

### Tasks (Authenticated Users)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get my tasks (optional `?status=`) |
| GET | `/api/tasks/{id}` | Get single task |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/{id}` | Update my task |
| DELETE | `/api/tasks/{id}` | Delete my task |

### Admin (Admin Role Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Stats: user count, task counts by status |
| GET | `/api/admin/tasks` | All users' tasks (optional `?status=`) |
| DELETE | `/api/admin/tasks/{id}` | Delete any task |
| GET | `/api/admin/users` | All registered users |
| PUT | `/api/admin/users/{id}/role` | Change user role |

---

## ⚙️ Setup Instructions

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [SQL Server](https://www.microsoft.com/en-us/sql-server) (or SQL Server Express / LocalDB)
- [Node.js 18+](https://nodejs.org/)

---

### Step 1 — Configure the Database

Open `Backend/TaskBoard.API/appsettings.json` and update the connection string:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=TaskBoardDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

> For SQL Server Express use: `Server=localhost\\SQLEXPRESS;...`  
> For LocalDB use: `Server=(localdb)\\mssqllocaldb;...`

---

### Step 2 — Run the Backend

```bash
cd Backend/TaskBoard.API

# Restore NuGet packages
dotnet restore

# Apply migrations (creates DB + tables + seeds Admin user)
dotnet ef database update

# Start the API (runs on http://localhost:5000)
dotnet run
```

> ✅ The database is created automatically on first run.  
> ✅ The default Admin user is seeded automatically.  
> 📖 Swagger UI is available at: **http://localhost:5000/swagger**

---

### Step 3 — Run the Frontend

```bash
cd Frontend

# Install dependencies
npm install

# Start React dev server (runs on http://localhost:3000)
npm start
```

> The app opens automatically at **http://localhost:3000**

---

### Step 4 — Login

| Field | Value |
|-------|-------|
| Email | `Admin@gmail.com` |
| Password | `Admin@123` |

---

## 🔐 Authentication Flow

1. User signs up / logs in → API returns a **JWT token**
2. Token is stored in `localStorage`
3. Every subsequent API request includes `Authorization: Bearer <token>`
4. Backend validates the token and checks the role claim
5. Admin-only endpoints return `403 Forbidden` for regular users

---

## 🎨 Features Overview

| Feature | User | Admin |
|---------|------|-------|
| Sign up / Log in | ✅ | ✅ |
| Create / edit / delete own tasks | ✅ | ✅ |
| Filter tasks by status | ✅ | ✅ |
| Dashboard with stats | ❌ | ✅ |
| View all users' tasks | ❌ | ✅ |
| Delete any task | ❌ | ✅ |
| View all users | ❌ | ✅ |
| Promote/demote user role | ❌ | ✅ |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | ASP.NET Core 8 Web API |
| Database | SQL Server + Entity Framework Core 8 |
| Auth | JWT Bearer tokens + BCrypt hashing |
| Frontend | React 18 + React Router v6 |
| UI Framework | Bootstrap 5 + Bootstrap Icons |
| HTTP Client | Axios |

---

## 🔧 Changing the JWT Secret

Edit `appsettings.json` and replace the `SecretKey` with a long random string:

```json
"JwtSettings": {
  "SecretKey": "YOUR_LONG_RANDOM_SECRET_HERE_AT_LEAST_32_CHARS",
  ...
}
```

---

## 📝 Notes

- Passwords are hashed using **BCrypt** with work factor 11 — never stored in plain text.
- The `Admin@gmail.com` user is seeded via EF Core's `HasData()` — it's created once on first migration.
- CORS is configured to allow `http://localhost:3000` — update `Program.cs` for production domains.
- JWT tokens expire after **7 days** by default (configurable in `appsettings.json`).
