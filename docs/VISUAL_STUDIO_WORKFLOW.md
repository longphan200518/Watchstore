# 🎯 Cách Chạy Từng Solution trong Visual Studio

## 📁 3 Solution Files Riêng Biệt

```
Watchstore/
├── backend/
│   └── WatchStore.Backend.sln       ✅ F5 → Swagger mở (Backend API)
├── frontend/
│   ├── admin/
│   │   └── WatchStore.Admin.sln     ⚠️ Chỉ xem files (React không F5 được)
│   └── user/
│       └── WatchStore.User.sln      ⚠️ Chỉ xem files (React không F5 được)
```

---

## 🚀 Workflow Chạy Từng Phần

### 1️⃣ Chạy Backend (Swagger API)

```
1. Mở Visual Studio
2. File → Open → Project/Solution
3. Chọn: backend\WatchStore.Backend.sln
4. Press F5 hoặc Ctrl+F5
5. ✅ Swagger mở: http://localhost:5221/swagger
```

### 2️⃣ Chạy Admin Frontend

**Visual Studio KHÔNG thể F5 chạy React!** Dùng 1 trong 3 cách:

#### Cách A: Script (Dễ nhất)

```
Double-click: scripts\start-admin.bat
→ Tự động npm install + chạy dev server
→ Browser mở: http://localhost:3001
```

#### Cách B: Visual Studio Terminal

```
1. Mở: frontend\admin\WatchStore.Admin.sln (xem files)
2. View → Terminal
3. Chạy: npm install
4. Chạy: npm run dev
5. Mở browser: http://localhost:3001
```

#### Cách C: VS Code (Khuyên dùng cho frontend)

```
1. Mở VS Code
2. File → Open Folder → frontend\admin
3. Terminal: npm install
4. Terminal: npm run dev
```

### 3️⃣ Chạy User Frontend

Tương tự Admin, dùng 1 trong 3 cách:

#### Cách A: Script

```
Double-click: scripts\start-user.bat
```

#### Cách B: Visual Studio Terminal

```
1. Mở: frontend\user\WatchStore.User.sln
2. View → Terminal
3. npm install
4. npm run dev
```

#### Cách C: VS Code

```
Open Folder → frontend\user → npm run dev
```

---

## 🎬 Quy Trình Hoàn Chỉnh

### Kịch bản 1: Full Stack Development

```
Bước 1: Chạy Backend
- Mở: backend\WatchStore.Backend.sln
- Press F5 → Swagger mở

Bước 2: Chạy Admin
- Double-click: scripts\start-admin.bat
- Browser tự mở: http://localhost:3001

Bước 3: Chạy User
- Double-click: scripts\start-user.bat
- Browser tự mở: http://localhost:3000
```

### Kịch bản 2: Chỉ Backend

```
- Mở: backend\WatchStore.Backend.sln
- Press F5
- Test API trong Swagger
```

### Kịch bản 3: Chỉ Frontend (cần Backend chạy trước)

```
- Chạy backend: scripts\start-api.bat (hoặc F5 trong VS)
- Chạy admin: scripts\start-admin.bat
- Hoặc user: scripts\start-user.bat
```

---

## ⚙️ Setup Visual Studio External Tools (Tùy chọn)

Để chạy frontend từ Visual Studio như CNPMNcao:

### 1. Mở Visual Studio

### 2. Tools → External Tools...

### 3. Add Admin Tool:

```
Title: Start Admin Frontend
Command: C:\Windows\System32\cmd.exe
Arguments: /c "cd /d $(SolutionDir) && npm install && npm run dev"
Initial directory: $(SolutionDir)
✅ Use Output window
```

### 4. Add User Tool:

```
Title: Start User Frontend
Command: C:\Windows\System32\cmd.exe
Arguments: /c "cd /d $(SolutionDir) && npm install && npm run dev"
Initial directory: $(SolutionDir)
✅ Use Output window
```

### 5. Sử dụng:

```
Tools → Start Admin Frontend
Tools → Start User Frontend
```

---

## 📋 So Sánh với CNPMNcao

| Aspect             | CNPMNcao              | WatchStore                         |
| ------------------ | --------------------- | ---------------------------------- |
| **Backend**        | F5 trong VS → Swagger | ✅ F5 trong VS → Swagger           |
| **Frontend**       | F5 trong VS?          | ❌ React không F5 được             |
| **Frontend Run**   | npm start             | ✅ scripts/\*.bat hoặc npm run dev |
| **Solution Files** | 1 solution tổng       | ✅ 3 solutions riêng               |

---

## 🔑 Điểm Khác Biệt Quan Trọng

### CNPMNcao có thể dùng:

- ASP.NET MVC với Razor Views → F5 chạy được
- Hoặc .NET project wrapper cho npm

### WatchStore dùng:

- React (Vite) → Hoàn toàn JavaScript
- Visual Studio KHÔNG hỗ trợ F5 cho React
- Cần dùng npm/scripts để chạy

---

## ✅ Giải Pháp Tốt Nhất

### Backend:

```
backend\WatchStore.Backend.sln → F5 trong Visual Studio
```

### Frontend:

```
scripts\start-admin.bat  → Double-click
scripts\start-user.bat   → Double-click
```

Hoặc dùng **VS Code** cho frontend (IDE chuyên cho JavaScript/React).

---

## 🎯 Tóm Tắt

| Solution                              | Mở Trong      | Chạy Như Thế Nào            |
| ------------------------------------- | ------------- | --------------------------- |
| `backend\WatchStore.Backend.sln`      | Visual Studio | ✅ Press F5                 |
| `frontend\admin\WatchStore.Admin.sln` | Visual Studio | ❌ Không F5 được, xem files |
| `frontend\user\WatchStore.User.sln`   | Visual Studio | ❌ Không F5 được, xem files |

**Để chạy frontend:** Dùng scripts hoặc terminal: `npm run dev`

---

**Nếu bạn muốn giống y hệt CNPMNcao (F5 được cả frontend), cần chuyển sang ASP.NET MVC thay vì React! 🤔**
