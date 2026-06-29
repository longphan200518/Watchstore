import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import ToastContainer from "../components/ToastContainer";

const staggerContainer = {
 hidden: { opacity: 0 },
 show: {
 opacity: 1,
 transition: {
 staggerChildren: 0.2
 }
 }
};

const fadeUpVariant = {
 hidden: { opacity: 0, y: 40 },
 show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function Home() {
 const [featuredProducts, setFeaturedProducts] = useState([]);
 const [loading, setLoading] = useState(true);
 const [language, setLanguage] = useState("vi");

 useEffect(() => {
 const saved = localStorage.getItem("theme");
 const savedLang = localStorage.getItem("language") || "vi";
 setLanguage(savedLang);
 }, []);

 useEffect(() => {
 fetch(
 "http://localhost:5221/api/watches?pageNumber=1&pageSize=3&sortBy=latest"
 )
 .then((res) => res.json())
 .then((data) => {
 if (data.success) {
 setFeaturedProducts(data.data.items);
 }
 setLoading(false);
 })
 .catch((err) => {
 console.error("Error:", err);
 setLoading(false);
 });
 }, []);

 const formatPrice = (price) => {
 return new Intl.NumberFormat("vi-VN", {
 style: "currency",
 currency: "VND",
 }).format(price);
 };

 return (
 <div
 className={`min-h-screen transition-colors duration-500 bg-[#F8F8F8] text-gray-900`}
 >
 <div className="fixed top-0 left-0 right-0 z-50">
 <Header />
 </div>
 <ToastContainer />

 {/* HERO SECTION */}
 <section className="relative h-screen flex items-center justify-center overflow-hidden">
 <div className="absolute inset-0 z-0">
 <motion.img
 initial={{ scale: 1 }}
 animate={{ scale: 1.1 }}
 transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
 src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=2400&q=95"
 alt="Luxury Timepiece"
 className="w-full h-full object-cover object-center"
 />
 <div
 className={`absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-gray-50`}
 ></div>
 </div>

 <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto"
 variants={staggerContainer}
 initial="hidden"
 animate="show"
 >
 <motion.div variants={fadeUpVariant} className="mb-8">
 <span className={`inline-block text-black font-medium text-xs tracking-[0.3em] uppercase font-semibold`}>
 {language === "vi" ? "Tinh Hoa Thụy Sỹ" : "Swiss Excellence"}
 </span>
 <div className="w-16 h-px bg-black mx-auto mt-4"></div>
 </motion.div>

 <motion.h1
 variants={fadeUpVariant}
 className={`font-serif text-5xl md:text-6xl lg:text-7xl mb-8 leading-tight text-gray-900`}
 >
 {language === "vi" ? "Nơi Thời Gian" : "Where Time Becomes"}
 <br />
 <span className={`text-black font-medium`}>
 {language === "vi" ? "Trở Thành Nghệ Thuật" : "Art"}
 </span>
 </motion.h1>

 <motion.p
 variants={fadeUpVariant}
 className={`text-lg md:text-xl mb-12 font-normal leading-relaxed max-w-2xl mx-auto text-black`}
 >
 {language === "vi"
 ? "Khám phá bộ sưu tập những chiếc đồng hồ cao cấp nhất thế giới"
 : "Discover the world's finest luxury timepiece collection"}
 </motion.p>

 <motion.div variants={fadeUpVariant}>
 <Link
 to="/products"
 className="group inline-flex items-center gap-4 px-10 py-4 bg-black hover:bg-neutral-900 text-white transition-all duration-500 text-sm tracking-[0.2em] uppercase font-semibold shadow-lg hover:shadow-xl"
 >
 <span>
 {language === "vi"
 ? "Khám Phá Bộ Sưu Tập"
 : "Explore Collection"}
 </span>
 <Icon icon="solar:arrow-right-line-duotone" className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
 </Link>
 </motion.div>
 </motion.div>

 {/* Scroll Indicator */}
 <motion.div initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 2, duration: 1 }}
 className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10"
 >
 <div className="flex flex-col items-center gap-3 animate-bounce">
 <span className={`text-black font-medium/50 text-[10px] tracking-[0.3em] uppercase font-light`}>
 Scroll
 </span>
 <div className="w-[1px] h-16 bg-gradient-to-b from-black via-black/50 /50 to-transparent"></div>
 </div>
 </motion.div>
 </section>

 {/* FEATURED PRODUCTS */}
 <section
 className={`py-32 px-6 lg:px-16 transition-colors duration-500 bg-white`}
 >
 <div className="max-w-[1600px] mx-auto">
 <div className="text-center mb-24">
 <span className={`inline-block text-black font-medium text-xs tracking-[0.3em] uppercase mb-6 font-semibold`}>
 {language === "vi" ? "Sản Phẩm Nổi Bật" : "Featured Products"}
 </span>
 <h2
 className={`font-serif text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight font-normal text-gray-900`}
 >
 {language === "vi" ? "Kiệt Tác Của" : "Masterpiece of"}
 <br />
 <span className={`text-black font-medium`}>
 {language === "vi" ? "Nghệ Thuật Chế Tác" : "Horological Art"}
 </span>
 </h2>
 <div className="w-24 h-1 bg-black mx-auto mb-6"></div>
 <p
 className={`text-lg font-normal max-w-2xl mx-auto text-black`}
 >
 {language === "vi"
 ? "Mỗi chiếc đồng hồ đại diện cho hàng thập kỷ nghệ thuật và sáng tạo"
 : "Each timepiece represents decades of art and innovation"}
 </p>
 </div>

 {loading ? (
 <div className="flex justify-center py-24">
 <div className="w-12 h-12 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
 </div>
 ) : (
 <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-12"
 variants={staggerContainer}
 initial="hidden"
 whileInView="show"
 viewport={{ once: true, margin: "-100px" }}
 >
 {featuredProducts.map((product, index) => {
 const primaryImage =
 product.images?.find((img) => img.isPrimary) ||
 product.images?.[0];
 const isMiddle = index === 1;

 return (
 <motion.div variants={fadeUpVariant} key={product.id} className={isMiddle ? "md:mt-16" : ""}>
 <Link
 to={`/products/${product.id}`}
 className="group block"
 >
 <div
 className={`relative aspect-[3/4] overflow-hidden mb-6 bg-gray-100`}
 >
 <img
 src={
 primaryImage?.imageUrl ||
 "https://placehold.co/600x800/f5f5f5/a3a3a3?text=No+Image"
 }
 alt={product.name}
 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
 />

 <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

 {product.stockQuantity <= 3 &&
 product.stockQuantity > 0 && (
 <div className="absolute top-4 left-4">
 <div className="bg-black text-white px-4 py-2 text-xs tracking-wider uppercase font-semibold shadow-lg">
 Số Lượng Có Hạn
 </div>
 </div>
 )}

 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
 <span className="bg-white text-gray-900 px-6 py-3 text-sm tracking-wider uppercase font-semibold shadow-xl">
 Xem Chi Tiết
 </span>
 </div>
 </div>

 <div className="space-y-4 text-center">
 <p
 className={`text-xs tracking-widest uppercase font-semibold text-black`}
 >
 {product.brandName}
 </p>

 <h3
 className={`font-serif text-2xl leading-tight group-hover:text-black font-medium transition-colors duration-300 text-gray-900`}
 >
 {product.name}
 </h3>

 <div className="flex items-center justify-center pt-2">
 <span
 className={`text-lg font-semibold text-black`}
 >
 {formatPrice(product.price)}
 </span>
 </div>
 </div>
 </Link>
 </motion.div>
 );
 })}
 </motion.div>
 )}

 {/* View All Link */}
 <div className="text-center mt-32">
 <Link
 to="/products"
 className="inline-flex items-center gap-4 px-10 py-5 border border-gray-200 text-gray-200 hover:border-black hover:text-black transition-all duration-500 text-xs tracking-[0.3em] uppercase font-light"
 >
 <span>
 {language === "vi"
 ? "Xem Tất Cả Đồng Hồ"
 : "View All Timepieces"}
 </span>
 <svg
 className="w-5 h-5"
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={1.5}
 d="M17 8l4 4m0 0l-4 4m4-4H3"
 />
 </svg>
 </Link>
 </div>
 </div>
 </section>

 {/* CRAFTSMANSHIP SECTION */}
 <section className="relative py-32 overflow-hidden">
 <div className="absolute inset-0 z-0">
 <img
 src="https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=2000&q=95"
 alt="Watchmaking"
 className="w-full h-full object-cover"
 />
 <div
 className={`absolute inset-0 bg-white/80`}
 ></div>
 </div>

 <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
 <span className={`inline-block text-black font-medium text-xs tracking-[0.3em] uppercase mb-6 font-semibold`}>
 {language === "vi" ? "Di Sản & Đổi Mới" : "Heritage & Innovation"}
 </span>
 <h2
 className={`font-serif text-4xl md:text-5xl mb-8 leading-tight text-gray-900`}
 >
 {language === "vi" ? "Nghệ Thuật Của" : "The Art of"}
 <br />
 <span className={`text-black font-medium`}>
 {language === "vi" ? "Sự Chính Xác" : "Precision"}
 </span>
 </h2>
 <div className="w-20 h-1 bg-black mx-auto mb-8"></div>
 <p
 className={`text-lg leading-relaxed font-normal mb-12 max-w-2xl mx-auto text-black`}
 >
 {language === "vi"
 ? "Mỗi chiếc đồng hồ trong bộ sưu tập của chúng tôi thể hiện truyền thống chế tác đồng hồ hàng thế kỷ, kết hợp với sự đổi mới tiên tiến. Trải nghiệm sự kết hợp hoàn hảo giữa nghệ thuật và kỹ thuật."
 : "Each timepiece in our collection embodies centuries of watchmaking tradition, combined with cutting-edge innovation. Experience the perfect fusion of artistry and engineering."}
 </p>
 <Link
 to="/about"
 className="inline-block px-10 py-4 bg-black text-white hover:bg-neutral-800 transition-all duration-500 text-sm tracking-[0.2em] uppercase font-semibold shadow-lg"
 >
 {language === "vi" ? "Câu Chuyện Của Chúng Tôi" : "Our Story"}
 </Link>
 </div>
 </section>

 {/* VALUES SECTION - Minimalist */}
 <section className={`py-40 px-6 bg-[#F8F8F8]`}>
 <div className="max-w-7xl mx-auto">
 {/* Header */}
 <div className="text-center mb-32">
 <span className={`inline-block text-black font-medium text-[10px] tracking-[0.4em] uppercase mb-8 font-light`}>
 {language === "vi" ? "Tại Sao Chọn Chúng Tôi" : "Why Choose Us"}
 </span>
 <h2
 className={`font-serif text-5xl mb-8 font-light text-gray-900`}
 >
 {language === "vi"
 ? "Xuất Sắc Trong Từng Chi Tiết"
 : "Excellence in Every Detail"}
 </h2>
 <div className="w-24 h-px bg-black mx-auto"></div>
 </div>

 {/* Values Grid */}
 <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-20"
 variants={staggerContainer}
 initial="hidden"
 whileInView="show"
 viewport={{ once: true, margin: "-100px" }}
 >
 {[
 {
 title:
 language === "vi"
 ? "Chứng Nhận Xuất Sắc"
 : "Authenticated Excellence",
 desc:
 language === "vi"
 ? "Mỗi chiếc đồng hồ đều được xác minh và chứng nhận tỉ mỉ bởi các chuyên gia đồng hồ của chúng tôi, đảm bảo tính xác thực và chất lượng."
 : "Every timepiece is meticulously verified and certified by our expert horologists, ensuring authenticity and quality.",
 },
 {
 title:
 language === "vi"
 ? "Đối Tác Trọn Đời"
 : "Lifetime Partnership",
 desc:
 language === "vi"
 ? "Chúng tôi cung cấp bảo hành toàn diện 5 năm và dịch vụ hậu mãi tận tâm để bạn hoàn toàn yên tâm."
 : "We provide comprehensive 5-year warranty and dedicated after-sales service for complete peace of mind.",
 },
 {
 title:
 language === "vi" ? "Dịch Vụ Cao Cấp" : "White Glove Service",
 desc:
 language === "vi"
 ? "Trải nghiệm sự sang trọng từ khi mua hàng đến giao nhận với dịch vụ concierge cao cấp và bao bì thanh lịch của chúng tôi."
 : "Experience luxury from purchase to delivery with our premium concierge service and elegant packaging.",
 },
 ].map((item, index) => (
 <motion.div
 key={index}
 variants={fadeUpVariant}
 className="text-center space-y-8 group"
 >
 <div className="w-20 h-px bg-black mx-auto group-hover:w-28 transition-all duration-500"></div>
 <h3
 className={`font-serif text-3xl group-hover:text-black font-medium transition-colors duration-300 text-gray-900`}
 >
 {item.title}
 </h3>
 <p
 className={`text-lg leading-relaxed font-light text-black`}
 >
 {item.desc}
 </p>
 </motion.div>
 ))}
 </motion.div>
 </div>
 </section>

 {/* CTA SECTION - Dark Dramatic */}
 <section className="relative py-40 overflow-hidden">
 <div className="absolute inset-0 z-0">
 <img
 src="https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=2000&q=95"
 alt="Luxury Watch Collection"
 className="w-full h-full object-cover"
 />
 <div
 className={`absolute inset-0 bg-gradient-to-t from-white/90 via-white/80 to-white/70`}
 ></div>
 </div>

 <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
 <span className={`inline-block text-black font-medium text-[10px] tracking-[0.4em] uppercase mb-8 font-light`}>
 {language === "vi" ? "Ghé Thăm Showroom" : "Visit Our Atelier"}
 </span>
 <h2
 className={`font-serif text-5xl md:text-6xl mb-10 leading-tight font-light text-gray-900`}
 >
 {language === "vi"
 ? "Trải Nghiệm Bộ Sưu Tập"
 : "Experience the Collection"}
 <br />
 <span className={`text-black font-medium`}>
 {language === "vi" ? "Trực Tiếp" : "In Person"}
 </span>
 </h2>
 <div className="w-24 h-px bg-black mx-auto mb-10"></div>
 <p
 className={`text-xl leading-relaxed font-light mb-16 max-w-2xl mx-auto text-black`}
 >
 {language === "vi"
 ? "Ghé thăm showroom độc quyền của chúng tôi và khám phá những kiệt tác này. Đội ngũ chuyên gia sẵn sàng đồng hành cùng bạn trong hành trình khám phá đồng hồ."
 : "Visit our exclusive showroom and discover these masterpieces firsthand. Our experts are ready to guide you through your horological journey."}
 </p>
 <div className="flex flex-col sm:flex-row gap-6 justify-center">
 <Link
 to="/contact"
 className="inline-block px-10 py-5 bg-black text-white hover:bg-neutral-800 transition-all duration-500 text-xs tracking-[0.3em] uppercase font-medium"
 >
 {language === "vi" ? "Đặt Lịch Hẹn" : "Book Appointment"}
 </Link>
 <Link
 to="/products"
 className={`inline-block px-10 py-5 border-2 transition-all duration-500 text-xs tracking-[0.3em] uppercase font-light border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white`}
 >
 {language === "vi" ? "Xem Trực Tuyến" : "Browse Online"}
 </Link>
 </div>
 </div>
 </section>

 {/* FOOTER - Minimal Luxury */}
 <footer
 className={`py-20 px-6 border-t bg-gray-100 border-gray-200`}
 >
 <div className="max-w-7xl mx-auto">
 {/* Main Footer Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
 {/* Brand Column */}
 <div className="space-y-8">
 <h3 className={`font-serif text-3xl text-black font-medium mb-8`}>
 WatchStore
 </h3>
 <p
 className={`text-sm leading-relaxed font-light text-black`}
 >
 {language === "vi"
 ? "Điểm đến cho những chiếc đồng hồ cao cấp nhất thế giới. Được tuyển chọn với đam mê, phục vụ với xuất sắc."
 : "Your destination for the world's finest timepieces. Curated with passion, delivered with excellence."}
 </p>
 {/* Social Icons */}
 <div className="flex gap-6 pt-6">
 {[
 { name: "Facebook", icon: "ri:facebook-fill" },
 { name: "Instagram", icon: "ri:instagram-fill" },
 { name: "TikTok", icon: "ri:tiktok-fill" },
 ].map((social) => (
 <a
 key={social.name}
 href="#"
 className={`w-10 h-10 border flex items-center justify-center hover:border-black hover:bg-black transition-all duration-300 group border-gray-400`}
 title={social.name}
 >
 <Icon
 icon={social.icon}
 width={18}
 height={18}
 className={`group-hover:text-white transition-colors text-black`}
 />
 </a>
 ))}
 </div>
 </div>

 {/* Links Columns */}
 {[
 {
 title: language === "vi" ? "Bộ Sưu Tập" : "Collections",
 links:
 language === "vi"
 ? [
 "Tất Cả Đồng Hồ",
 "Đồng Hồ Nam",
 "Đồng Hồ Nữ",
 "Phiên Bản Giới Hạn",
 ]
 : [
 "All Timepieces",
 "Men's Watches",
 "Women's Watches",
 "Limited Editions",
 ],
 },
 {
 title: language === "vi" ? "Dịch Vụ" : "Services",
 links:
 language === "vi"
 ? ["Bảo Hành", "Bảo Trì", "Thu Đổi", "Tư Vấn"]
 : ["Warranty", "Maintenance", "Trade-In", "Consultation"],
 },
 {
 title: language === "vi" ? "Công Ty" : "Company",
 links:
 language === "vi"
 ? ["Về Chúng Tôi", "Showroom", "Liên Hệ", "Tuyển Dụng"]
 : ["About Us", "Showroom", "Contact", "Careers"],
 },
 ].map((section, index) => (
 <div key={index} className="space-y-8">
 <h4
 className={`text-sm tracking-[0.2em] uppercase font-light mb-8 text-gray-900`}
 >
 {section.title}
 </h4>
 <ul className="space-y-4">
 {section.links.map((link, i) => (
 <li key={i}>
 <a
 href="#"
 className={`text-sm hover:text-black font-medium transition-colors duration-300 font-light text-black`}
 >
 {link}
 </a>
 </li>
 ))}
 </ul>
 </div>
 ))}
 </div>

 {/* Bottom Bar */}
 <div
 className={`pt-12 border-t border-gray-300`}
 >
 <div className="flex flex-col md:flex-row justify-between items-center gap-6">
 <p
 className={`text-xs font-light tracking-wider text-black`}
 >
 © 2025 WatchStore.{" "}
 {language === "vi"
 ? "Bảo lưu mọi quyền."
 : "All rights reserved."}
 </p>
 <div className="flex gap-8">
 <a
 href="#"
 className={`text-xs hover:text-black font-medium transition-colors font-light text-black`}
 >
 {language === "vi" ? "Chính Sách Bảo Mật" : "Privacy Policy"}
 </a>
 <a
 href="#"
 className={`text-xs hover:text-black font-medium transition-colors font-light text-black`}
 >
 {language === "vi"
 ? "Điều Khoản Dịch Vụ"
 : "Terms of Service"}
 </a>
 </div>
 </div>
 </div>
 </div>
 </footer>
 </div>
 );
}
