# ⚠️ Node.js Chưa Cài Đặt!

## 📥 Cài Đặt Node.js

### Cách 1: Tải từ trang chính thức (Khuyên dùng)

1. Mở browser: https://nodejs.org/
2. Download **LTS version** (phiên bản ổn định)
3. Chạy file .msi vừa tải
4. Next → Next → Install
5. ✅ Restart máy tính (hoặc ít nhất restart Visual Studio)

### Cách 2: Dùng PowerShell (nhanh hơn)

```powershell
# Cài Chocolatey (package manager)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Cài Node.js
choco install nodejs-lts -y
```

---

## ✅ Kiểm Tra Sau Khi Cài

Mở PowerShell mới và chạy:

```powershell
node --version
npm --version
```

Nếu thấy số phiên bản → Cài thành công! ✅

---

## 🚀 Sau Khi Cài Node.js

### Cách 1: Dùng Visual Studio (F5)

```
1. Restart Visual Studio
2. Mở: frontend\admin\WatchStore.Admin.sln
3. Press F5
4. Browser tự mở: http://localhost:3001
```

### Cách 2: Dùng Scripts (Không cần VS)

```
Double-click: scripts\start-admin.bat
Double-click: scripts\start-user.bat
```

---

## ❓ Tại Sao Cần Node.js?

- Frontend dùng **React** (JavaScript framework)
- React cần **Node.js** để chạy dev server
- **npm** (Node Package Manager) để cài các thư viện

**Backend (.NET)** không cần Node.js, chỉ **Frontend** cần!

---

## 📋 Checklist

- [ ] Cài Node.js LTS
- [ ] Restart Visual Studio (hoặc restart máy)
- [ ] Chạy: `node --version` → Thấy số phiên bản
- [ ] Chạy: `npm --version` → Thấy số phiên bản
- [ ] F5 trong Admin/User solution → Web mở

---

**Sau khi cài Node.js, mọi thứ sẽ hoạt động! 🎉**
