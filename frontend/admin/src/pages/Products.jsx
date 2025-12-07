import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import {
  getWatches,
  createWatch,
  updateWatch,
  deleteWatch,
} from "../services/watchService";
import { getBrands } from "../services/brandService";
import { formatCurrency } from "../utils/format";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import ImageUpload from "../components/ImageUpload";

const statusMap = {
  1: {
    label: "Có sẵn",
    color: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    icon: "solar:check-circle-bold",
  },
  2: {
    label: "Hết hàng",
    color: "bg-red-50 text-red-700 border border-red-200",
    icon: "solar:close-circle-bold",
  },
  3: {
    label: "Ngừng bán",
    color: "bg-gray-50 text-gray-700 border border-gray-200",
    icon: "solar:pause-circle-bold",
  },
};

export default function Products() {
  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Quản lý sản phẩm", path: "/products" },
    { label: "Quản lý đơn hàng", path: "/orders" },
    { label: "Quản lý thương hiệu", path: "/brands" },
    { label: "Quản lý người dùng", path: "/users" },
    { label: "Quản lý đánh giá", path: "/reviews" },
  ];

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ pageNumber: 1, pageSize: 20 });
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    status: 1,
    brandId: "",
    // Thông số máy
    caseSize: "",
    movement: "",
    functions: "",
    // Kích thước
    thickness: "",
    bandWidth: "",
    // Chất liệu
    crystal: "",
    caseMaterial: "",
    bandMaterial: "",
    // Khác
    waterResistance: "",
    warranty: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, [pagination.pageNumber]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getWatches({
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
      });
      if (response.success) {
        setProducts(response.data.items || []);
      } else {
        setError("Không tải được sản phẩm");
      }
    } catch (err) {
      setError("Lỗi khi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await getBrands({ pageNumber: 1, pageSize: 100 });
      if (response.success) {
        setBrands(response.data.items || []);
      }
    } catch (err) {
      console.error("Lỗi tải brands:", err);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      stockQuantity: "",
      status: 1,
      brandId: "",
      // Thông số máy
      caseSize: "",
      movement: "",
      functions: "",
      // Kích thước
      thickness: "",
      bandWidth: "",
      // Chất liệu
      crystal: "",
      caseMaterial: "",
      bandMaterial: "",
      // Khác
      waterResistance: "",
      warranty: "",
      imageUrl: "",
    });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stockQuantity: product.stockQuantity,
      status: product.status,
      brandId: product.brandId,
      // Thông số máy
      caseSize: product.caseSize || "",
      movement: product.movement || "",
      functions: product.functions || "",
      // Kích thước
      thickness: product.thickness || "",
      bandWidth: product.bandWidth || "",
      // Chất liệu
      crystal: product.crystal || "",
      caseMaterial: product.caseMaterial || "",
      bandMaterial: product.bandMaterial || "",
      // Khác
      waterResistance: product.waterResistance || "",
      warranty: product.warranty || "",
      imageUrl:
        product.images && product.images.length > 0
          ? product.images[0].imageUrl
          : "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      const response = await deleteWatch(id);
      if (response.success) {
        fetchProducts();
      } else {
        alert("Không thể xóa sản phẩm");
      }
    } catch (err) {
      alert("Lỗi khi xóa sản phẩm");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        brandId: parseInt(formData.brandId),
        imageUrls: formData.imageUrl ? [formData.imageUrl] : [],
      };

      // Remove imageUrl field as backend expects imageUrls
      delete payload.imageUrl;

      const response = editingProduct
        ? await updateWatch(editingProduct.id, {
            id: editingProduct.id,
            ...payload,
          })
        : await createWatch(payload);

      if (response.success) {
        setShowModal(false);
        fetchProducts();
      } else {
        alert(response.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      alert("Lỗi khi lưu sản phẩm");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar navItems={navItems} />

      {/* Main content */}
      <main className="ml-72 min-h-screen">
        <AdminHeader title="Quản lý sản phẩm" subtitle="Trang chủ / Sản phẩm" />

        <div className="px-8 pb-8 space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm">
                <span className="text-sm text-gray-600">Tổng: </span>
                <span className="text-sm font-bold text-gray-900">
                  {products.length}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white shadow-sm transition-all duration-200 flex items-center gap-2">
                <Icon icon="solar:import-bold-duotone" className="text-lg" />
                Nhập CSV
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/30 transition-all duration-200 flex items-center gap-2"
              >
                <Icon
                  icon="solar:add-circle-bold-duotone"
                  className="text-lg"
                />
                Thêm sản phẩm
              </button>
            </div>
          </div>

          {/* Loading / Error */}
          {loading && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-gray-600 flex items-center gap-3">
              <Icon
                icon="svg-spinners:ring-resize"
                className="text-2xl text-amber-500"
              />
              <span>Đang tải sản phẩm...</span>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm flex items-center gap-3">
              <Icon icon="solar:danger-circle-bold" className="text-xl" />
              {error}
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:box-bold-duotone" />
                        Sản phẩm
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Thương hiệu
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Giá
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Tồn kho
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => {
                    const statusInfo = statusMap[p.status] || statusMap[1];
                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                              {p.images?.[0]?.imageUrl ? (
                                <img
                                  src={p.images[0].imageUrl}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Icon
                                    icon="solar:watch-bold-duotone"
                                    className="text-2xl text-gray-400"
                                  />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {p.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                ID: {p.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                            {p.brandName}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-900 font-bold">
                            {formatCurrency(p.price)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Icon
                              icon="solar:box-bold-duotone"
                              className="text-gray-400"
                            />
                            <span className="text-gray-700 font-medium">
                              {p.stockQuantity}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${statusInfo.color}`}
                          >
                            <Icon icon={statusInfo.icon} className="text-sm" />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(p)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Icon
                                icon="solar:pen-bold-duotone"
                                className="text-lg"
                              />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <Icon
                                icon="solar:trash-bin-trash-bold-duotone"
                                className="text-lg"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal thêm/sửa sản phẩm */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon
                    icon={
                      editingProduct
                        ? "solar:pen-bold-duotone"
                        : "solar:add-circle-bold-duotone"
                    }
                    className="text-2xl text-white"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {editingProduct
                      ? "Chỉnh sửa sản phẩm"
                      : "Thêm sản phẩm mới"}
                  </h3>
                  <p className="text-sm text-white/80">
                    {editingProduct
                      ? "Cập nhật thông tin sản phẩm"
                      : "Điền đầy đủ thông tin bên dưới"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Icon
                  icon="solar:close-circle-bold"
                  className="text-2xl text-white"
                />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleSubmit}
              className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên sản phẩm *
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
                    Thương hiệu *
                  </label>
                  <select
                    required
                    value={formData.brandId}
                    onChange={(e) =>
                      setFormData({ ...formData, brandId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">Có sẵn</option>
                    <option value="2">Hết hàng</option>
                    <option value="3">Ngừng bán</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá (VND) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng tồn *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockQuantity: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kích thước vỏ
                  </label>
                  <input
                    type="text"
                    value={formData.caseSize}
                    onChange={(e) =>
                      setFormData({ ...formData, caseSize: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 42mm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bộ máy
                  </label>
                  <input
                    type="text"
                    value={formData.movement}
                    onChange={(e) =>
                      setFormData({ ...formData, movement: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: Automatic"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chức năng
                  </label>
                  <input
                    type="text"
                    value={formData.functions}
                    onChange={(e) =>
                      setFormData({ ...formData, functions: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: Chronograph, Date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Độ dày
                  </label>
                  <input
                    type="text"
                    value={formData.thickness}
                    onChange={(e) =>
                      setFormData({ ...formData, thickness: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 11mm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Độ rộng dây
                  </label>
                  <input
                    type="text"
                    value={formData.bandWidth}
                    onChange={(e) =>
                      setFormData({ ...formData, bandWidth: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 20mm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mặt kính
                  </label>
                  <input
                    type="text"
                    value={formData.crystal}
                    onChange={(e) =>
                      setFormData({ ...formData, crystal: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: Sapphire"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chất liệu vỏ
                  </label>
                  <input
                    type="text"
                    value={formData.caseMaterial}
                    onChange={(e) =>
                      setFormData({ ...formData, caseMaterial: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: Thép không gỉ 316L"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chất liệu dây
                  </label>
                  <input
                    type="text"
                    value={formData.bandMaterial}
                    onChange={(e) =>
                      setFormData({ ...formData, bandMaterial: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: Da/Thép"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chống nước
                  </label>
                  <input
                    type="text"
                    value={formData.waterResistance}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        waterResistance: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 150mATM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bảo hành
                  </label>
                  <input
                    type="text"
                    value={formData.warranty}
                    onChange={(e) =>
                      setFormData({ ...formData, warranty: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 24 tháng"
                  />
                </div>
                <div className="col-span-2">
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
                <div className="col-span-2">
                  <ImageUpload
                    label="Hình ảnh sản phẩm"
                    currentImage={formData.imageUrl}
                    onImageChange={(url) =>
                      setFormData({ ...formData, imageUrl: url })
                    }
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Icon
                    icon="solar:close-circle-bold-duotone"
                    className="text-lg"
                  />
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/30 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Icon
                    icon="solar:check-circle-bold-duotone"
                    className="text-lg"
                  />
                  {editingProduct ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
