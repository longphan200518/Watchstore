import { Icon } from "@iconify/react";
import { useState } from "react";

export default function AdminHeader({ title, subtitle }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: "Đơn hàng mới #1234", time: "2 phút trước", unread: true },
    {
      id: 2,
      text: "Sản phẩm sắp hết hàng",
      time: "15 phút trước",
      unread: true,
    },
    {
      id: 3,
      text: "Đánh giá mới từ khách hàng",
      time: "1 giờ trước",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6 mb-8">
      <div className="flex items-center justify-between">
        {/* Title Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Icon
                icon="solar:home-angle-bold-duotone"
                className="text-base"
              />
              {subtitle}
            </p>
          )}
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Icon
              icon="solar:magnifer-bold-duotone"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
            />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-2.5 w-64 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Icon icon="solar:bell-bold-duotone" className="text-2xl" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                <div className="px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Icon icon="solar:bell-bold" />
                    Thông báo
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        notif.unread ? "bg-amber-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {notif.unread && (
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">{notif.text}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 bg-gray-50 text-center">
                  <button className="text-sm text-amber-600 font-medium hover:text-amber-700">
                    Xem tất cả thông báo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <Icon icon="solar:settings-bold-duotone" className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
