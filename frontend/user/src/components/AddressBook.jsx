import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useToast } from "../contexts/ToastContext";

export default function AddressBook({}) {
 const [addresses, setAddresses] = useState([]);
 const [loading, setLoading] = useState(true);
 const [showForm, setShowForm] = useState(false);
 const [editingId, setEditingId] = useState(null);
 const { addToast } = useToast();

 const [formData, setFormData] = useState({
 fullName: "",
 phoneNumber: "",
 province: "",
 district: "",
 ward: "",
 streetAddress: "",
 isDefault: false,
 });

 useEffect(() => {
 fetchAddresses();
 }, []);

 const fetchAddresses = async () => {
 try {
 const token = localStorage.getItem("token") || sessionStorage.getItem("token");
 const response = await fetch("http://localhost:5221/api/useraddresses", {
 headers: { Authorization: `Bearer ${token}` },
 });
 const result = await response.json();
 if (result.success) {
 setAddresses(result.data);
 }
 } catch (err) {
 console.error(err);
 } finally {
 setLoading(false);
 }
 };

 const handleInputChange = (e) => {
 const { name, value, type, checked } = e.target;
 setFormData((prev) => ({
 ...prev,
 [name]: type === "checkbox" ? checked : value,
 }));
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 try {
 const token = localStorage.getItem("token") || sessionStorage.getItem("token");
 const url = editingId
 ? `http://localhost:5221/api/useraddresses/${editingId}`
 : "http://localhost:5221/api/useraddresses";
 const method = editingId ? "PUT" : "POST";

 const response = await fetch(url, {
 method,
 headers: {
 "Content-Type": "application/json",
 Authorization: `Bearer ${token}`,
 },
 body: JSON.stringify(formData),
 });

 const result = await response.json();
 if (result.success) {
 addToast(editingId ? "Cập nhật địa chỉ thành công" : "Thêm địa chỉ thành công", "success");
 setShowForm(false);
 setEditingId(null);
 setFormData({
 fullName: "",
 phoneNumber: "",
 province: "",
 district: "",
 ward: "",
 streetAddress: "",
 isDefault: false,
 });
 fetchAddresses();
 } else {
 addToast(result.message || "Có lỗi xảy ra", "error");
 }
 } catch (err) {
 console.error(err);
 addToast("Có lỗi kết nối", "error");
 }
 };

 const handleEdit = (address) => {
 setFormData({
 fullName: address.fullName,
 phoneNumber: address.phoneNumber,
 province: address.province,
 district: address.district,
 ward: address.ward,
 streetAddress: address.streetAddress,
 isDefault: address.isDefault,
 });
 setEditingId(address.id);
 setShowForm(true);
 };

 const handleDelete = async (id) => {
 if (!window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;
 try {
 const token = localStorage.getItem("token") || sessionStorage.getItem("token");
 const response = await fetch(`http://localhost:5221/api/useraddresses/${id}`, {
 method: "DELETE",
 headers: { Authorization: `Bearer ${token}` },
 });
 const result = await response.json();
 if (result.success) {
 addToast("Xóa địa chỉ thành công", "success");
 fetchAddresses();
 } else {
 addToast(result.message, "error");
 }
 } catch (err) {
 addToast("Có lỗi kết nối", "error");
 }
 };

 const handleSetDefault = async (id) => {
 try {
 const token = localStorage.getItem("token") || sessionStorage.getItem("token");
 const response = await fetch(`http://localhost:5221/api/useraddresses/${id}/default`, {
 method: "POST",
 headers: { Authorization: `Bearer ${token}` },
 });
 const result = await response.json();
 if (result.success) {
 addToast("Đã thiết lập mặc định", "success");
 fetchAddresses();
 }
 } catch (err) {
 addToast("Có lỗi kết nối", "error");
 }
 };

 if (loading) return <div>Đang tải...</div>;

 return (
 <div className={`rounded-lg p-8 border bg-white border-black/5`}>
 <div className="flex justify-between items-center mb-6">
 <h2 className={`text-2xl font-semibold text-black`}>Sổ địa chỉ</h2>
 {!showForm && (
 <button
 onClick={() => {
 setFormData({ fullName: "", phoneNumber: "", province: "", district: "", ward: "", streetAddress: "", isDefault: false });
 setEditingId(null);
 setShowForm(true);
 }}
 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition bg-black text-white hover:bg-neutral-800`}
 >
 <Icon icon="teenyicons:plus-outline" /> Thêm địa chỉ
 </button>
 )}
 </div>

 {showForm ? (
 <form onSubmit={handleSubmit} className="space-y-4 bg-neutral-50 p-6 rounded-lg border border-neutral-200 /10">
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className={`block text-sm font-medium mb-1 text-black`}>Họ tên</label>
 <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required className={`w-full px-4 py-2 rounded-lg border bg-white border-black/10`} />
 </div>
 <div>
 <label className={`block text-sm font-medium mb-1 text-black`}>Số điện thoại</label>
 <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required className={`w-full px-4 py-2 rounded-lg border bg-white border-black/10`} />
 </div>
 </div>
 <div className="grid grid-cols-3 gap-4">
 <div>
 <label className={`block text-sm font-medium mb-1 text-black`}>Tỉnh/Thành</label>
 <input type="text" name="province" value={formData.province} onChange={handleInputChange} required className={`w-full px-4 py-2 rounded-lg border bg-white border-black/10`} />
 </div>
 <div>
 <label className={`block text-sm font-medium mb-1 text-black`}>Quận/Huyện</label>
 <input type="text" name="district" value={formData.district} onChange={handleInputChange} required className={`w-full px-4 py-2 rounded-lg border bg-white border-black/10`} />
 </div>
 <div>
 <label className={`block text-sm font-medium mb-1 text-black`}>Phường/Xã</label>
 <input type="text" name="ward" value={formData.ward} onChange={handleInputChange} required className={`w-full px-4 py-2 rounded-lg border bg-white border-black/10`} />
 </div>
 </div>
 <div>
 <label className={`block text-sm font-medium mb-1 text-black`}>Địa chỉ cụ thể</label>
 <input type="text" name="streetAddress" value={formData.streetAddress} onChange={handleInputChange} required className={`w-full px-4 py-2 rounded-lg border bg-white border-black/10`} />
 </div>
 <div className="flex items-center gap-2 mt-2">
 <input type="checkbox" name="isDefault" id="isDefault" checked={formData.isDefault} onChange={handleInputChange} className="w-4 h-4" />
 <label htmlFor="isDefault" className={`text-sm text-black`}>Đặt làm địa chỉ mặc định</label>
 </div>
 <div className="flex gap-4 pt-4">
 <button type="submit" className={`px-6 py-2 rounded-lg font-medium transition bg-black text-white hover:bg-neutral-800`}>
 {editingId ? "Cập nhật" : "Thêm mới"}
 </button>
 <button type="button" onClick={() => setShowForm(false)} className={`px-6 py-2 rounded-lg font-medium transition bg-neutral-200 text-black hover:bg-neutral-300`}>
 Hủy
 </button>
 </div>
 </form>
 ) : addresses.length === 0 ? (
 <div className="text-center py-12">
 <Icon icon="teenyicons:pin-outline" width={48} className={`mx-auto mb-4 text-neutral-300`} />
 <p className={`text-neutral-500`}>Bạn chưa có địa chỉ nào.</p>
 </div>
 ) : (
 <div className="space-y-4">
 {addresses.map((addr) => (
 <div key={addr.id} className={`p-5 rounded-lg border ${addr.isDefault ? ("border-black bg-black/5") : ("border-black/10")}`}>
 <div className="flex justify-between items-start">
 <div>
 <div className="flex items-center gap-3 mb-1">
 <span className={`font-semibold text-black`}>{addr.fullName}</span>
 <span className={`text-sm text-neutral-500`}>|</span>
 <span className={`text-sm text-neutral-500`}>{addr.phoneNumber}</span>
 {addr.isDefault && <span className={`ml-2 text-xs px-2 py-0.5 border rounded-full border-black text-black`}>Mặc định</span>}
 </div>
 <p className={`text-sm mt-2 text-neutral-700`}>{addr.streetAddress}</p>
 <p className={`text-sm text-neutral-700`}>{addr.ward}, {addr.district}, {addr.province}</p>
 </div>
 <div className="flex items-center gap-3">
 {!addr.isDefault && (
 <button onClick={() => handleSetDefault(addr.id)} className={`text-sm hover:underline text-neutral-600`}>Thiết lập mặc định</button>
 )}
 <button onClick={() => handleEdit(addr)} className={`text-sm hover:underline text-blue-600`}>Sửa</button>
 <button onClick={() => handleDelete(addr.id)} className={`text-sm hover:underline text-red-600`}>Xóa</button>
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 );
}
