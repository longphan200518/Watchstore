#  WatchStore - Project Structure

##  Cấu trúc Folder

\\\
Watchstore/
 backend/                    # Backend API (.NET)
    Dockerfile
    src/
        WatchStore/
            WatchStore.API/
            WatchStore.Application/
            WatchStore.Domain/
            WatchStore.Infrastructure/
            WatchStore.Common/

 frontend/                   # Frontend Applications
    admin/                  # Admin Dashboard
       WatchStore.Admin.sln    # Visual Studio Solution cho Admin
       package.json
       vite.config.js
       src/
   
    user/                   # User Website
        WatchStore.User.sln     # Visual Studio Solution cho User
        package.json
        vite.config.js
        src/

 scripts/                    # Startup Scripts
    start-api.bat          # Chạy Backend API
    start-admin.bat        # Chạy Admin App
    start-user.bat         # Chạy User App
    start-all-frontend.ps1 # Chạy tất cả Frontend

 docs/                       # Documentation
    QUICK_RUN.md
    VISUAL_STUDIO_GUIDE.md
    OPTIMIZATION_SUMMARY.md

 .vscode/                    # VS Code Config
    tasks.json
    launch.json
    settings.json

 docker-compose.yml          # Docker Setup
\\\

---

##  Quick Start

###  Develop Admin Dashboard:
\\\
1. Double-click: frontend/admin/WatchStore.Admin.sln
2. Visual Studio mở  Press F5 (Backend chạy)
3. Terminal: cd frontend/admin; npm run dev
\\\

###  Develop User Website:
\\\
1. Double-click: frontend/user/WatchStore.User.sln
2. Visual Studio mở  Press F5 (Backend chạy)
3. Terminal: cd frontend/user; npm run dev
\\\

###  Chạy nhanh bằng Scripts:
\\\
Double-click: scripts/start-admin.bat
Double-click: scripts/start-user.bat
\\\

---

##  Documentation

Xem thêm trong folder **docs/**:
- **QUICK_RUN.md** - Hướng dẫn chạy nhanh
- **VISUAL_STUDIO_GUIDE.md** - Hướng dẫn Visual Studio
- **OPTIMIZATION_SUMMARY.md** - Tóm tắt tối ưu hóa

---

##  URLs

| App | URL | Port |
|-----|-----|------|
| Backend API | http://localhost:5221 | 5221 |
| Admin Dashboard | http://localhost:3001 | 3001 |
| User Website | http://localhost:3000 | 3000 |

---

**Happy Coding! **
