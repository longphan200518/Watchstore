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
import { useToast } from "../contexts/ToastContext";

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
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ pageNumber: 1, pageSize: 20 });
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("name");
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
        setTotalPages(response.data.totalPages || 1);
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
        showToast("Xóa sản phẩm thành công!", "success");
        fetchProducts();
      } else {
        showToast("Không thể xóa sản phẩm", "error");
      }
    } catch (err) {
      showToast("Lỗi khi xóa sản phẩm", "error");
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
        showToast(
          editingProduct
            ? "Cập nhật sản phẩm thành công!"
            : "Thêm sản phẩm thành công!",
          "success"
        );
        setShowModal(false);
        fetchProducts();
      } else {
        showToast(response.message || "Có lỗi xảy ra", "error");
      }
    } catch (err) {
      showToast("Lỗi khi lưu sản phẩm", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] font-sans">
      <Sidebar />

      {/* Main content */}
      <main className="lg:ml-72 min-h-screen">
        <AdminHeader title="Quản lý sản phẩm" subtitle="Trang chủ / Sản phẩm" />

        <div className="px-4 lg:px-8 pb-8 space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-white rounded border border-[#EAEAEA]">
                <span className="text-sm text-gray-500 font-light">Tổng số: </span>
                <span className="text-sm font-medium text-[#111111]">
                  {products.length}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 rounded border border-[#111111] text-sm font-medium text-[#111111] hover:bg-[#111111] hover:text-white transition-colors flex items-center gap-2">
                <Icon icon="solar:import-outline" className="text-lg" />
                Nhập CSV
              </button>
              <button
                onClick={handleAdd}
                className="px-5 py-2.5 rounded bg-[#111111] text-white text-sm font-medium hover:bg-black transition-colors flex items-center gap-2"
              >
                <Icon icon="solar:add-circle-outline" className="text-lg" />
                Thêm sản phẩm
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Icon
                  icon="solar:magnifer-bold-duotone"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#EAEAEA] rounded bg-white focus:outline-none focus:border-[#111111] transition-colors font-light text-sm"
                />
              </div>
              <select
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="px-4 py-2.5 border border-[#EAEAEA] rounded bg-white focus:outline-none focus:border-[#111111] transition-colors font-light text-sm"
              >
                <option value="">Tất cả thương hiệu</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border border-[#EAEAEA] rounded bg-white focus:outline-none focus:border-[#111111] transition-colors font-light text-sm"
              >
                <option value="">Tất cả trạng thái</option>
                {Object.entries(statusMap).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 border border-[#EAEAEA] rounded bg-white focus:outline-none focus:border-[#111111] transition-colors font-light text-sm"
              >
                <option value="name">Tên A-Z</option>
                <option value="price-asc">Giá: Thấp → Cao</option>
                <option value="price-desc">Giá: Cao → Thấp</option>
                <option value="stock">Tồn kho</option>
              </select>
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
            <div className="bg-white border border-[#EAEAEA] overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-[#F8F8F8] border-b border-[#EAEAEA]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-widest">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-widest">
                      Thương hiệu
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-widest">
                      Giá
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-widest">
                      Tồn kho
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-widest">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-widest">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEAEA]">
                  {products
                    .filter((p) => {
                      // Search filter
                      if (
                        searchTerm &&
                        !p.name.toLowerCase().includes(searchTerm.toLowerCase())
                      ) {
                        return false;
                      }
                      // Brand filter
                      if (filterBrand && p.brandId.toString() !== filterBrand) {
                        return false;
                      }
                      // Status filter
                      if (
                        filterStatus &&
                        p.status.toString() !== filterStatus
                      ) {
                        return false;
                      }
                      return true;
                    })
                    .sort((a, b) => {
                      // Sorting
                      if (sortBy === "name")
                        return a.name.localeCompare(b.name);
                      if (sortBy === "price-asc") return a.price - b.price;
                      if (sortBy === "price-desc") return b.price - a.price;
                      if (sortBy === "stock")
                        return b.stockQuantity - a.stockQuantity;
                      return 0;
                    })
                    .map((p) => {
                      const statusInfo = statusMap[p.status] || statusMap[1];
                      return (
                        <tr
                          key={p.id}
                          className="hover:bg-[#F8F8F8] transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-[#F8F8F8] border border-[#EAEAEA] flex items-center justify-center overflow-hidden">
                                {p.images?.[0]?.imageUrl ? (
                                  <img
                                    src={p.images[0].imageUrl}
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Icon
                                    icon="solar:watch-bold"
                                    className="text-2xl text-gray-300"
                                  />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-[#111111]">
                                  {p.name}
                                </p>
                                <p className="text-xs text-gray-500 font-light mt-0.5">
                                  ID: {p.id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-gray-600">
                              {p.brandName}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[#111111] font-medium">
                              {formatCurrency(p.price)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[#111111] font-medium">
                              {p.stockQuantity}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-3 py-1 text-xs font-medium border uppercase tracking-wider ${
                                p.status === 1 ? "bg-white border-[#111111] text-[#111111]" : "bg-[#F8F8F8] border-[#EAEAEA] text-gray-500"
                              }`}
                            >
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEdit(p)}
                                className="text-gray-400 hover:text-[#111111] transition-colors"
                                title="Chỉnh sửa"
                              >
                                <Icon icon="solar:pen-outline" className="text-lg" />
                              </button>
                              <button
                                onClick={() => handleDelete(p.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                title="Xóa"
                              >
                                <Icon icon="solar:trash-bin-trash-outline" className="text-lg" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="text-sm text-gray-600">
                    Trang {pagination.pageNumber} / {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setPagination({
                          ...pagination,
                          pageNumber: pagination.pageNumber - 1,
                        })
                      }
                      disabled={pagination.pageNumber === 1}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Icon icon="solar:alt-arrow-left-bold" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.pageNumber <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.pageNumber >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = pagination.pageNumber - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() =>
                            setPagination({
                              ...pagination,
                              pageNumber: pageNum,
                            })
                          }
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            pagination.pageNumber === pageNum
                              ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                              : "border border-gray-300 text-gray-700 hover:bg-white"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() =>
                        setPagination({
                          ...pagination,
                          pageNumber: pagination.pageNumber + 1,
                        })
                      }
                      disabled={pagination.pageNumber === totalPages}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Icon icon="solar:alt-arrow-right-bold" />
                    </button>
                  </div>
                </div>
              )}
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
