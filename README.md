<div align="center">
  <img src="https://raw.githubusercontent.com/longphan200518/Watchstore/main/frontend/user/public/logo.png" alt="WatchStore Logo" width="120" />
  <h1>🕐 WatchStore</h1>
  <p><b>Nền Tảng Thương Mại Điện Tử Đồng Hồ Cao Cấp</b></p>
  <p><i>Hệ thống bán lẻ với giao diện Minimalist hiện đại, tích hợp thanh toán trực tuyến bảo mật</i></p>

  <p>
    <img src="https://img.shields.io/badge/.NET-8.0-512BD4?style=flat-square&logo=.net&logoColor=white" alt=".NET 8" />
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 18" />
    <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/SQL_Server-2022-CC2927?style=flat-square&logo=microsoftSqlServer&logoColor=white" alt="SQL Server" />
  </p>
</div>

<br />

> **Mục tiêu dự án**: Xây dựng một hệ thống E-commerce hoàn chỉnh, áp dụng các best practices trong Software Engineering. Tách biệt rõ ràng giữa Client (ReactJS) và Server (ASP.NET Core Web API), tối ưu hóa trải nghiệm người dùng với thiết kế Minimalist siêu mượt và tích hợp cổng thanh toán thực tế (VNPay).

<details open>
  <summary>📋 <b>Bảng nội dung (Table of Contents)</b></summary>
  <table>
    <tr>
      <td valign="top">
        <ul>
          <li><a href="#-1-giới-thiệu-dự-án">1. Giới thiệu dự án</a></li>
          <li><a href="#-2-tính-năng-chính">2. Tính năng chính</a></li>
          <li><a href="#-3-công-nghệ-sử-dụng">3. Công nghệ sử dụng</a></li>
          <li><a href="#-4-flow-hệ-thống">4. Flow hệ thống</a></li>
          <li><a href="#-5-cấu-trúc-thư-mục">5. Cấu trúc thư mục</a></li>
          <li><a href="#-6-database-design">6. Database Design</a></li>
          <li><a href="#-7-hướng-dẫn-cài-đặt">7. Hướng dẫn cài đặt</a></li>
        </ul>
      </td>
      <td valign="top">
        <ul>
          <li><a href="#-8-tài-khoản-demo">8. Tài khoản Demo</a></li>
          <li><a href="#-9-screenshots">9. Screenshots</a></li>
          <li><a href="#-10-chức-năng-nổi-bật">10. Chức năng nổi bật</a></li>
          <li><a href="#-11-bảo-mật">11. Bảo mật</a></li>
          <li><a href="#-12-kiểm-thử">12. Kiểm thử</a></li>
          <li><a href="#-13-khó-khăn--bài-học">13 & 14. Khó khăn & Bài học</a></li>
          <li><a href="#-15-hướng-phát-triển">15. Hướng phát triển</a></li>
        </ul>
      </td>
    </tr>
  </table>
</details>

---

## ✨ 2. Tính năng chính

Hệ thống được chia làm 2 phân hệ rõ ràng với các tính năng chuyên biệt:

<div align="center">
  <table>
    <tr>
      <th width="50%">👤 Customer (Khách hàng)</th>
      <th width="50%">🛠️ Admin (Quản trị viên)</th>
    </tr>
    <tr>
      <td valign="top">
        <ul>
          <li><b>Tài khoản</b>: Đăng ký, Đăng nhập (JWT), Xác minh Email, Quên/Đổi mật khẩu, Quản lý địa chỉ.</li>
          <li><b>Sản phẩm</b>: Tìm kiếm đa luồng, Lọc (Brand, Category, Mức giá), Sắp xếp, Xem chi tiết.</li>
          <li><b>Mua sắm</b>: Thêm vào giỏ hàng, Cập nhật số lượng, Xem lại đơn.</li>
          <li><b>Thanh toán</b>: Checkout, Chọn phương thức giao hàng, Thanh toán trực tuyến VNPay.</li>
          <li><b>Tương tác</b>: Wishlist (Sản phẩm yêu thích), Đánh giá & Bình luận sản phẩm.</li>
          <li><b>Theo dõi</b>: Lịch sử đơn hàng, Order Tracking chi tiết.</li>
        </ul>
      </td>
      <td valign="top">
        <ul>
          <li><b>Dashboard</b>: Biểu đồ thống kê doanh thu, khách hàng, đơn hàng trực quan.</li>
          <li><b>Quản lý Cửa hàng</b>: CRUD Sản phẩm (kèm nhiều ảnh), Danh mục, Thương hiệu.</li>
          <li><b>Quản lý Kinh doanh</b>: Xem và cập nhật trạng thái đơn hàng, Quản lý mã giảm giá (Coupon).</li>
          <li><b>Quản lý Người dùng</b>: Xem danh sách, phân quyền, khóa tài khoản khách hàng.</li>
          <li><b>Kiểm duyệt</b>: Duyệt, ẩn hoặc xóa đánh giá sản phẩm.</li>
          <li><b>Báo cáo</b>: Xuất dữ liệu thống kê, báo cáo doanh thu chi tiết.</li>
        </ul>
      </td>
    </tr>
  </table>
</div>

---

## 💻 3. Công nghệ sử dụng

| Phân lớp | Công nghệ / Thư viện | Ý nghĩa / Vai trò |
| :--- | :--- | :--- |
| **Frontend** | `ReactJS 18`, `Vite` | Xây dựng giao diện UI/UX mượt mà, tốc độ build nhanh. |
| **Styling** | `Tailwind CSS` | Thiết kế giao diện Minimalist Đen/Trắng sang trọng. |
| **Backend** | `ASP.NET Core 8 Web API` | Xử lý logic nghiệp vụ, kiến trúc Clean Architecture. |
| **ORM** | `Entity Framework Core` | Giao tiếp với cơ sở dữ liệu qua Code-First. |
| **Database** | `SQL Server 2022` | Lưu trữ dữ liệu hệ thống an toàn và có tính toàn vẹn cao. |
| **Security** | `JWT`, `ASP.NET Identity`| Phân quyền Role-based, mã hóa mật khẩu, bảo mật API. |
| **Payments** | `VNPay Sandbox` | Cổng thanh toán điện tử thực tế. |
| **Cloud/Mail** | `SMTP Gmail` | Gửi Email xác minh và hóa đơn tự động. |

---

## 🔄 4. Flow hệ thống

<details>
<summary><b>Nhấn để xem chi tiết các luồng xử lý (Workflows)</b></summary>
<br/>

**🛍️ Customer Flow:**
> Home ➔ Login / Register ➔ Shop ➔ Product Detail ➔ Add To Cart ➔ Cart ➔ Checkout ➔ Shipping Method ➔ Payment Method ➔ VNPay ➔ Order Success ➔ Order Tracking

**⚙️ Admin Flow:**
> Admin Login ➔ Dashboard ➔ Products ➔ Orders ➔ Customers ➔ Statistics

**💳 Payment Flow:**
> Checkout ➔ VNPay Gateway ➔ VNPay Callback ➔ Verify Signature ➔ Update Order Status ➔ Send Confirmation Email

</details>

---

## 📂 5. Cấu trúc thư mục

<details>
<summary><b>Nhấn để xem kiến trúc Source Code</b></summary>

Dự án tuân theo chuẩn **Clean Architecture** ở Backend và Component-based ở Frontend:

```text
Watchstore/
├── backend/
│   └── src/WatchStore/
│       ├── WatchStore.API/           # Controllers, Middlewares, Program.cs
│       ├── WatchStore.Application/   # Services, DTOs, FluentValidation
│       ├── WatchStore.Domain/        # Entities, Enums, Interfaces
│       └── WatchStore.Infrastructure/# DbContext, EF Migrations, Repositories
├── frontend/
│   ├── admin/                        # ReactJS Admin Dashboard
│   │   ├── src/components/
│   │   ├── src/pages/
│   │   └── src/services/
│   └── user/                         # ReactJS Customer Website
│       ├── src/components/
│       ├── src/pages/
│       └── src/contexts/
└── README.md
```
</details>

---

## 🗄️ 6. Database Design

Hệ thống được thiết kế chuẩn hóa dữ liệu cao (Normalization), phục vụ đầy đủ vòng đời E-commerce. Các bảng cốt lõi:
- **Tài khoản**: `Users`, `Roles`
- **Hàng hóa**: `Products`, `Categories`, `Brands`, `ProductImages`
- **Kinh doanh**: `Orders`, `OrderItems`, `Payments`, `ShippingMethods`
- **Khách hàng**: `Addresses`, `Coupons`, `Reviews`, `Wishlists`

*(Hình ảnh ERD Diagram sẽ được cập nhật tại đây)*

---

## ⚙️ 7. Hướng dẫn cài đặt

<details>
<summary><b>Các bước cài đặt và chạy dự án (Local Development)</b></summary>
<br/>

**Bước 1: Clone Repository**
```bash
git clone https://github.com/longphan200518/Watchstore.git
cd Watchstore
```

**Bước 2: Cấu hình Connection String & API Keys**
Mở file `backend/src/WatchStore/WatchStore.API/appsettings.json` và điền cấu hình Database, SMTP Email, và VNPay `TmnCode` / `HashSecret`.

**Bước 3: Chạy Backend (EF Core tự động tạo DB)**
```bash
cd backend/src/WatchStore/WatchStore.API
dotnet run
```

**Bước 4: Chạy Frontend (User & Admin)**
```bash
# Terminal 1: Chạy trang Khách hàng
cd frontend/user
npm install && npm run dev

# Terminal 2: Chạy trang Quản trị
cd frontend/admin
npm install && npm run dev
```
</details>

---

## 👤 8. Tài khoản Demo

| Phân quyền | Email Đăng nhập | Mật khẩu |
| :--- | :--- | :--- |
| 🛡️ **Admin** | `admin@watchstore.com` | `Admin@123` |
| 🧑 **Customer** | `user@example.com` | `User@123` |

*(Sử dụng tài khoản trên để trải nghiệm nhanh các chức năng của hệ thống)*

---

## 📸 9. Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center"><b>Home / Hero Banner</b></td>
      <td align="center"><b>Sản phẩm nổi bật</b></td>
    </tr>
    <tr>
      <td><img src="https://via.placeholder.com/600x350.png?text=Home+Banner" alt="Home Banner"/></td>
      <td><img src="https://via.placeholder.com/600x350.png?text=Featured+Products" alt="Featured Products"/></td>
    </tr>
    <tr>
      <td align="center"><b>Chi tiết sản phẩm</b></td>
      <td align="center"><b>Shopping Cart & Checkout</b></td>
    </tr>
    <tr>
      <td><img src="https://via.placeholder.com/600x350.png?text=Product+Detail" alt="Product Detail"/></td>
      <td><img src="https://via.placeholder.com/600x350.png?text=Cart+and+Checkout" alt="Checkout"/></td>
    </tr>
    <tr>
      <td align="center"><b>Thanh toán VNPay</b></td>
      <td align="center"><b>Admin Dashboard</b></td>
    </tr>
    <tr>
      <td><img src="https://via.placeholder.com/600x350.png?text=VNPay+Gateway" alt="VNPay"/></td>
      <td><img src="https://via.placeholder.com/600x350.png?text=Admin+Dashboard" alt="Admin"/></td>
    </tr>
  </table>
</div>

---

## ⭐ 10. Chức năng nổi bật

- 🎨 **Luxury Minimal UI**: Giao diện thiết kế theo triết lý Tối giản (Minimalism) với tone Đen/Trắng/Xám, tập trung sự chú ý hoàn toàn vào vẻ đẹp của sản phẩm đồng hồ.
- 💳 **VNPay Integration**: Tích hợp cổng thanh toán Sandbox chuẩn, xử lý an toàn callback IPN.
- 🏷️ **Dynamic Coupon System**: Áp dụng mã giảm giá tự động tính toán lại tổng tiền.
- 📧 **Automated Emails**: Gửi mail xác thực tài khoản và biên lai đơn hàng chuyên nghiệp.
- 📱 **Mobile-First Responsive**: Giao diện tự động co giãn hoàn hảo trên Desktop, Tablet và Mobile.

---

## 🔒 11. Bảo mật & 🧪 12. Kiểm thử

<div align="center">
  <table>
    <tr>
      <th width="50%">🛡️ Phương pháp Bảo mật</th>
      <th width="50%">🧪 Quy trình Kiểm thử (Testing)</th>
    </tr>
    <tr>
      <td valign="top">
        <ul>
          <li><b>Token-based Auth</b>: JWT an toàn với thời gian sống ngắn, kèm Refresh Token.</li>
          <li><b>RBAC</b>: Cấm khách hàng truy cập API Admin.</li>
          <li><b>Password Hashing</b>: ASP.NET Identity mã hóa BCrypt tự động.</li>
          <li><b>Data Integrity</b>: Kiểm tra chữ ký <code>Signature Hash</code> nghiêm ngặt của VNPay để chống giả mạo thanh toán.</li>
          <li><b>Input Validation</b>: Validate dữ liệu đầu vào chặn SQL Injection / XSS.</li>
        </ul>
      </td>
      <td valign="top">
        <ul>
          <li><b>Authentication</b>: Test hết hạn token, test chặn truy cập trái phép.</li>
          <li><b>Payment</b>: Dùng thẻ test VNPay giả lập tình huống thanh toán thành công, hủy giao dịch, số dư không đủ.</li>
          <li><b>Order Workflow</b>: Test trừ/cộng tồn kho sản phẩm khi đặt/hủy đơn.</li>
          <li><b>UI/UX</b>: Cross-browser testing (Chrome, Safari) và Responsive breakpoint testing.</li>
        </ul>
      </td>
    </tr>
  </table>
</div>

---

## 🚧 13 & 14. Khó khăn & Bài học rút ra

### Khó khăn gặp phải
- **Xử lý luồng VNPay Callback**: Cần đảm bảo hệ thống nhận đúng URL Trả về (Return URL) cho user và URL IPN cho server để cập nhật DB một cách đồng bộ, tránh lỗi mất đơn hàng.
- **Tối ưu State Frontend**: Đồng bộ hóa dữ liệu Giỏ hàng (Cart) và Yêu thích (Wishlist) mượt mà giữa Server và LocalStorage.
- **Entity Framework Relationships**: Thiết lập đúng cấu trúc One-to-Many, Many-to-Many để tránh lỗi lặp vòng (Circular Reference) khi serialize JSON.

### Bài học rút ra
- 📐 **Kiến trúc Clean Architecture**: Sự tách biệt rõ ràng giữa các Layer giúp việc thêm tính năng mới và bảo trì cực kỳ dễ dàng.
- 💅 **Minimalism trong UI**: Một giao diện E-commerce cao cấp không nằm ở việc nhồi nhét màu sắc, mà nằm ở khoảng trắng (Whitespace), typography và sự nhất quán (Consistency).
- 🔗 **3rd-Party APIs**: Hiểu rõ tài liệu và quy trình bảo mật chữ ký khi làm việc với API thanh toán bên thứ ba.

---

## 🚀 15. Hướng phát triển tương lai

- [ ] Tích hợp thanh toán **MoMo**, **ZaloPay**.
- [ ] Xây dựng hệ thống gợi ý sản phẩm dựa trên lịch sử mua hàng (AI Recommendation).
- [ ] Tích hợp **Chatbot AI** hỗ trợ khách hàng tự động 24/7.
- [ ] Xuất hóa đơn **PDF (Invoice)** cho khách hàng.
- [ ] Push Notifications thời gian thực với **SignalR**.

---

## 📝 16. Git Workflow & 📈 17. Changelog

- **Branch Strategy**: Sử dụng luồng `main` (production), `develop` (staging) và các nhánh `feature/*`.
- **Commit Convention**: Áp dụng chuẩn Semantic Commit Messages (`feat:`, `fix:`, `refactor:`).
- **Changelog**:
  - `v1.0`: Dựng Base Clean Architecture, JWT Authentication.
  - `v1.5`: Hoàn thiện UI Frontend ReactJS, giỏ hàng, đặt hàng cơ bản.
  - `v2.0`: Tích hợp VNPay, SMTP Email, Admin Dashboard, và hoàn thiện UI Minimalist.

---

## 🤝 18. Contributing & 📄 19. License

- Mọi đóng góp cải thiện dự án đều được chào đón thông qua Pull Request. Xin vui lòng tuân thủ Coding Convention của .NET và React.
- **License**: Dự án được xây dựng với mục đích học tập và xây dựng Portfolio (*For educational purposes only*). Phân phối theo **MIT License**.

---

## 👨‍💻 20. Author & 🙏 21. Acknowledgements

<div align="center">
  <p>Được phát triển bởi <b>Long Phan</b></p>
  <a href="https://github.com/longphan200518"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>
  <a href="#"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  <a href="mailto:email-cua-ban@gmail.com"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>
  
  <br/><br/>
  <i>Chân thành cảm ơn các giảng viên hướng dẫn, nền tảng tài liệu VNPay, Tailwind CSS, và cộng đồng mã nguồn mở đã tạo cảm hứng cho dự án này.</i>
  <br/><br/>
  <b>⭐️ Nếu bạn thấy dự án hữu ích, hãy để lại một Star ủng hộ nhé! ⭐️</b>
</div>
