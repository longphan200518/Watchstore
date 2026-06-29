import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Wishlist from "./pages/Wishlist";
import OrderDetail from "./pages/OrderDetail";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import AnimatedPage from "./components/AnimatedPage";
import { CartProvider } from "./contexts/CartContext";
import { ToastProvider } from "./contexts/ToastContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { WebsiteSettingsProvider } from "./contexts/WebsiteSettingsContext";
import { CompareProvider } from "./contexts/CompareContext";

function AnimatedRoutes() {
 const location = useLocation();
 return (
 <AnimatePresence mode="wait">
 <Routes location={location} key={location.pathname}>
 <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
 <Route path="/products" element={<AnimatedPage><Products /></AnimatedPage>} />
 <Route path="/products/:id" element={<AnimatedPage><ProductDetail /></AnimatedPage>} />
 <Route path="/cart" element={<AnimatedPage><Cart /></AnimatedPage>} />
 <Route path="/checkout" element={<AnimatedPage><Checkout /></AnimatedPage>} />
 <Route
 path="/order-confirmation"
 element={<AnimatedPage><OrderConfirmation /></AnimatedPage>}
 />
 <Route path="/payment-success" element={<AnimatedPage><PaymentSuccess /></AnimatedPage>} />
 <Route path="/payment-failed" element={<AnimatedPage><PaymentFailed /></AnimatedPage>} />
 <Route path="/orders" element={<AnimatedPage><Orders /></AnimatedPage>} />
 <Route path="/orders/:id" element={<AnimatedPage><OrderDetail /></AnimatedPage>} />
 <Route path="/profile" element={<AnimatedPage><Profile /></AnimatedPage>} />
 <Route path="/wishlist" element={<AnimatedPage><Wishlist /></AnimatedPage>} />
 <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
 <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
 <Route path="/verify-email" element={<AnimatedPage><VerifyEmail /></AnimatedPage>} />
 <Route path="/forgot-password" element={<AnimatedPage><ForgotPassword /></AnimatedPage>} />
 <Route path="/reset-password" element={<AnimatedPage><ResetPassword /></AnimatedPage>} />
 <Route path="*" element={<AnimatedPage><NotFound /></AnimatedPage>} />
 </Routes>
 </AnimatePresence>
 );
}

export default function App() {
 return (
 <HelmetProvider>
 <WebsiteSettingsProvider>
 <CartProvider>
 <ToastProvider>
 <WishlistProvider>
 <CompareProvider>
 <Router>
 <ScrollToTop />
 <AnimatedRoutes />
 </Router>
 </CompareProvider>
 </WishlistProvider>
 </ToastProvider>
 </CartProvider>
 </WebsiteSettingsProvider>
 </HelmetProvider>
 );
}
