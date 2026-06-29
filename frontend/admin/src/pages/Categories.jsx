import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../services/categoryService";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null); // null = create, else = edit
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCategories();
      if (res.success) setCategories(res.data || []);
      else setError(res.message || "Không tải được danh mục");
    } catch {
      setError("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, isError = false) => {
    if (isError) setError(msg);
    else setSuccess(msg);
    setTimeout(() => { setError(null); setSuccess(null); }, 3000);
  };

  const openCreate = () => {
    setEditItem(null);
    setFormData({ name: "", description: "" });
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditItem(cat);
    setFormData({ name: cat.name, description: cat.description });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
    setFormData({ name: "", description: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSubmitting(true);
    try {
      let res;
      if (editItem) {
        res = await updateCategory(editItem.id, formData);
      } else {
        res = await createCategory(formData);
      }
      if (res.success) {
        showToast(editItem ? "Cập nhật thành công" : "Tạo danh mục thành công");
        closeModal();
        fetchCategories();
      } else {
        showToast(res.message || "Thất bại", true);
      }
    } catch {
      showToast("Lỗi kết nối", true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteCategory(id);
      if (res.success) {
        showToast("Đã xóa danh mục");
        setDeleteTarget(null);
        fetchCategories();
      } else {
        showToast(res.message || "Không thể xóa", true);
        setDeleteTarget(null);
      }
    } catch {
      showToast("Lỗi kết nối", true);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] font-sans">
      <Sidebar />

      <main className="lg:ml-72 min-h-screen">
        <AdminHeader title="Danh mục" subtitle="Quản lý danh mục sản phẩm" />

        <div className="px-8 pb-12 space-y-6">
          {/* Toast */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm font-light flex items-center gap-2">
              <Icon icon="solar:check-circle-bold" className="text-green-500 text-lg" />
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 text-sm font-light flex items-center gap-2">
              <Icon icon="solar:danger-bold" className="text-red-500 text-lg" />
              {error}
            </div>
          )}

          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 font-light">
              {categories.length} danh mục
            </p>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-[#111111] text-white px-5 py-2.5 text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              <Icon icon="solar:add-circle-bold" className="text-lg" />
              Thêm danh mục
            </button>
          </div>

          {/* Table */}
          <div className="bg-white border border-[#EAEAEA] overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-sm text-gray-400 font-light">
                Đang tải...
              </div>
            ) : categories.length === 0 ? (
              <div className="py-16 text-center">
                <Icon icon="solar:folder-2-bold-duotone" className="text-5xl text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400 font-light">Chưa có danh mục nào</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#EAEAEA]">
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-widest">Tên danh mục</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-widest">Mô tả</th>
                    <th className="text-center px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-widest">Sản phẩm</th>
                    <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-widest">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEAEA]">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-[#F8F8F8] transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-medium text-[#111111]">{cat.name}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-light max-w-xs truncate">
                        {cat.description || <span className="italic text-gray-300">—</span>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-[#F8F8F8] border border-[#EAEAEA] text-[#111111] text-xs font-medium">
                          {cat.watchCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(cat)}
                            className="p-2 text-gray-500 hover:text-[#111111] hover:bg-gray-100 rounded transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Icon icon="solar:pen-bold" className="text-lg" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(cat)}
                            disabled={cat.watchCount > 0}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title={cat.watchCount > 0 ? "Không thể xóa danh mục có sản phẩm" : "Xóa"}
                          >
                            <Icon icon="solar:trash-bin-trash-bold" className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#EAEAEA]">
              <h2 className="text-lg font-serif text-[#111111]">
                {editItem ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-[#111111] transition-colors"
              >
                <Icon icon="solar:close-square-bold" className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-[#EAEAEA] px-4 py-3 text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
                  placeholder="VD: Đồng hồ nam"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-[#EAEAEA] px-4 py-3 text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors resize-none"
                  rows={3}
                  placeholder="Mô tả ngắn về danh mục..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 border border-[#EAEAEA] text-sm text-gray-500 hover:text-[#111111] hover:border-[#111111] transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-[#111111] text-white text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Đang lưu..." : editItem ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm shadow-2xl p-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Icon icon="solar:trash-bin-trash-bold" className="text-2xl text-red-500" />
              </div>
              <h3 className="text-lg font-serif text-[#111111] mb-2">Xóa danh mục</h3>
              <p className="text-sm text-gray-500 font-light mb-6">
                Bạn có chắc muốn xóa danh mục <strong className="text-[#111111]">"{deleteTarget.name}"</strong>? Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-3 border border-[#EAEAEA] text-sm text-gray-500 hover:text-[#111111] transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleDelete(deleteTarget.id)}
                  className="flex-1 py-3 bg-red-600 text-white text-sm hover:bg-red-700 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
