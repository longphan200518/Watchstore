import { Icon } from "@iconify/react";
import { useState } from "react";

export default function AdminHeader({ title, subtitle }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: "Đơn hàng mới #1234", time: "2 phút trước", unread: true },
    { id: 2, text: "Sản phẩm sắp hết hàng", time: "15 phút trước", unread: true },
    { id: 3, text: "Đánh giá mới từ khách hàng", time: "1 giờ trước", unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="bg-[#F8F8F8] px-8 py-8">
      <div className="flex items-center justify-between">
        {/* Title Section */}
        <div>
          <h1 className="text-4xl font-serif text-[#111111] mb-2">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 font-light flex items-center gap-2">
              <Icon icon="solar:home-angle-outline" className="text-base" />
              {subtitle}
            </p>
          )}
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-6">
          {/* Search */}
          <div className="relative hidden md:block">
            <Icon
              icon="solar:magnifer-outline"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
            />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-12 pr-4 py-3 w-72 border border-[#EAEAEA] rounded bg-white focus:outline-none focus:border-[#111111] text-sm font-light transition-colors"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-[#111111] hover:bg-[#EAEAEA] rounded transition-colors"
            >
              <Icon icon="solar:bell-outline" className="text-2xl" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-4 w-80 bg-white shadow-2xl border border-[#EAEAEA] z-50">
                <div className="px-6 py-4 border-b border-[#EAEAEA]">
                  <h3 className="font-serif text-lg text-[#111111]">Thông báo</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-6 py-4 border-b border-[#EAEAEA] hover:bg-[#F8F8F8] cursor-pointer transition-colors ${
                        notif.unread ? "bg-[#F8F8F8]" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {notif.unread && (
                          <div className="w-1.5 h-1.5 bg-[#111111] rounded-full mt-2" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm text-[#111111] font-medium">{notif.text}</p>
                          <p className="text-xs text-gray-500 mt-1 font-light">
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 bg-white text-center">
                  <button className="text-sm text-[#111111] hover:underline font-light">
                    Xem tất cả
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button className="p-2 text-[#111111] hover:bg-[#EAEAEA] rounded transition-colors">
            <Icon icon="solar:settings-outline" className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
