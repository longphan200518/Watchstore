# Hệ thống Quản lý Cài đặt Website

## Tổng quan

Hệ thống cho phép admin tinh chỉnh toàn bộ giao diện và nội dung trang web user mà không cần thay đổi code. Admin có thể quản lý:

- **Logo và Branding**: Logo, favicon, màu sắc chủ đạo
- **Nội dung trang chủ**: Hero section, banner, tiêu đề
- **Menu điều hướng**: Thêm/sửa/xóa menu items
- **Footer**: Thông tin liên hệ, social links, copyright
- **SEO**: Meta title, description, keywords
- **Tính năng**: Bật/tắt các tính năng như reviews, wishlist
- **Cấu hình**: Số sản phẩm mỗi trang, v.v.

## Các file đã tạo/cập nhật

### Backend

#### Domain Layer

- ✅ `backend/WatchStore.Domain/Entities/WebsiteSettings.cs` - Entity cho settings

#### Infrastructure Layer

- ✅ `backend/WatchStore.Infrastructure/Data/WatchStoreDbContext.cs` - Cập nhật DbContext
- ✅ Migration `AddWebsiteSettings` - Đã tạo và apply vào database

#### Application Layer

- ✅ `backend/WatchStore.Application/DTOs/WebsiteSettingsDtos.cs` - DTOs cho settings
- ✅ `backend/WatchStore.Application/Interfaces/IWebsiteSettingsService.cs` - Interface
- ✅ `backend/WatchStore.Application/Features/WebsiteSettings/WebsiteSettingsService.cs` - Service implementation

#### API Layer

- ✅ `backend/WatchStore.API/Controllers/Admin/AdminWebsiteSettingsController.cs` - Admin API
- ✅ `backend/WatchStore.API/Controllers/WebsiteSettingsController.cs` - Public API
- ✅ `backend/WatchStore.API/Program.cs` - Đăng ký service
- ✅ `backend/WatchStore.API/Data/DatabaseSeeder.cs` - Seed data mẫu

### Frontend Admin

- ✅ `frontend/admin/src/services/websiteSettingsService.js` - API service
- ✅ `frontend/admin/src/pages/WebsiteSettings.jsx` - Trang quản lý settings
- ✅ `frontend/admin/src/App.jsx` - Thêm route `/website-settings`
- ✅ `frontend/admin/src/components/Sidebar.jsx` - Thêm menu item

### Frontend User

- ✅ `frontend/user/src/services/websiteSettingsService.js` - API service
- ✅ `frontend/user/src/contexts/WebsiteSettingsContext.jsx` - Context provider
- ✅ `frontend/user/src/App.jsx` - Tích hợp context provider

### Documentation

- ✅ `docs/WEBSITE_SETTINGS_GUIDE.md` - Hướng dẫn chi tiết sử dụng

## API Endpoints

### Admin (cần token Admin)

```
GET    /api/admin/website-settings              - Lấy tất cả settings
GET    /api/admin/website-settings/by-category  - Lấy theo category
GET    /api/admin/website-settings/{key}        - Lấy 1 setting
POST   /api/admin/website-settings              - Tạo setting mới
PUT    /api/admin/website-settings/{key}        - Cập nhật 1 setting
PUT    /api/admin/website-settings/bulk         - Cập nhật nhiều settings
DELETE /api/admin/website-settings/{key}        - Xóa setting
```

### Public (không cần auth)

```
GET    /api/website-settings                    - Lấy tất cả settings (dạng key-value)
```

## Cách sử dụng

### 1. Trong Admin App

Truy cập `/website-settings` trong admin panel để:

- Xem tất cả settings theo category
- Chỉnh sửa giá trị settings
- Thêm settings mới
- Xóa settings không cần thiết
- Lưu từng setting hoặc lưu hàng loạt

### 2. Trong User App

Sử dụng hook `useWebsiteSettings()` trong components:

```jsx
import { useWebsiteSettings } from "../contexts/WebsiteSettingsContext";

function MyComponent() {
  const {
    getSetting, // Lấy text
    getSettingBoolean, // Lấy boolean
    getSettingNumber, // Lấy number
    getSettingJSON, // Lấy JSON
  } = useWebsiteSettings();

  const siteName = getSetting("site_name", "Watch Store");
  const logoUrl = getSetting("logo_url");
  const primaryColor = getSetting("primary_color", "#3B82F6");
  const showSearch = getSettingBoolean("show_search_in_header", true);
  const productsPerPage = getSettingNumber("products_per_page", 12);
  const menuItems = getSettingJSON("menu_items", []);

  return (
    <div>
      <img src={logoUrl} alt={siteName} />
      {/* ... */}
    </div>
  );
}
```

## Settings mặc định đã có

### Categories:

1. **General** - Thông tin chung (tên site, liên hệ)
2. **Branding** - Logo, màu sắc
3. **Homepage** - Nội dung trang chủ
4. **Navigation** - Menu điều hướng
5. **Footer** - Thông tin footer
6. **SEO** - Meta tags
7. **Features** - Bật/tắt tính năng

Xem chi tiết trong [docs/WEBSITE_SETTINGS_GUIDE.md](WEBSITE_SETTINGS_GUIDE.md)

## Các bước tiếp theo để hoàn thiện

### User App Integration

Cần tích hợp settings vào các components của user app:

1. **Header/Navbar**

   - Sử dụng `logo_url`, `site_name`
   - Áp dụng `primary_color`, `secondary_color`
   - Hiển thị menu từ `menu_items`

2. **Home Page**

   - Sử dụng hero settings: `hero_title`, `hero_subtitle`, `hero_image`, `hero_cta_text`
   - Featured section title từ `featured_section_title`

3. **Footer**

   - Hiển thị `footer_about`, `footer_copyright`
   - Social links: `social_facebook`, `social_instagram`, `social_twitter`
   - Contact info: `contact_email`, `contact_phone`, `contact_address`

4. **SEO/Head**

   - Áp dụng `meta_title`, `meta_description`, `meta_keywords`
   - Favicon từ `favicon_url`

5. **Theme**
   - Áp dụng `primary_color`, `secondary_color` vào CSS variables

### Tính năng mở rộng

1. **Upload ảnh trực tiếp**

   - Tích hợp upload file cho các settings kiểu image
   - Có thể dùng Cloudinary hoặc local storage

2. **Preview**

   - Thêm nút preview trong admin để xem trước thay đổi

3. **Cache**

   - Cache settings ở backend để tăng performance
   - LocalStorage cache ở frontend

4. **Auto refresh**

   - WebSocket hoặc polling để auto-refresh khi admin thay đổi

5. **Import/Export**

   - Export settings ra JSON
   - Import settings từ JSON

6. **Version control**
   - Lưu lịch sử thay đổi settings
   - Rollback về version trước

## Khởi động dự án

```bash
# Backend
cd backend/WatchStore.API
dotnet run

# Admin App
cd frontend/admin
npm install
npm run dev

# User App
cd frontend/user
npm install
npm run dev
```

Admin app sẽ có thêm menu "Cài đặt Website" để quản lý settings.

## Lưu ý

- Settings được load khi app khởi động
- User cần refresh trang để thấy thay đổi từ admin
- Tất cả settings đều có giá trị mặc định
- Admin có thể thêm settings tùy chỉnh mới bất cứ lúc nào
