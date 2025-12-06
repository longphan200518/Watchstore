# Watchstore - Admin App

Frontend quản trị của dự án Watchstore được xây dựng với React + TailwindCSS.

## Cấu trúc dự án

```
src/
├── components/        # Các component tái sử dụng
├── pages/            # Các trang quản trị
├── services/         # API services
├── hooks/            # Custom hooks
├── contexts/         # React contexts
├── utils/            # Utility functions
├── helpers/          # Helper functions
├── constants/        # Constants
├── styles/           # CSS files
├── assets/           # Images, icons
└── App.jsx
```

## Cài đặt

### Prerequisites
- Node.js >= 16.0.0
- npm hoặc yarn

### Installation

```bash
# Cài đặt dependencies
npm install

# Hoặc với yarn
yarn install
```

## Sử dụng

### Development

```bash
npm run dev
```

Ứng dụng sẽ chạy trên `http://localhost:3001`

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Công nghệ sử dụng

- **React 18** - JavaScript library
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **TailwindCSS** - CSS framework
- **Zustand** - State management
- **Recharts** - Charts
- **Lucide React** - Icons
- **Vite** - Build tool

## Environment Variables

Tạo file `.env.local`:

```
VITE_API_URL=http://localhost:5000/api
```

## Cấu trúc folder chi tiết

### components/
Chứa các component tái sử dụng như Sidebar, Header, Button, Modal, Table, v.v.

### pages/
Chứa các trang quản trị: Dashboard, Products, Orders, Users, Settings, v.v.

### services/
Chứa các API services để gọi backend API.

### hooks/
Chứa các custom React hooks.

### contexts/
Chứa các React contexts để quản lý state toàn bộ ứng dụng.

### utils/
Chứa các utility functions.

### helpers/
Chứa các helper functions như formatters, validators, v.v.

### constants/
Chứa các hằng số của ứng dụng.

### assets/
Chứa các file tĩnh như hình ảnh, icons.

## License

MIT
