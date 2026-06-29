import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";

export default function NotificationDrawer({ isOpen, onClose, language }) {
 const [notifications, setNotifications] = useState([]);
 const [unreadCount, setUnreadCount] = useState(0);
 const [loading, setLoading] = useState(false);
 const { addToast } = useToast();

 useEffect(() => {
 if (isOpen) {
 fetchNotifications();
 }
 }, [isOpen]);

 const fetchNotifications = async () => {
 try {
 setLoading(true);
 const token = localStorage.getItem("token") || sessionStorage.getItem("token");
 if (!token) return;

 const response = await fetch("http://localhost:5221/api/notifications?pageSize=20", {
 headers: {
 Authorization: `Bearer ${token}`
 }
 });
 const result = await response.json();
 if (result.success) {
 setNotifications(result.data.items);
 setUnreadCount(result.data.items.filter(n => !n.isRead).length);
 }
 } catch (err) {
 console.error("Error fetching notifications", err);
 } finally {
 setLoading(false);
 }
 };

 const markAsRead = async (id) => {
 try {
 const token = localStorage.getItem("token") || sessionStorage.getItem("token");
 const response = await fetch(`http://localhost:5221/api/notifications/${id}/read`, {
 method: "PUT",
 headers: {
 Authorization: `Bearer ${token}`
 }
 });
 const result = await response.json();
 if (result.success) {
 setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
 setUnreadCount(Math.max(0, unreadCount - 1));
 }
 } catch (err) {
 console.error("Error marking notification as read", err);
 }
 };

 const markAllAsRead = async () => {
 try {
 const token = localStorage.getItem("token") || sessionStorage.getItem("token");
 const response = await fetch(`http://localhost:5221/api/notifications/read-all`, {
 method: "PUT",
 headers: {
 Authorization: `Bearer ${token}`
 }
 });
 const result = await response.json();
 if (result.success) {
 setNotifications(notifications.map(n => ({ ...n, isRead: true })));
 setUnreadCount(0);
 }
 } catch (err) {
 console.error("Error marking all notifications as read", err);
 }
 };

 const formatTime = (dateString) => {
 const date = new Date(dateString);
 const now = new Date();
 const diff = now - date;
 const minutes = Math.floor(diff / 60000);
 const hours = Math.floor(minutes / 60);
 const days = Math.floor(hours / 24);

 if (days > 0) return `${days} ${language === "vi" ? "ngày trước" : "days ago"}`;
 if (hours > 0) return `${hours} ${language === "vi" ? "giờ trước" : "hours ago"}`;
 if (minutes > 0) return `${minutes} ${language === "vi" ? "phút trước" : "mins ago"}`;
 return language === "vi" ? "Vừa xong" : "Just now";
 };

 const getIconForType = (type) => {
 switch (type?.toLowerCase()) {
 case "order": return "mdi:package-variant";
 case "system": return "mdi:information";
 case "promotion": return "mdi:tag";
 default: return "mdi:bell";
 }
 };

 const drawerContent = (
 <AnimatePresence>
 {isOpen && (
 <>
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.3 }}
 className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
 onClick={onClose}
 />

 <motion.div
 initial={{ x: "100%" }}
 animate={{ x: 0 }}
 exit={{ x: "100%" }}
 transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
 className={`fixed top-0 right-0 h-full w-full max-w-md shadow-2xl z-[70] flex flex-col bg-white`}
 >
 <div className={`flex items-center justify-between p-6 border-b border-gray-100`}>
 <div className="flex items-center gap-3">
 <h2 className={`font-serif text-2xl text-gray-900`}>
 {language === "vi" ? "Thông báo" : "Notifications"}
 </h2>
 {unreadCount > 0 && (
 <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
 {unreadCount}
 </span>
 )}
 </div>
 <div className="flex items-center gap-4">
 {unreadCount > 0 && (
 <button
 onClick={markAllAsRead}
 className="text-xs text-gray-500 hover:text-black transition-colors"
 >
 {language === "vi" ? "Đọc tất cả" : "Mark all as read"}
 </button>
 )}
 <button
 onClick={onClose}
 className={`p-2 hover:bg-gray-100 rounded-full transition-colors text-black`}
 >
 <Icon icon="mdi:close" className="w-6 h-6" />
 </button>
 </div>
 </div>

 <div className="flex-1 overflow-y-auto p-0">
 {loading ? (
 <div className="flex justify-center p-8">
 <Icon icon="eos-icons:loading" className={`w-8 h-8 text-black`} />
 </div>
 ) : notifications.length === 0 ? (
 <div className={`h-full flex flex-col items-center justify-center space-y-4 p-8 text-center`}>
 <Icon icon="mdi:bell-off-outline" className={`w-16 h-16 text-gray-400`} />
 <p className={`font-light text-gray-500`}>
 {language === "vi" ? "Bạn không có thông báo nào" : "You have no notifications"}
 </p>
 </div>
 ) : (
 <div className="divide-y divide-gray-100 ">
 {notifications.map((notification) => (
 <div
 key={notification.id}
 onClick={() => {
 if (!notification.isRead) markAsRead(notification.id);
 if (notification.referenceUrl) {
 window.location.href = notification.referenceUrl;
 }
 }}
 className={`p-4 flex gap-4 cursor-pointer transition-colors ${
 !notification.isRead ? "bg-blue-50/50" : "hover:bg-gray-50"
 }`}
 >
 <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-black`}>
 <Icon icon={getIconForType(notification.type)} className="w-5 h-5" />
 </div>
 <div className="flex-1">
 <h4 className={`text-sm font-semibold mb-1 text-gray-900`}>
 {notification.title}
 </h4>
 <p className={`text-sm mb-2 line-clamp-2 text-gray-600`}>
 {notification.message}
 </p>
 <span className={`text-xs text-gray-400`}>
 {formatTime(notification.createdAt)}
 </span>
 </div>
 {!notification.isRead && (
 <div className="flex-shrink-0 mt-2">
 <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
 </div>
 )}
 </div>
 ))}
 </div>
 )}
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 );

 return createPortal(drawerContent, document.body);
}
