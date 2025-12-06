# 🕐 WatchStore - Luxury Watch E-Commerce Platform

> **Website thương mại điện tử đồng hồ cao cấp** - Nền tảng bán hàng chuyên nghiệp với giao diện hiện đại, sang trọng và trải nghiệm người dùng tuyệt vời.

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=.net)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![SQL Server](https://img.shields.io/badge/SQL_Server-2022-CC2927?logo=microsoftSqlServer)](https://www.microsoft.com/sql-server)

---

## 📋 Giới thiệu

**WatchStore** là nền tảng thương mại điện tử chuyên về đồng hồ cao cấp, được xây dựng với công nghệ hiện đại và kiến trúc Clean Architecture. Hệ thống bao gồm:

- 🎨 **User Website**: Giao diện người dùng sang trọng với thiết kế editorial, dark/light mode, responsive hoàn toàn
- 🔧 **Admin Dashboard**: Trang quản trị đầy đủ tính năng quản lý sản phẩm, đơn hàng, khách hàng
- ⚡ **Backend API**: RESTful API với .NET 8, Entity Framework Core, JWT Authentication

### ✨ Tính năng nổi bật

#### User Website:
- 🎭 Dark/Light mode với localStorage persistence
- 🎨 Giao diện luxury editorial với typography tinh tế
- 📱 Responsive design hoàn hảo trên mọi thiết bị
- 🌐 Hỗ trợ đa ngôn ngữ (hiện tại: Tiếng Việt)
- 🖼️ Hero section full-screen với gradient overlays
- 🛍️ Danh mục sản phẩm với filter và search
- 💎 Featured products showcase
- 📬 Newsletter subscription
- 🏆 Brand showcase

#### Admin Dashboard:
- 📊 Thống kê tổng quan dashboard
- 📦 Quản lý sản phẩm (CRUD)
- 🛒 Quản lý đơn hàng
- 👥 Quản lý khách hàng
- 🏷️ Quản lý thương hiệu

#### Backend API:
- 🔐 JWT Authentication & Authorization
- 📝 Clean Architecture với DDD
- 🗄️ Entity Framework Core + SQL Server
- 🔍 Repository Pattern & Unit of Work
- ✅ FluentValidation
- 🚀 CORS & Swagger Documentation

---

## 🏗️ Kiến trúc dự án

### Cấu trúc thư mục

```
Watchstore/
├── 📁 backend/                      # Backend API (.NET 8)
│   ├── Dockerfile
│   └── src/WatchStore/
│       ├── WatchStore.API/          # Web API Layer
│       │   ├── Controllers/         # API Controllers
│       │   ├── Middlewares/         # Custom Middlewares
│       │   └── Program.cs           # Entry point
│       ├── WatchStore.Application/  # Business Logic Layer
│       │   ├── DTOs/                # Data Transfer Objects
│       │   ├── Features/            # Feature folders
│       │   ├── Interfaces/          # Service interfaces
│       │   └── Validators/          # FluentValidation
│       ├── WatchStore.Domain/       # Domain Layer
│       │   ├── Entities/            # Domain entities
│       │   ├── Enums/               # Enumerations
│       │   └── Interfaces/          # Repository interfaces
│       ├── WatchStore.Infrastructure/ # Data Access Layer
│       │   ├── Data/                # DbContext
│       │   ├── Migrations/          # EF Migrations
│       │   └── Repositories/        # Repository implementations
│       └── WatchStore.Common/       # Shared utilities
│
├── 📁 frontend/                     # Frontend Applications
│   ├── admin/                       # Admin Dashboard (React + Vite)
│   │   ├── src/
│   │   │   ├── components/         # Reusable components
│   │   │   ├── pages/              # Page components
│   │   │   ├── services/           # API services
│   │   │   └── styles/             # Global styles
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   └── user/                        # User Website (React + Vite)
│       ├── src/
│       │   ├── components/         # UI components
│       │   ├── pages/              # Page components
│       │   │   └── Home.jsx        # Landing page
│       │   ├── services/           # API client
│       │   └── styles/             # Tailwind CSS
│       ├── package.json
│       └── vite.config.js
│
├── 📁 docs/                         # Documentation
│   ├── README.md
│   ├── INSTALL_NODEJS.md
│   ├── VERIFICATION_REPORT.md
│   └── VISUAL_STUDIO_WORKFLOW.md
│
├── 📁 scripts/                      # Utility scripts
│   └── verify-nodejs.bat
│
├── .gitignore
├── docker-compose.yml               # Docker orchestration
└── README.md
```

---

## 🚀 Cài đặt & Chạy dự án

### Yêu cầu hệ thống

- **Node.js**: >= 18.x
- **.NET SDK**: 8.0
- **SQL Server**: 2019 hoặc mới hơn
- **Git**: Latest version
- **Visual Studio 2022** hoặc **VS Code**

### 1️⃣ Clone repository

```bash
git clone https://github.com/longphan200518/Watchstore.git
cd Watchstore
```

### 2️⃣ Cài đặt Backend

```bash
cd backend/src/WatchStore
dotnet restore
dotnet ef database update --project WatchStore.Infrastructure --startup-project WatchStore.API
```

### 3️⃣ Cài đặt Frontend

**User Website:**
```bash
cd frontend/user
npm install
```

**Admin Dashboard:**
```bash
cd frontend/admin
npm install
```

### 4️⃣ Cấu hình

**Backend** - `backend/src/WatchStore/WatchStore.API/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=WatchStoreDb;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key-here",
    "Issuer": "WatchStore",
    "Audience": "WatchStoreUsers"
  }
}
```

**Frontend** - Tạo file `.env.local`:
```bash
VITE_API_BASE_URL=http://localhost:5221/api
```

### 5️⃣ Chạy ứng dụng

**Backend API:**
```bash
cd backend/src/WatchStore/WatchStore.API
dotnet run
```

**User Website:**
```bash
cd frontend/user
npm run dev
```

**Admin Dashboard:**
```bash
cd frontend/admin
npm run dev
```

---

## 🌐 URLs & Ports

| Application | URL | Port |
|------------|-----|------|
| 🖥️ Backend API | http://localhost:5221 | 5221 |
| 🎨 User Website | http://localhost:3000 | 3000 |
| 🔧 Admin Dashboard | http://localhost:3001 | 3001 |
| 📚 Swagger API Docs | http://localhost:5221/swagger | 5221 |

---

## 🛠️ Tech Stack

### Backend
- **Framework**: .NET 8.0
- **ORM**: Entity Framework Core 8.0
- **Database**: SQL Server 2022
- **Authentication**: JWT Bearer
- **Validation**: FluentValidation
- **Documentation**: Swagger/OpenAPI

### Frontend
- **Library**: React 18
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 3.4
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Icons**: Lucide React

### DevOps
- **Containerization**: Docker & Docker Compose
- **Version Control**: Git & GitHub
- **IDE**: Visual Studio 2022, VS Code

---

## 📦 Database Schema

### Entities chính:

- **User**: Người dùng (Admin, Customer)
- **Role**: Vai trò người dùng
- **Watch**: Sản phẩm đồng hồ
- **Brand**: Thương hiệu
- **Order**: Đơn hàng
- **OrderItem**: Chi tiết đơn hàng
- **WatchImage**: Hình ảnh sản phẩm

---

## 🎨 Design System

### Typography
- **Font**: System font stack (sans-serif)
- **Weights**: extralight (200), light (300), normal (400), semibold (600)
- **Sizes**: text-xs → text-8xl
- **Letter Spacing**: tracking-tight → tracking-[0.3em]

### Colors
- **Primary**: Amber (400, 600)
- **Dark Mode**: Neutral (900, 950), Black
- **Light Mode**: Zinc (50, 100), White
- **Accent**: Gray (400-600)

### Layout
- **Max Width**: 1400px - 1600px
- **Padding**: px-8 lg:px-16
- **Spacing**: space-y-4 → space-y-10

---

## 📝 API Endpoints

### Authentication
```
POST   /api/auth/register      # Đăng ký
POST   /api/auth/login         # Đăng nhập
POST   /api/auth/refresh       # Refresh token
```

### Watches
```
GET    /api/watches            # Lấy danh sách
GET    /api/watches/{id}       # Chi tiết sản phẩm
POST   /api/watches            # Tạo mới (Admin)
PUT    /api/watches/{id}       # Cập nhật (Admin)
DELETE /api/watches/{id}       # Xóa (Admin)
```

### Orders
```
GET    /api/orders             # Danh sách đơn hàng
GET    /api/orders/{id}        # Chi tiết đơn hàng
POST   /api/orders             # Tạo đơn hàng
PUT    /api/orders/{id}/status # Cập nhật trạng thái
```

### Brands
```
GET    /api/brands             # Danh sách thương hiệu
POST   /api/brands             # Tạo thương hiệu (Admin)
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Long Phan**
- GitHub: [@longphan200518](https://github.com/longphan200518)
- Repository: [Watchstore](https://github.com/longphan200518/Watchstore)

---

## 📞 Support

Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng tạo issue trên GitHub.

---

**⭐ Nếu bạn thấy dự án hữu ích, hãy cho một ngôi sao nhé! ⭐**
