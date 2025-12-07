import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../services/brandService";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import ImageUpload from "../components/ImageUpload";

export default function Brands() {
  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Quản lý sản phẩm", path: "/products" },
    { label: "Quản lý đơn hàng", path: "/orders" },
    { label: "Quản lý thương hiệu", path: "/brands" },
    { label: "Quản lý người dùng", path: "/users" },
    { label: "Quản lý đánh giá", path: "/reviews" },
  ];

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logoUrl: "",
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await getBrands({ pageNumber: 1, pageSize: 100 });
      if (response.success) {
        setBrands(response.data.items || []);
      } else {
        setError("Không tải được thương hiệu");
      }
    } catch (err) {
      setError("Lỗi khi tải thương hiệu");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingBrand(null);
    setFormData({ name: "", description: "", logoUrl: "" });
    setShowModal(true);
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || "",
      logoUrl: brand.logoUrl || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa thương hiệu này?")) return;
    try {
      const response = await deleteBrand(id);
      if (response.success) {
        fetchBrands();
      } else {
        alert("Không thể xóa thương hiệu");
      }
    } catch (err) {
      alert("Lỗi khi xóa thương hiệu");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = editingBrand
        ? await updateBrand(editingBrand.id, formData)
        : await createBrand(formData);

      if (response.success) {
        setShowModal(false);
        fetchBrands();
      } else {
        alert(response.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      alert("Lỗi khi lưu thương hiệu");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar navItems={navItems} />

      <main className="ml-64 p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Quản lý thương hiệu</p>
            <h2 className="text-3xl font-semibold text-gray-900">
              Thương hiệu
            </h2>
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-lg bg-secondary text-white text-sm hover:bg-blue-600 shadow"
          >
            Thêm thương hiệu
          </button>
        </div>

        {loading && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 text-gray-600">
            Đang tải...
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Tên thương hiệu</th>
                  <th className="px-6 py-3 text-left">Mô tả</th>
                  <th className="px-6 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{brand.name}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {brand.description || "—"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(brand)}
                        className="px-3 py-1.5 text-xs rounded border border-gray-200 text-gray-700 hover:bg-white shadow-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(brand.id)}
                        className="px-3 py-1.5 text-xs rounded border border-red-200 text-red-600 hover:bg-red-50"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {editingBrand ? "Sửa thương hiệu" : "Thêm thương hiệu"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên thương hiệu
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div>
                <ImageUpload
                  label="Logo thương hiệu"
                  currentImage={formData.logoUrl}
                  onImageChange={(url) =>
                    setFormData({ ...formData, logoUrl: url })
                  }
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-blue-600"
                >
                  {editingBrand ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
