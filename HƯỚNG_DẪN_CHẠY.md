# Hướng Dẫn Chạy WatchStore

## 1. Chạy Backend (Visual Studio)

1. Mở **Visual Studio 2022**
2. File → Open → Project/Solution
3. Chọn: `C:\Users\Plonggg\Desktop\Watchstore\backend\WatchStore.sln`
4. Nhấn **F5** để chạy
5. Backend sẽ chạy tại: **http://localhost:5221**

## 2. Chạy Frontend User (Visual Studio)

### Cách 1: Chạy trong Visual Studio (Khuyên dùng)

1. Mở **Visual Studio 2022**
2. File → Open → Project/Solution
3. Chọn: `C:\Users\Plonggg\Desktop\Watchstore\frontend\user\WatchStore.User.sln`
4. Nhấn **F5** để chạy
5. Frontend User sẽ chạy tại: **http://localhost:3000**

### Cách 2: Chạy bằng Terminal (Nếu cần)

```powershell
cd C:\Users\Plonggg\Desktop\Watchstore\frontend\user
npm run dev
```

## 3. Chạy Frontend Admin (Visual Studio)

### Cách 1: Chạy trong Visual Studio (Khuyên dùng)

1. Mở **Visual Studio 2022** (instance mới)
2. File → Open → Project/Solution
3. Chọn: `C:\Users\Plonggg\Desktop\Watchstore\frontend\admin\WatchStore.Admin.sln`
4. Nhấn **F5** để chạy
5. Frontend Admin sẽ chạy tại: **http://localhost:3001**

### Cách 2: Chạy bằng Terminal (Nếu cần)

```powershell
cd C:\Users\Plonggg\Desktop\Watchstore\frontend\admin
npm run dev
```

---

## Tóm Tắt - Chạy Tất Cả Trong Visual Studio

**🎯 Mở 3 instances của Visual Studio:**

1. **Backend**: `backend\WatchStore.sln` → F5 → **http://localhost:5221**
2. **Frontend User**: `frontend\user\WatchStore.User.sln` → F5 → **http://localhost:3000**
3. **Frontend Admin**: `frontend\admin\WatchStore.Admin.sln` → F5 → **http://localhost:3001**

**✨ Lợi ích:**

- Chạy tất cả trong Visual Studio (không cần terminal riêng)
- Có thể debug cả backend và frontend
- Auto restart khi code thay đổi

**📝 Code Frontend:**

- Dùng **Visual Studio Code** (VSCode) để code React (khuyên dùng)
- Hoặc dùng bất kỳ editor nào (Sublime, Notepad++...)
- Visual Studio 2022 dùng để **chạy** (F5), không phải để code React

---

## Database Seed Data

Nếu chưa có sản phẩm, chạy SQL script:

1. Mở SQL Server Management Studio
2. Connect: `(localdb)\mssqllocaldb`
3. Database: `WatchStoreDB`
4. Mở và chạy file: `seed-data.sql`

Hoặc dùng script:

```powershell
cd C:\Users\Plonggg\Desktop\Watchstore
.\start-dev.ps1
```
