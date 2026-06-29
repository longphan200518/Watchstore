import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Header from "../components/Header";
import ToastContainer from "../components/ToastContainer";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";

export default function Checkout() {
 const [user, setUser] = useState(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [success, setSuccess] = useState("");
 const [paymentMethod, setPaymentMethod] = useState("COD");
 const navigate = useNavigate();
 const { cartItems, getTotalPrice, getTotalItems, clearCart } = useCart();
 const { addToast } = useToast();

 const [formData, setFormData] = useState({
 fullName: "",
 email: "",
 phoneNumber: "",
 streetAddress: "",
 notes: "",
 });

 // Shipping & Location states
 const [provinces, setProvinces] = useState([]);
 const [districts, setDistricts] = useState([]);
 const [wards, setWards] = useState([]);

 const [selectedProvince, setSelectedProvince] = useState("");
 const [selectedDistrict, setSelectedDistrict] = useState("");
 const [selectedWard, setSelectedWard] = useState("");
 const [shippingOptions, setShippingOptions] = useState([]);
 const [selectedShipping, setSelectedShipping] = useState(null);
 const [isEstimating, setIsEstimating] = useState(false);
 const [customerLat, setCustomerLat] = useState(null);
 const [customerLng, setCustomerLng] = useState(null);
 const [isLocating, setIsLocating] = useState(false);
 const [userAddresses, setUserAddresses] = useState([]);
 const [showAddressBook, setShowAddressBook] = useState(false);

 useEffect(() => {
 const userData = localStorage.getItem("user") || sessionStorage.getItem("user");
 if (userData) {
 try {
 const parsedUser = JSON.parse(userData);
 setUser(parsedUser);
 setFormData((prev) => ({
 ...prev,
 fullName: parsedUser.fullName || "",
 email: parsedUser.email || "",
 phoneNumber: parsedUser.phoneNumber || "",
 }));
 } catch (e) {
 console.error("Failed to load user:", e);
 }
 }

 // Load provinces
 fetchProvinces();
 const token = localStorage.getItem("token") || sessionStorage.getItem("token");
 if (token) {
 fetchUserAddresses(token);
 }
 }, []);

 const fetchUserAddresses = async (token) => {
 try {
 const res = await fetch("http://localhost:5221/api/useraddresses", {
 headers: { Authorization: `Bearer ${token}` }
 });
 const result = await res.json();
 if (result.success && result.data) {
 setUserAddresses(result.data);
 }
 } catch (err) {
 console.error("Failed to fetch user addresses", err);
 }
 };

 const fetchProvinces = async () => {
 try {
 const res = await fetch("http://localhost:5221/api/shipping/provinces");
 const result = await res.json();
 if (result.success && result.data) {
 setProvinces(result.data);
 }
 } catch (err) {
 console.error("Failed to fetch provinces", err);
 }
 };

 const handleProvinceChange = async (e) => {
 const provinceId = e.target.value;
 setSelectedProvince(provinceId);
 setSelectedDistrict("");
 setSelectedWard("");
 setDistricts([]);
 setWards([]);
 setShippingOptions([]);
 setSelectedShipping(null);

 if (provinceId) {
 try {
 const res = await fetch(`http://localhost:5221/api/shipping/districts/${provinceId}`);
 const result = await res.json();
 if (result.success && result.data) {
 setDistricts(result.data);
 }
 } catch (err) {
 console.error("Failed to fetch districts", err);
 }
 }
 };

 const handleDistrictChange = async (e) => {
 const districtId = e.target.value;
 setSelectedDistrict(districtId);
 setSelectedWard("");
 setWards([]);
 setShippingOptions([]);
 setSelectedShipping(null);

 if (districtId) {
 try {
 const res = await fetch(`http://localhost:5221/api/shipping/wards/${districtId}`);
 const result = await res.json();
 if (result.success && result.data) {
 setWards(result.data);
 }
 } catch (err) {
 console.error("Failed to fetch wards", err);
 }
 }
 };

 const handleWardChange = async (e) => {
 const wardCode = e.target.value;
 setSelectedWard(wardCode);
 setShippingOptions([]);
 setSelectedShipping(null);

 if (selectedProvince && selectedDistrict && wardCode) {
 estimateShipping(selectedProvince, selectedDistrict, wardCode);
 }
 };

 const handleSelectSavedAddress = async (address) => {
 setFormData(prev => ({
 ...prev,
 fullName: address.fullName,
 phoneNumber: address.phoneNumber,
 streetAddress: address.streetAddress
 }));
 // Attempt to match province
 const matchedProv = provinces.find(p => (p.ProvinceName || p.provinceName).toLowerCase().includes(address.province.toLowerCase()) || address.province.toLowerCase().includes((p.ProvinceName || p.provinceName).toLowerCase())
 );
 if (matchedProv) {
 const provId = matchedProv.ProvinceID || matchedProv.provinceID;
 setSelectedProvince(provId);
 try {
 const resDist = await fetch(`http://localhost:5221/api/shipping/districts/${provId}`);
 const distResult = await resDist.json();
 if (distResult.success && distResult.data) {
 setDistricts(distResult.data);
 const matchedDist = distResult.data.find(d => (d.DistrictName || d.districtName).toLowerCase().includes(address.district.toLowerCase()) ||
 address.district.toLowerCase().includes((d.DistrictName || d.districtName).toLowerCase())
 );
 if (matchedDist) {
 const distId = matchedDist.DistrictID || matchedDist.districtID;
 setSelectedDistrict(distId);
 const resWard = await fetch(`http://localhost:5221/api/shipping/wards/${distId}`);
 const wardResult = await resWard.json();
 if (wardResult.success && wardResult.data) {
 setWards(wardResult.data);
 const matchedWard = wardResult.data.find(w => (w.WardName || w.wardName).toLowerCase().includes(address.ward.toLowerCase()) ||
 address.ward.toLowerCase().includes((w.WardName || w.wardName).toLowerCase())
 );
 if (matchedWard) {
 const wardCode = matchedWard.WardCode || matchedWard.wardCode;
 setSelectedWard(wardCode);
 estimateShipping(provId, distId, wardCode);
 } else {
 setSelectedWard("");
 }
 }
 } else {
 setSelectedDistrict("");
 setSelectedWard("");
 setWards([]);
 }
 }
 } catch (err) {
 console.error("Error fetching districts/wards for saved address", err);
 }
 } else {
 setSelectedProvince("");
 setSelectedDistrict("");
 setSelectedWard("");
 setDistricts([]);
 setWards([]);
 }
 setShowAddressBook(false);
 };

 const handleGetLocation = () => {
 if (!navigator.geolocation) {
 addToast("Trình duyệt của bạn không hỗ trợ định vị GPS.", "error", 3000);
 return;
 }
 setIsLocating(true);
 navigator.geolocation.getCurrentPosition(
 async (position) => {
 const lat = position.coords.latitude;
 const lng = position.coords.longitude;
 setCustomerLat(lat);
 setCustomerLng(lng);
 try {
 const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
 const data = await res.json();
 if (data && data.display_name) {
 setFormData(prev => ({ ...prev, streetAddress: data.display_name }));
 if (selectedProvince && selectedDistrict && selectedWard) {
 estimateShipping(selectedProvince, selectedDistrict, selectedWard, lat, lng);
 }
 }
 } catch (error) {
 console.error("Geocoding failed", error);
 } finally {
 setIsLocating(false);
 }
 },
 (error) => {
 addToast("Không thể lấy được vị trí GPS. Vui lòng bật định vị hoặc tự nhập địa chỉ.", "error", 3000);
 setIsLocating(false);
 }
 );
 };

 const estimateShipping = async (provId, distId, wardCd, lat = customerLat, lng = customerLng) => {
 setIsEstimating(true);
 try {
 const provinceObj = provinces.find(p => (p.ProvinceID || p.provinceID).toString() === provId.toString());
 const districtObj = districts.find(d => (d.DistrictID || d.districtID).toString() === distId.toString());
 const wardObj = wards.find(w => (w.WardCode || w.wardCode).toString() === wardCd.toString());

 const request = {
 province: provinceObj ? (provinceObj.ProvinceName || provinceObj.provinceName) : "",
 district: districtObj ? (districtObj.DistrictName || districtObj.districtName) : "",
 ward: wardObj ? (wardObj.WardName || wardObj.wardName) : "",
 toDistrictId: parseInt(distId),
 toWardCode: wardCd,
 weightInGrams: 500,
 orderTotalValue: getTotalPrice(),
 customerLat: lat,
 customerLng: lng
 };

 const res = await fetch("http://localhost:5221/api/shipping/estimate", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify(request)
 });
 const result = await res.json();
 if (result.success && result.data) {
 setShippingOptions(result.data);
 if (result.data.length > 0) {
 setSelectedShipping(result.data[0]);
 }
 } else {
 addToast("Không thể tính phí vận chuyển", "error");
 }
 } catch (err) {
 console.error("Failed to estimate shipping", err);
 } finally {
 setIsEstimating(false);
 }
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 setLoading(true);
 setError("");

 if (cartItems.length === 0) {
 setError("Giỏ hàng trống");
 addToast("Giỏ hàng trống", "warning", 2000);
 setLoading(false);
 return;
 }

 if (!selectedProvince || !selectedDistrict || !selectedWard || !formData.streetAddress) {
 setError("Vui lòng nhập đầy đủ địa chỉ giao hàng");
 addToast("Vui lòng nhập đầy đủ địa chỉ", "warning", 2000);
 setLoading(false);
 return;
 }

 if (!selectedShipping) {
 setError("Vui lòng chọn đơn vị vận chuyển");
 addToast("Vui lòng chọn đơn vị vận chuyển", "warning", 2000);
 setLoading(false);
 return;
 }

 try {
 const token = localStorage.getItem("token") || sessionStorage.getItem("token");
 if (!token) {
 setError("Vui lòng đăng nhập");
 addToast("Vui lòng đăng nhập", "warning", 2000);
 navigate("/login");
 return;
 }

 const provinceObj = provinces.find(p => (p.ProvinceID || p.provinceID)?.toString() === selectedProvince);
 const districtObj = districts.find(d => (d.DistrictID || d.districtID)?.toString() === selectedDistrict);
 const wardObj = wards.find(w => (w.WardCode || w.wardCode)?.toString() === selectedWard);

 const fullAddress = `${formData.streetAddress}, ${wardObj?.WardName || wardObj?.wardName || ""}, ${districtObj?.DistrictName || districtObj?.districtName || ""}, ${provinceObj?.ProvinceName || provinceObj?.provinceName || ""}`;

 const orderData = {
 shippingAddress: fullAddress,
 phoneNumber: formData.phoneNumber,
 notes: formData.notes,
 orderItems: cartItems.map((item) => ({
 watchId: item.watchId,
 quantity: item.quantity,
 })),
 paymentMethod: paymentMethod,
 shippingFee: selectedShipping.estimatedFee,
 shippingProvider: selectedShipping.provider
 };

 const response = await fetch("http://localhost:5221/api/orders", {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 Authorization: `Bearer ${token}`,
 },
 body: JSON.stringify(orderData),
 });

 const result = await response.json();

 if (result.success) {
 const orderId = result.data.id;

 if (paymentMethod === "VNPAY") {
 try {
 const paymentResponse = await fetch(
 "http://localhost:5221/api/payment/create-vnpay-url",
 {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 Authorization: `Bearer ${token}`,
 },
 body: JSON.stringify({ orderId }),
 }
 );

 const paymentResult = await paymentResponse.json();
 if (paymentResult.success && paymentResult.data?.paymentUrl) {
 clearCart();
 window.location.href = paymentResult.data.paymentUrl;
 return;
 }
 } catch (paymentErr) {
 console.error("VNPay error:", paymentErr);
 setError("Không thể kết nối VNPay. Vui lòng thử lại.");
 addToast("Lỗi thanh toán VNPay", "error", 3000);
 setLoading(false);
 return;
 }
 }

 setSuccess("Đặt hàng thành công!");
 addToast("✓ Đặt hàng thành công! Chuyển hướng...", "success", 3000);
 clearCart();
 setTimeout(() => {
 navigate(`/order-confirmation?orderId=${orderId}`);
 }, 2000);
 } else {
 setError(result.message || "Đặt hàng thất bại");
 addToast(result.message || "Đặt hàng thất bại", "error", 3000);
 }
 } catch (err) {
 setError(err.message || "Có lỗi xảy ra");
 addToast(err.message || "Có lỗi xảy ra", "error", 3000);
 console.error(err);
 } finally {
 setLoading(false);
 }
 };

 const currentTotal = getTotalPrice() + (selectedShipping ? selectedShipping.estimatedFee : 0);

 if (cartItems.length === 0) {
 return (
 <div className={`min-h-screen bg-[#F8F8F8] text-[#111111]`}>
 <Header />
 <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 text-center pt-32">
 <p className={"text-black"}>
 Giỏ hàng trống.{" "}
 <button onClick={() => navigate("/products")} className={`text-black font-medium hover:underline`}>
 Tiếp tục mua sắm
 </button>
 </p>
 </main>
 </div>
 );
 }

 return (
 <div className={`min-h-screen bg-[#F8F8F8] text-[#111111]`}>
 <Header />
 <ToastContainer />

 <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 pt-32">
 <h1 className={`text-4xl font-light tracking-tight mb-8 text-black`}>
 Thanh toán
 </h1>

 <div className="grid lg:grid-cols-3 gap-8">
 <div className="lg:col-span-2">
 <form onSubmit={handleSubmit} className="space-y-6">
 {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
 {success && <div className="p-4 bg-green-100 text-green-700 rounded-lg">{success}</div>}

 {/* Personal Info */}
 <div className={`rounded-lg border p-6 bg-white border-black/5`}>
 <h2 className={`text-lg font-semibold mb-4 text-black`}>
 Thông tin người nhận
 </h2>
 <div className="grid md:grid-cols-2 gap-4">
 <div className="md:col-span-2">
 <label className={`block text-sm font-medium mb-2 text-black`}>Họ và tên</label>
 <input type="text" value={formData.fullName} disabled className={`w-full px-4 py-2 rounded-lg border opacity-70 bg-gray-100 border-black/10 text-black`} />
 </div>
 <div>
 <label className={`block text-sm font-medium mb-2 text-black`}>Email</label>
 <input type="email" value={formData.email} disabled className={`w-full px-4 py-2 rounded-lg border opacity-70 bg-gray-100 border-black/10 text-black`} />
 </div>
 <div>
 <label className={`block text-sm font-medium mb-2 text-black`}>Số điện thoại</label>
 <input type="tel" required value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-black outline-none bg-white border-black/10 text-black`} />
 </div>
 </div>
 </div>

 {/* Shipping Address */}
 <div className={`rounded-lg border p-6 bg-white border-black/5`}>
 <div className="flex justify-between items-center mb-4">
 <h2 className={`text-lg font-semibold text-black`}>
 Địa chỉ giao hàng
 </h2>
 {userAddresses.length > 0 && (
 <button
 type="button"
 onClick={() => setShowAddressBook(!showAddressBook)}
 className={`text-sm font-medium flex items-center gap-1 text-blue-600 hover:text-blue-700`}
 >
 <Icon icon="teenyicons:book-outline" /> Sổ địa chỉ
 </button>
 )}
 </div>

 {showAddressBook && (
 <div className={`mb-6 p-4 rounded-lg border bg-neutral-50 border-black/10`}>
 <h3 className={`text-sm font-medium mb-3 text-black`}>Chọn địa chỉ đã lưu</h3>
 <div className="space-y-3 max-h-60 overflow-y-auto">
 {userAddresses.map(addr => (
 <div key={addr.id} onClick={() => handleSelectSavedAddress(addr)}
 className={`p-3 rounded border cursor-pointer transition border-black/10 hover:border-black/30 bg-white`}
 >
 <div className="flex items-center gap-2 mb-1">
 <span className={`font-medium text-black`}>{addr.fullName}</span>
 <span className={`text-sm text-neutral-500`}>{addr.phoneNumber}</span>
 {addr.isDefault && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-current text-blue-500">Mặc định</span>}
 </div>
 <p className={`text-sm text-neutral-600`}>
 {addr.streetAddress}, {addr.ward}, {addr.district}, {addr.province}
 </p>
 </div>
 ))}
 </div>
 </div>
 )}

 <div className="grid md:grid-cols-3 gap-4 mb-4">
 <div>
 <label className={`block text-sm font-medium mb-2 text-black`}>Tỉnh/Thành</label>
 <select required value={selectedProvince} onChange={handleProvinceChange} className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-black outline-none bg-white border-black/10 text-black`}>
 <option value="">Chọn Tỉnh/Thành</option>
 {provinces.map((p, index) => {
 const id = p.ProvinceID || p.provinceID;
 const name = p.ProvinceName || p.provinceName;
 return (
 <option key={`prov-${id || index}`} value={id}>{name}</option>
 );
 })}
 </select>
 </div>
 <div>
 <label className={`block text-sm font-medium mb-2 text-black`}>Quận/Huyện</label>
 <select required value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedProvince} className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-black outline-none bg-white border-black/10 text-black`}>
 <option value="">Chọn Quận/Huyện</option>
 {districts.map((d, index) => {
 const id = d.DistrictID || d.districtID;
 const name = d.DistrictName || d.districtName;
 return (
 <option key={`dist-${id || index}`} value={id}>{name}</option>
 );
 })}
 </select>
 </div>
 <div>
 <label className={`block text-sm font-medium mb-2 text-black`}>Phường/Xã</label>
 <select required value={selectedWard} onChange={handleWardChange} disabled={!selectedDistrict} className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-black outline-none bg-white border-black/10 text-black`}>
 <option value="">Chọn Phường/Xã</option>
 {wards.map((w, index) => {
 const id = w.WardCode || w.wardCode;
 const name = w.WardName || w.wardName;
 return (
 <option key={`ward-${id || index}`} value={id}>{name}</option>
 );
 })}
 </select>
 </div>
 </div>
 <div>
 <div className="flex justify-between items-center mb-2">
 <label className={`block text-sm font-medium text-black`}>Số nhà, tên đường</label>
 <button type="button"
 onClick={handleGetLocation}
 disabled={isLocating}
 className={`text-xs flex items-center gap-1 text-black font-medium hover:opacity-70 transition`}
 >
 {isLocating ? <Icon icon="mdi:loading" className="animate-spin" /> : <Icon icon="mdi:map-marker" />}
 {isLocating ? "Đang định vị..." : "Tự động định vị"}
 </button>
 </div>
 <input type="text" required value={formData.streetAddress} onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })} className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-black outline-none bg-white border-black/10 text-black`} placeholder="Ví dụ: Số 123, Đường Nguyễn Văn A" />
 </div>
 </div>

 {/* Shipping Options */}
 {selectedWard && (
 <div className={`rounded-lg border p-6 bg-white border-black/5`}>
 <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 text-black`}>
 Phương thức vận chuyển
 {isEstimating && <Icon icon="mdi:loading" className={`animate-spin text-black font-medium`} />}
 </h2>
 <div className="space-y-3">
 {shippingOptions.length > 0 ? (
 shippingOptions.map(option => (
 <label key={option.provider} className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition ${selectedShipping?.provider === option.provider ? ("border-black bg-gray-100") : ("border-black/10 hover:border-black/20")}`}>
 <div className="flex items-center gap-3">
 <input type="radio" name="shipping" checked={selectedShipping?.provider === option.provider} onChange={() => setSelectedShipping(option)} className={`w-4 h-4 text-black font-medium`} />
 <div>
 <div className={`font-medium text-black`}>{option.provider}</div>
 <div className={`text-xs text-black`}>Dự kiến giao: {option.estimatedDeliveryTime}</div>
 </div>
 </div>
 <div className={`font-semibold text-black`}>
 {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(option.estimatedFee)}
 </div>
 </label>
 ))
 ) : (
 !isEstimating && <p className="text-sm text-red-500">Không tìm thấy đơn vị vận chuyển phù hợp cho địa chỉ này.</p>
 )}
 </div>
 </div>
 )}

 {/* Payment Method */}
 <div className={`rounded-lg border p-6 bg-white border-black/5`}>
 <h2 className={`text-lg font-semibold mb-4 text-black`}>Phương thức thanh toán</h2>
 <div className="space-y-3">
 <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${paymentMethod === "COD" ? ("border-black bg-gray-100") : ("border-black/10 hover:border-black/20")}`}>
 <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === "COD"} onChange={(e) => setPaymentMethod(e.target.value)} className={`w-4 h-4 text-black font-medium`} />
 <div className="flex-1">
 <div className={`font-medium text-black`}>💵 Thanh toán khi nhận hàng (COD)</div>
 <div className={`text-sm text-black`}>Thanh toán bằng tiền mặt khi nhận hàng</div>
 </div>
 </label>
 <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${paymentMethod === "BANK" ? ("border-black bg-gray-100") : ("border-black/10 hover:border-black/20")}`}>
 <input type="radio" name="paymentMethod" value="BANK" checked={paymentMethod === "BANK"} onChange={(e) => setPaymentMethod(e.target.value)} className={`w-4 h-4 text-black font-medium`} />
 <div className="flex-1">
 <div className={`font-medium text-black`}>🏦 Chuyển khoản ngân hàng</div>
 <div className={`text-sm text-black`}>Thanh toán trước qua chuyển khoản</div>
 </div>
 </label>
 <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${paymentMethod === "VNPAY" ? ("border-black bg-gray-100") : ("border-black/10 hover:border-black/20")}`}>
 <input type="radio" name="paymentMethod" value="VNPAY" checked={paymentMethod === "VNPAY"} onChange={(e) => setPaymentMethod(e.target.value)} className={`w-4 h-4 text-black font-medium`} />
 <div className="flex-1">
 <div className={`font-medium text-black`}>💳 VNPay</div>
 <div className={`text-sm text-black`}>Thanh toán qua cổng VNPay (ATM, Visa, MasterCard)</div>
 </div>
 </label>
 {paymentMethod === "BANK" && (
 <div className={`p-4 rounded-lg bg-gray-50`}>
 <div className={`text-sm space-y-2 text-black`}>
 <p className="font-semibold">Thông tin chuyển khoản:</p>
 <p>Ngân hàng: <strong>Vietcombank</strong></p>
 <p>Số tài khoản: <strong>1234567890</strong></p>
 <p>Chủ tài khoản: <strong>WATCHSTORE</strong></p>
 <p className={"text-black"}>Nội dung: <strong>WATCHSTORE [SĐT]</strong></p>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Notes */}
 <div className={`rounded-lg border p-6 bg-white border-black/5`}>
 <h2 className={`text-lg font-semibold mb-4 text-black`}>Ghi chú (tùy chọn)</h2>
 <textarea rows="2" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-black outline-none bg-white border-black/10 text-black`} placeholder="Ghi chú cho đơn hàng" />
 </div>

 <button type="submit" disabled={loading} className={`w-full py-4 rounded-lg flex items-center justify-center gap-2 transition font-bold text-lg shadow-lg ${loading ? "opacity-50 cursor-not-allowed" : "bg-black hover:bg-neutral-800 text-white shadow-black/10"}`}>
 {loading ? "Đang xử lý..." : `Đặt Hàng (${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(currentTotal)})`}
 </button>
 </form>
 </div>

 {/* Order Summary */}
 <div className={`rounded-lg border p-6 h-fit sticky top-32 bg-white border-black/5 shadow-sm`}>
 <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 text-black`}>
 <Icon icon="mdi:receipt-text-outline" /> Đơn hàng
 </h2>

 <div className={`space-y-3 pb-4 border-b mb-4 border-black/10`}>
 {cartItems.map((item) => (
 <div key={item.id} className="flex justify-between text-sm">
 <span className={`line-clamp-1 pr-4 text-black`}>
 {item.watchName} <span className="font-medium">x{item.quantity}</span>
 </span>
 <span className={`whitespace-nowrap font-medium text-black`}>
 {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.unitPrice * item.quantity)}
 </span>
 </div>
 ))}
 </div>

 <div className="space-y-3 text-sm">
 <div className="flex justify-between">
 <span className={"text-black"}>Tạm tính:</span>
 <span className={`font-medium text-black`}>
 {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(getTotalPrice())}
 </span>
 </div>
 <div className="flex justify-between">
 <span className={"text-black"}>Phí vận chuyển:</span>
 <span className={`font-medium text-black`}>
 {selectedShipping ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(selectedShipping.estimatedFee) : "Chưa xác định"}
 </span>
 </div>
 </div>

 <div className={`border-t mt-4 pt-4 flex justify-between text-lg font-bold border-black/10`}>
 <span className={"text-black"}>Tổng cộng:</span>
 <span className={`text-black font-medium`}>
 {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(currentTotal)}
 </span>
 </div>
 </div>
 </div>
 </main>
 </div>
 );
}
