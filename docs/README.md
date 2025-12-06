# WatchStore - Watch E-commerce System

## Thông tin Project

**Tên**: WatchStore
**Mô tả**: Hệ thống quản lý và bán hàng đồng hồ với Clean Architecture
**Kiến trúc**: Clean Architecture (5 layers)
**Tech Stack**: .NET 8, EF Core, SQL Server, Docker

## Cấu trúc Project

```
WatchStore/
├── backend/
│   ├── src/
│   │   └── WatchStore/
│   │       ├── WatchStore.API          # Presentation Layer
│   │       ├── WatchStore.Application  # Application Layer (CQRS)
│   │       ├── WatchStore.Domain       # Domain Layer (Entities, Enums)
│   │       ├── WatchStore.Infrastructure # Data Access Layer
│   │       └── WatchStore.Common       # Shared/Common utilities
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Entities chính

- **User**: Người dùng hệ thống (Admin/Customer)
- **Brand**: Thương hiệu đồng hồ (Rolex, Omega, Casio...)
- **Watch**: Sản phẩm đồng hồ
- **WatchImage**: Hình ảnh sản phẩm
- **Order**: Đơn hàng
- **OrderItem**: Chi tiết đơn hàng

## Chạy Project

### 1. Sử dụng Docker (Khuyến nghị)

```bash
# Build và chạy tất cả services
docker-compose up --build

# Chỉ chạy (nếu đã build)
docker-compose up

# Dừng services
docker-compose down
```

API sẽ chạy tại: `http://localhost:7000`
Swagger UI: `http://localhost:7000/swagger`

### 2. Chạy trực tiếp (không dùng Docker)

**Yêu cầu:**
- .NET 8 SDK
- SQL Server

**Bước 1**: Update connection string trong `appsettings.json`

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=WatchStoreDB;Integrated Security=true;TrustServerCertificate=True"
}
```

**Bước 2**: Chạy migrations

```bash
cd backend/src/WatchStore/WatchStore.API
dotnet ef database update
```

**Bước 3**: Chạy API

```bash
dotnet run --project backend/src/WatchStore/WatchStore.API
```

## Tài khoản mặc định

**Admin Account:**
- Email: `admin@gmail.com`
- Password: `admin123@`

## API Endpoints (Swagger)

Truy cập Swagger UI để xem full API documentation:
`http://localhost:7000/swagger`

### Auth Endpoints
- POST `/api/auth/login` - Đăng nhập
- POST `/api/auth/register` - Đăng ký

### Watch Endpoints
- GET `/api/watches` - Lấy danh sách đồng hồ
- GET `/api/watches/{id}` - Chi tiết đồng hồ
- POST `/api/watches` - Tạo mới (Admin)
- PUT `/api/watches/{id}` - Cập nhật (Admin)
- DELETE `/api/watches/{id}` - Xóa (Admin)

### Brand Endpoints
- GET `/api/brands` - Danh sách thương hiệu
- POST `/api/brands` - Tạo mới (Admin)

### Order Endpoints
- GET `/api/orders` - Lấy đơn hàng của user
- POST `/api/orders` - Tạo đơn hàng mới
- GET `/api/orders/{id}` - Chi tiết đơn hàng

## Database

Database được tạo và seed tự động khi chạy application lần đầu.

**Database name**: `WatchStoreDB`

**Tables**:
- AspNetUsers, AspNetRoles (Identity tables)
- Brands
- Watches
- WatchImages
- Orders
- OrderItems

## Configuration

### Ports
- **API**: 7000 (HTTP)
- **SQL Server**: 1433
- **Frontend**: 6868 (planned)

### JWT Settings
Có thể thay đổi trong `appsettings.json`:
```json
"JwtSettings": {
  "Secret": "YourSuperSecretKeyForWatchStore2024!@#",
  "Issuer": "https://localhost:7000",
  "Audience": "http://localhost:6868",
  "ExpirationInMinutes": 60
}
```

## Development

### Tạo Migration mới

```bash
cd backend/src/WatchStore
dotnet ef migrations add MigrationName --project WatchStore.Infrastructure --startup-project WatchStore.API
```

### Apply Migrations

```bash
dotnet ef database update --project WatchStore.Infrastructure --startup-project WatchStore.API
```

### Build Solution

```bash
cd backend/src/WatchStore
dotnet build
```

## Troubleshooting

### Lỗi SQL Server connection
- Kiểm tra SQL Server đang chạy
- Kiểm tra connection string
- Nếu dùng Docker, đợi SQL Server khởi động hoàn tất

### Lỗi Port đã được sử dụng
```bash
# Thay đổi port trong docker-compose.yml hoặc appsettings.json
```

### Lỗi Migration
```bash
# Xóa database và chạy lại
dotnet ef database drop --force
dotnet ef database update
```

## Tác giả

- **Developer**: Your Name
- **Email**: your.email@example.com
- **Project**: Đồ án CNPM nâng cao

## License

MIT License - Free to use for educational purposes.
