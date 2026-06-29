import { createContext, useContext, useState, useEffect, useCallback } from "react";

const WishlistContext = createContext();

const API_BASE = "http://localhost:5221";

export const WishlistProvider = ({ children }) => {
 const [wishlist, setWishlist] = useState([]);
 const [loading, setLoading] = useState(false);

 const getToken = () =>
 localStorage.getItem("token") || sessionStorage.getItem("token");

 // Fetch wishlist from API if logged in, else clear
 const fetchWishlist = useCallback(async () => {
 const token = getToken();
 if (!token) {
 setWishlist([]);
 return;
 }
 try {
 setLoading(true);
 const res = await fetch(`${API_BASE}/api/wishlists`, {
 headers: { Authorization: `Bearer ${token}` },
 });
 const json = await res.json();
 if (json.success) setWishlist(json.data || []);
 } catch {
 // silently fail — keep local state
 } finally {
 setLoading(false);
 }
 }, []);

 // Load on mount
 useEffect(() => {
 fetchWishlist();
 }, [fetchWishlist]);

 const addToWishlist = async (product) => {
 const token = getToken();
 if (!token) {
 return {
 success: false,
 message: "Vui lòng đăng nhập để thêm vào danh sách yêu thích",
 };
 }

 // Optimistic update
 const isAlready = wishlist.some((item) => item.watchId === product.id);
 if (isAlready) {
 return {
 success: false,
 message: "Sản phẩm đã có trong danh sách yêu thích",
 };
 }

 try {
 const res = await fetch(`${API_BASE}/api/wishlists/${product.id}`, {
 method: "POST",
 headers: { Authorization: `Bearer ${token}` },
 });
 const json = await res.json();
 if (json.success) {
 // Re-fetch to get full product info
 await fetchWishlist();
 return { success: true, message: "Đã thêm vào danh sách yêu thích" };
 }
 return { success: false, message: json.message || "Thất bại" };
 } catch {
 return { success: false, message: "Lỗi kết nối" };
 }
 };

 const removeFromWishlist = async (productId) => {
 const token = getToken();
 if (!token) return { success: false, message: "Chưa đăng nhập" };

 // Optimistic update
 setWishlist((prev) => prev.filter((item) => item.watchId !== productId));

 try {
 const res = await fetch(`${API_BASE}/api/wishlists/${productId}`, {
 method: "DELETE",
 headers: { Authorization: `Bearer ${token}` },
 });
 const json = await res.json();
 if (!json.success) {
 // Revert on failure
 await fetchWishlist();
 return { success: false, message: json.message };
 }
 return { success: true, message: "Đã xóa khỏi danh sách yêu thích" };
 } catch {
 await fetchWishlist();
 return { success: false, message: "Lỗi kết nối" };
 }
 };

 const clearWishlist = async () => {
 const token = getToken();
 if (!token) return;

 setWishlist([]);
 try {
 await fetch(`${API_BASE}/api/wishlists/clear`, {
 method: "DELETE",
 headers: { Authorization: `Bearer ${token}` },
 });
 } catch {
 await fetchWishlist();
 }
 };

 const isInWishlist = (productId) =>
 wishlist.some((item) => item.watchId === productId);

 const getTotalWishlist = () => wishlist.length;

 return (
 <WishlistContext.Provider
 value={{
 wishlist,
 loading,
 addToWishlist,
 removeFromWishlist,
 isInWishlist,
 getTotalWishlist,
 clearWishlist,
 fetchWishlist,
 }}
 >
 {children}
 </WishlistContext.Provider>
 );
};

export const useWishlist = () => {
 const context = useContext(WishlistContext);
 if (!context) {
 throw new Error("useWishlist must be used within WishlistProvider");
 }
 return context;
};
