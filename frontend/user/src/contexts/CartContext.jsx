import { createContext, useContext, useState, useEffect, useCallback } from "react";
import cartService from "../services/cartService";
import { getSessionId, clearSessionId } from "../utils/sessionId";

const CartContext = createContext();

export function CartProvider({ children }) {
 const [cart, setCart] = useState(null); // CartDto từ server
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

 // ── Helper kiểm tra đã đăng nhập ────────────────────────────────
 const isLoggedIn = () =>
 !!(localStorage.getItem("token") || sessionStorage.getItem("token"));

 // ── Tải giỏ hàng từ server ───────────────────────────────────────
 const fetchCart = useCallback(async () => {
 if (!isLoggedIn()) {
 // Allow guest cart using sessionId
 }
 setLoading(true);
 setError(null);
 try {
 const res = await cartService.getCart();
 setCart(res.data?.data ?? null);
 } catch (err) {
 console.error("[Cart] Lỗi tải giỏ hàng:", err);
 setError("Không thể tải giỏ hàng");
 } finally {
 setLoading(false);
 }
 }, []);

 // ── Khởi tạo: tải giỏ hàng khi mount ────────────────────────────
 useEffect(() => {
 // Luôn luôn cấp sessionId cho guest hoặc user
 getSessionId();
 fetchCart();
 }, [fetchCart]);

 // ── Thêm sản phẩm vào giỏ ───────────────────────────────────────
 // Tự động tăng số lượng nếu sản phẩm đã có trong giỏ
 const addToCart = async (watchId, quantity = 1) => {
 try {
 const res = await cartService.addToCart(watchId, quantity);
 if (res.data?.success) {
 setCart(res.data.data);
 return { success: true, message: res.data.message };
 }
 return { success: false, message: res.data?.message || "Không thể thêm sản phẩm" };
 } catch (err) {
 const msg = err.response?.data?.message || "Lỗi khi thêm vào giỏ hàng";
 return { success: false, message: msg };
 }
 };

 // ── Cập nhật số lượng ───────────────────────────────────────────
 const updateQuantity = async (cartItemId, quantity) => {
 if (quantity <= 0) {
 return removeFromCart(cartItemId);
 }
 try {
 const res = await cartService.updateQuantity(cartItemId, quantity);
 if (res.data?.success) setCart(res.data.data);
 return res.data?.success ?? false;
 } catch (err) {
 console.error("[Cart] Lỗi cập nhật số lượng:", err);
 return false;
 }
 };

 // ── Xóa một item ─────────────────────────────────────────────────
 const removeFromCart = async (cartItemId) => {
 try {
 const res = await cartService.removeItem(cartItemId);
 if (res.data?.success) {
 await fetchCart(); // Reload để đồng bộ
 }
 return res.data?.success ?? false;
 } catch (err) {
 console.error("[Cart] Lỗi xóa sản phẩm:", err);
 return false;
 }
 };

 // ── Xóa toàn bộ giỏ hàng ────────────────────────────────────────
 const clearCart = async () => {
 try {
 const res = await cartService.clearCart();
 if (res.data?.success) {
 setCart(prev => prev ? { ...prev, items: [] } : null);
 }
 return res.data?.success ?? false;
 } catch (err) {
 console.error("[Cart] Lỗi xóa giỏ hàng:", err);
 return false;
 }
 };

 // ── Merge giỏ hàng Session → User (gọi SAU KHI đăng nhập) ──────
 const mergeCartAfterLogin = async () => {
 const sessionId = getSessionId();
 try {
 const res = await cartService.mergeCart(sessionId);
 if (res.data?.success) {
 clearSessionId(); // Xóa sessionId cũ, từ đây dùng userId
 setCart(res.data.data);
 }
 } catch (err) {
 // Không throw để không block luồng đăng nhập
 console.warn("[Cart] Lỗi merge giỏ hàng:", err);
 // Vẫn tải lại giỏ hàng
 await fetchCart();
 }
 };

 // ── Tính tổng tiền ────────────────────────────────────────────────
 // TotalPrice = SUM(unitPrice × quantity) cho tất cả items
 const getTotalPrice = () => {
 if (!cart?.items?.length) return 0;
 return cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
 };

 // ── Tổng số lượng sản phẩm ───────────────────────────────────────
 const getTotalItems = () => {
 if (!cart?.items?.length) return 0;
 return cart.items.reduce((sum, item) => sum + item.quantity, 0);
 };

 // ── Danh sách items (tương thích với code cũ dùng cart trực tiếp) ─
 const cartItems = cart?.items ?? [];

 return (
 <CartContext.Provider
 value={{
 // State
 cart,
 cartItems, // Alias cho cart.items
 loading,
 error,

 // Actions
 addToCart,
 removeFromCart,
 updateQuantity,
 clearCart,
 fetchCart,
 mergeCartAfterLogin,

 // Computed
 getTotalPrice,
 getTotalItems,
 }}
 >
 {children}
 </CartContext.Provider>
 );
}

export function useCart() {
 const context = useContext(CartContext);
 if (!context) {
 throw new Error("useCart must be used within CartProvider");
 }
 return context;
}
