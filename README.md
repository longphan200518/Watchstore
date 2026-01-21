# 🕐 WatchStore - Luxury Watch E-Commerce Platform

> **Website thương mại điện tử đồng hồ cao cấp** - Nền tảng bán hàng chuyên nghiệp với giao diện hiện đại, sang trọng và trải nghiệm người dùng tuyệt vời.

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=.net)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![SQL Server](https://img.shields.io/badge/SQL_Server-2022-CC2927?logo=microsoftSqlServer)](https://www.microsoft.com/sql-server)

---

## 📋 Giới thiệu

**WatchStore** là nền tảng thương mại điện tử chuyên về đồng hồ cao cấp, được xây dựng với công nghệ hiện đại và kiến trúc Clean Architecture. Hệ thống cung cấp trải nghiệm mua sắm trực tuyến hoàn chỉnh với:

- 🎨 **User Website**: Giao diện người dùng sang trọng, responsive hoàn toàn với dark/light mode, SEO optimization, tích hợp thanh toán VNPay, hệ thống coupon và email notifications
- 🔧 **Admin Dashboard**: Trang quản trị đầy đủ tính năng quản lý sản phẩm, đơn hàng, khách hàng, coupons, reviews và website settings với UI/UX hiện đại
- ⚡ **Backend API**: RESTful API với .NET 8, Clean Architecture, JWT Authentication, Entity Framework Core, VNPay payment gateway và SMTP email service

Dự án được thiết kế theo kiến trúc phân lớp rõ ràng (Clean Architecture) với separation of concerns, dễ dàng maintain, test và scale trong tương lai.

### ✨ Tính năng nổi bật

#### 🎨 User Website:

- 🎭 **Theme Switching**: Dark/Light mode với localStorage persistence và animations mượt mà
- 🎨 **Luxury Design**: Giao diện editorial cao cấp với typography tinh tế
- 📱 **Fully Responsive**: Hoàn hảo trên mọi thiết bị từ mobile đến desktop
- 🔍 **SEO Optimization**: Tích hợp React Helmet, dynamic meta tags, Open Graph
- 🖼️ **Hero Section**: Full-screen với gradient overlays và call-to-action
- 🛍️ **Product Catalog**: Filter, search, pagination với UX tối ưu
- 💎 **Featured Products**: Showcase sản phẩm nổi bật
- 🎫 **Coupon System**: Áp dụng mã giảm giá trong quá trình checkout
- 💳 **VNPay Integration**: Thanh toán trực tuyến với cổng VNPay
- 📧 **Email Notifications**: Gửi email xác nhận đơn hàng tự động
- 🏆 **Brand Showcase**: Hiển thị các thương hiệu đồng hồ cao cấp
- ⚙️ **Dynamic Settings**: Website settings từ database (logo, colors, contact info)
- 🎬 **Page Transitions**: Animations và transitions mượt mà
- 📬 **Newsletter**: Subscription form

#### 🔧 Admin Dashboard:

- 📊 **Dashboard**: Thống kê tổng quan về doanh thu, đơn hàng, khách hàng
- 📦 **Product Management**: CRUD sản phẩm với upload hình ảnh đa tệp
- 🛒 **Order Management**: Quản lý đơn hàng, cập nhật trạng thái, xem chi tiết
- 👥 **Customer Management**: Quản lý người dùng, phân quyền
- 🏷️ **Brand Management**: CRUD thương hiệu đồng hồ
- 🎫 **Coupon System**: Tạo và quản lý mã giảm giá (% hoặc fixed amount)
- ⭐ **Review Management**: Duyệt và quản lý đánh giá sản phẩm
- ⚙️ **Website Settings**: Cấu hình website (logo, colors, SEO, contact info)
- 🖼️ **Image Upload**: Upload và quản lý hình ảnh lên server
- 🎨 **Modern UI**: Giao diện đẹp với animations, loading states, error boundaries
- 🔔 **Notifications**: Toast notifications cho các thao tác

#### ⚡ Backend API:

- 🔐 **Authentication**: JWT Bearer tokens với refresh token support
- 👤 **Authorization**: Role-based access control (Admin, Customer)
- 📝 **Clean Architecture**: 4-layer architecture (API, Application, Domain, Infrastructure)
- 🗄️ **Database**: Entity Framework Core 8.0 + SQL Server 2022
- 🔍 **Design Patterns**: Repository, Unit of Work, CQRS-like structure
- ✅ **Validation**: FluentValidation cho request validation
- 📧 **Email Service**: SMTP email service với template support
- 💳 **VNPay Payment**: Tích hợp cổng thanh toán VNPay
- 🎫 **Coupon Logic**: Validation và áp dụng coupon với business rules
- 🌐 **CORS**: Configured cho frontend origins
- 📚 **API Documentation**: Swagger/OpenAPI với detailed schemas
- 🛡️ **Global Exception Handler**: Centralized error handling
- 🗃️ **Seed Data**: Database seeder cho development

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
    "SecretKey": "your-secret-key-minimum-32-characters-long",
    "Issuer": "WatchStore",
    "Audience": "WatchStoreUsers",
    "ExpiryInMinutes": 60,
    "RefreshTokenExpiryInDays": 7
  },
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": 587,
    "SenderName": "WatchStore",
    "SenderEmail": "your-email@gmail.com",
    "Username": "your-email@gmail.com",
    "Password": "your-app-password"
  },
  "VNPaySettings": {
    "TmnCode": "your-vnpay-tmn-code",
    "HashSecret": "your-vnpay-hash-secret",
    "BaseUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    "ReturnUrl": "http://localhost:3000/payment-success",
    "CallbackUrl": "http://localhost:5221/api/payment/callback"
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

| Application         | URL                           | Port |
| ------------------- | ----------------------------- | ---- |
| 🖥️ Backend API      | http://localhost:5221         | 5221 |
| 🎨 User Website     | http://localhost:3000         | 3000 |
| 🔧 Admin Dashboard  | http://localhost:3001         | 3001 |
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

- **User**: Người dùng (Admin, Customer) với authentication
- **Role**: Vai trò người dùng (phân quyền)
- **Watch**: Sản phẩm đồng hồ với đầy đủ thông tin
- **Brand**: Thương hiệu đồng hồ
- **Order**: Đơn hàng với payment status
- **OrderItem**: Chi tiết sản phẩm trong đơn hàng
- **WatchImage**: Hình ảnh sản phẩm (multiple images)
- **Review**: Đánh giá sản phẩm từ khách hàng
- **Coupon**: Mã giảm giá (percentage/fixed amount)
- **WebsiteSettings**: Cấu hình website động (logo, colors, SEO, contact)

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
GET    /api/watches            # Lấy danh sách (filter, search, pagination)
GET    /api/watches/{id}       # Chi tiết sản phẩm
POST   /api/watches            # Tạo mới (Admin)
PUT    /api/watches/{id}       # Cập nhật (Admin)
DELETE /api/watches/{id}       # Xóa (Admin)
GET    /api/watches/featured   # Sản phẩm nổi bật
```

### Orders

```
GET    /api/orders             # Danh sách đơn hàng
GET    /api/orders/{id}        # Chi tiết đơn hàng
POST   /api/orders             # Tạo đơn hàng
PUT    /api/orders/{id}/status # Cập nhật trạng thái (Admin)
GET    /api/orders/user/{id}   # Đơn hàng của user
```

### Brands

```
GET    /api/brands             # Danh sách thương hiệu
GET    /api/brands/{id}        # Chi tiết thương hiệu
POST   /api/brands             # Tạo thương hiệu (Admin)
PUT    /api/brands/{id}        # Cập nhật (Admin)
DELETE /api/brands/{id}        # Xóa (Admin)
```

### Coupons

```
GET    /api/coupons            # Danh sách mã giảm giá (Admin)
GET    /api/coupons/{code}     # Validate coupon code
POST   /api/coupons            # Tạo coupon (Admin)
PUT    /api/coupons/{id}       # Cập nhật (Admin)
DELETE /api/coupons/{id}       # Xóa (Admin)
```

### Payment

```
POST   /api/payment/create-payment-url    # Tạo URL thanh toán VNPay
GET    /api/payment/callback              # VNPay callback
POST   /api/payment/ipn                   # VNPay IPN notification
```

### Website Settings

```
GET    /api/websitesettings    # Lấy cấu hình website
PUT    /api/websitesettings    # Cập nhật cấu hình (Admin)
```

### Reviews

```
GET    /api/reviews/watch/{watchId}  # Đánh giá của sản phẩm
POST   /api/reviews                  # Tạo đánh giá
PUT    /api/reviews/{id}/approve     # Duyệt đánh giá (Admin)
DELETE /api/reviews/{id}             # Xóa đánh giá (Admin)
```

### SEO

```
GET    /api/seo/watches/{id}   # SEO data cho sản phẩm
GET    /api/seo/brands/{id}    # SEO data cho thương hiệu
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
