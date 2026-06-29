import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import { getInventory, getInventoryTransactions, adjustStock } from "../services/inventoryService";
import { formatCurrency } from "../utils/format";

const TX_TYPE_LABELS = {
  import: { label: "Nhập hàng", color: "text-green-600 bg-green-50 border-green-200" },
  sale: { label: "Bán hàng", color: "text-blue-600 bg-blue-50 border-blue-200" },
  cancel: { label: "Hoàn hàng", color: "text-orange-600 bg-orange-50 border-orange-200" },
  adjustment: { label: "Điều chỉnh", color: "text-purple-600 bg-purple-50 border-purple-200" },
  manual: { label: "Thủ công", color: "text-gray-600 bg-gray-50 border-gray-200" },
};

export default function Inventory() {
  const [tab, setTab] = useState("stock"); // "stock" | "history"
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ pageNumber: 1, pageSize: 20, totalPages: 1, totalRecords: 0 });
  const [txPagination, setTxPagination] = useState({ pageNumber: 1, pageSize: 20, totalPages: 1, totalRecords: 0 });

  // Adjust modal
  const [adjustTarget, setAdjustTarget] = useState(null);
  const [adjustForm, setAdjustForm] = useState({ changeAmount: 0, transactionType: "adjustment", note: "" });
  const [adjusting, setAdjusting] = useState(false);

  useEffect(() => {
    if (tab === "stock") fetchInventory();
    else fetchTransactions();
  }, [tab, pagination.pageNumber, txPagination.pageNumber]);

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getInventory({
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
        search,
      });
      if (res.success) {
        setItems(res.data.items || []);
        setPagination((p) => ({ ...p, ...res.data }));
      } else setError(res.message);
    } catch {
      setError("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getInventoryTransactions({
        pageNumber: txPagination.pageNumber,
        pageSize: txPagination.pageSize,
      });
      if (res.success) {
        setTransactions(res.data.items || []);
        setTxPagination((p) => ({ ...p, ...res.data }));
      } else setError(res.message);
    } catch {
      setError("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, isError = false) => {
    if (isError) setError(msg);
    else setSuccess(msg);
    setTimeout(() => { setError(null); setSuccess(null); }, 3000);
  };

  const openAdjust = (item) => {
    setAdjustTarget(item);
    setAdjustForm({ changeAmount: 0, transactionType: "adjustment", note: "" });
  };

  const handleAdjust = async (e) => {
    e.preventDefault();
    if (!adjustTarget) return;
    setAdjusting(true);
    try {
      const res = await adjustStock({
        watchId: adjustTarget.watchId,
        changeAmount: Number(adjustForm.changeAmount),
        transactionType: adjustForm.transactionType,
        note: adjustForm.note,
      });
      if (res.success) {
        showToast(res.message || "Cập nhật tồn kho thành công");
        setAdjustTarget(null);
        fetchInventory();
      } else {
        showToast(res.message || "Thất bại", true);
      }
    } catch {
      showToast("Lỗi kết nối", true);
    } finally {
      setAdjusting(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((p) => ({ ...p, pageNumber: 1 }));
    fetchInventory();
  };

  const getStockColor = (qty) => {
    if (qty === 0) return "text-red-600 bg-red-50 border border-red-200";
    if (qty <= 5) return "text-orange-600 bg-orange-50 border border-orange-200";
    return "text-green-600 bg-green-50 border border-green-200";
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] font-sans">
      <Sidebar />

      <main className="lg:ml-72 min-h-screen">
        <AdminHeader title="Tồn kho" subtitle="Quản lý tồn kho sản phẩm" />

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

          {/* Tabs */}
          <div className="flex border-b border-[#EAEAEA]">
            {[
              { key: "stock", label: "Tồn kho hiện tại", icon: "solar:box-bold-duotone" },
              { key: "history", label: "Lịch sử giao dịch", icon: "solar:history-bold-duotone" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                  tab === t.key
                    ? "border-[#111111] text-[#111111]"
                    : "border-transparent text-gray-400 hover:text-[#111111]"
                }`}
              >
                <Icon icon={t.icon} className="text-lg" />
                {t.label}
              </button>
            ))}
          </div>

          {/* Stock Tab */}
          {tab === "stock" && (
            <>
              {/* Search */}
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="flex-1 relative">
                  <Icon
                    icon="solar:magnifer-linear"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm theo tên sản phẩm, thương hiệu..."
                    className="w-full border border-[#EAEAEA] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#111111] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#111111] text-white text-sm hover:bg-neutral-800 transition-colors"
                >
                  Tìm
                </button>
              </form>

              {/* Summary badges */}
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1.5 text-xs font-medium bg-white border border-[#EAEAEA] text-gray-600">
                  Tổng: {pagination.totalRecords} sản phẩm
                </span>
                <span className="px-3 py-1.5 text-xs font-medium bg-red-50 border border-red-200 text-red-600">
                  Hết hàng: {items.filter((i) => i.stockQuantity === 0).length}
                </span>
                <span className="px-3 py-1.5 text-xs font-medium bg-orange-50 border border-orange-200 text-orange-600">
                  Sắp hết (≤5): {items.filter((i) => i.stockQuantity > 0 && i.stockQuantity <= 5).length}
                </span>
              </div>

              {/* Table */}
              <div className="bg-white border border-[#EAEAEA] overflow-hidden">
                {loading ? (
                  <div className="py-16 text-center text-sm text-gray-400 font-light">Đang tải...</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#EAEAEA]">
                        <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-widest">Sản phẩm</th>
                        <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-widest hidden lg:table-cell">Danh mục</th>
                        <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-widest">Giá</th>
                        <th className="text-center px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-widest">Tồn kho</th>
                        <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-widest">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAEAEA]">
                      {items.map((item) => (
                        <tr key={item.watchId} className="hover:bg-[#F8F8F8] transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#F8F8F8] border border-[#EAEAEA] flex items-center justify-center flex-shrink-0">
                                {item.imageUrl ? (
                                  <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <Icon icon="solar:watch-bold-duotone" className="text-xl text-gray-300" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-[#111111] line-clamp-1">{item.watchName}</p>
                                <p className="text-xs text-gray-400 font-light mt-0.5">{item.brandName}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-500 font-light hidden lg:table-cell">
                            {item.categoryName}
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-[#111111]">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center justify-center px-3 py-1 text-xs font-semibold border ${getStockColor(item.stockQuantity)}`}>
                              {item.stockQuantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => openAdjust(item)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 border border-[#EAEAEA] text-xs font-medium text-gray-600 hover:text-[#111111] hover:border-[#111111] transition-colors"
                            >
                              Điều chỉnh
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPagination((p) => ({ ...p, pageNumber: p.pageNumber - 1 }))}
                    disabled={pagination.pageNumber <= 1}
                    className="p-2 border border-[#EAEAEA] text-gray-500 hover:text-[#111111] disabled:opacity-30"
                  >
                    <Icon icon="solar:arrow-left-linear" />
                  </button>
                  <span className="text-sm text-gray-500 px-3">
                    {pagination.pageNumber} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPagination((p) => ({ ...p, pageNumber: p.pageNumber + 1 }))}
                    disabled={pagination.pageNumber >= pagination.totalPages}
                    className="p-2 border border-[#EAEAEA] text-gray-500 hover:text-[#111111] disabled:opacity-30"
                  >
                    <Icon icon="solar:arrow-right-linear" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* History Tab */}
          {tab === "history" && (
            <div className="bg-white border border-[#EAEAEA] overflow-hidden">
              {loading ? (
                <div className="py-16 text-center text-sm text-gray-400 font-light">Đang tải...</div>
              ) : transactions.length === 0 ? (
                <div className="py-16 text-center">
                  <Icon icon="solar:history-bold-duotone" className="text-5xl text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400 font-light">Chưa có lịch sử giao dịch</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#EAEAEA]">
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-widest">Sản phẩm</th>
                      <th className="text-center px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-widest">Loại</th>
                      <th className="text-center px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-widest">Số lượng</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-widest hidden md:table-cell">Ghi chú</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-widest hidden lg:table-cell">Người thực hiện</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-widest">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAEAEA]">
                    {transactions.map((tx) => {
                      const typeInfo = TX_TYPE_LABELS[tx.transactionType?.toLowerCase()] || TX_TYPE_LABELS.manual;
                      return (
                        <tr key={tx.id} className="hover:bg-[#F8F8F8] transition-colors">
                          <td className="px-6 py-4 font-medium text-[#111111]">{tx.watchName}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium border ${typeInfo.color}`}>
                              {typeInfo.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`font-semibold ${tx.changeAmount > 0 ? "text-green-600" : "text-red-500"}`}>
                              {tx.changeAmount > 0 ? `+${tx.changeAmount}` : tx.changeAmount}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500 font-light hidden md:table-cell">
                            {tx.note || <span className="italic text-gray-300">—</span>}
                          </td>
                          <td className="px-6 py-4 text-gray-500 font-light hidden lg:table-cell">
                            {tx.createdByName || "System"}
                          </td>
                          <td className="px-6 py-4 text-gray-500 font-light text-xs">
                            {new Date(tx.createdAt).toLocaleString("vi-VN")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Adjust Stock Modal */}
      {adjustTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#EAEAEA]">
              <div>
                <h2 className="text-lg font-serif text-[#111111]">Điều chỉnh tồn kho</h2>
                <p className="text-xs text-gray-400 font-light mt-1">{adjustTarget.watchName}</p>
              </div>
              <button
                onClick={() => setAdjustTarget(null)}
                className="p-2 text-gray-400 hover:text-[#111111] transition-colors"
              >
                <Icon icon="solar:close-square-bold" className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleAdjust} className="px-8 py-6 space-y-5">
              {/* Current stock */}
              <div className="flex items-center justify-between p-4 bg-[#F8F8F8] border border-[#EAEAEA]">
                <span className="text-sm text-gray-500 font-light">Tồn kho hiện tại</span>
                <span className="text-2xl font-bold text-[#111111]">{adjustTarget.stockQuantity}</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
                  Số lượng thay đổi <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-400 font-light mb-2">Dương (+) = nhập thêm, Âm (-) = xuất/giảm</p>
                <input
                  type="number"
                  value={adjustForm.changeAmount}
                  onChange={(e) => setAdjustForm({ ...adjustForm, changeAmount: e.target.value })}
                  className="w-full border border-[#EAEAEA] px-4 py-3 text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
                  placeholder="VD: 50 hoặc -10"
                  required
                />
                {adjustForm.changeAmount !== 0 && (
                  <p className="text-xs mt-1.5 font-medium">
                    Tồn kho sau:{" "}
                    <span
                      className={
                        adjustTarget.stockQuantity + Number(adjustForm.changeAmount) < 0
                          ? "text-red-500"
                          : "text-green-600"
                      }
                    >
                      {adjustTarget.stockQuantity + Number(adjustForm.changeAmount)}
                    </span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
                  Loại giao dịch
                </label>
                <select
                  value={adjustForm.transactionType}
                  onChange={(e) => setAdjustForm({ ...adjustForm, transactionType: e.target.value })}
                  className="w-full border border-[#EAEAEA] px-4 py-3 text-sm text-[#111111] focus:outline-none focus:border-[#111111] bg-white"
                >
                  <option value="import">Nhập hàng</option>
                  <option value="adjustment">Điều chỉnh</option>
                  <option value="cancel">Hoàn hàng</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">Ghi chú</label>
                <textarea
                  value={adjustForm.note}
                  onChange={(e) => setAdjustForm({ ...adjustForm, note: e.target.value })}
                  className="w-full border border-[#EAEAEA] px-4 py-3 text-sm text-[#111111] focus:outline-none focus:border-[#111111] resize-none"
                  rows={2}
                  placeholder="Lý do điều chỉnh..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustTarget(null)}
                  className="flex-1 py-3 border border-[#EAEAEA] text-sm text-gray-500 hover:text-[#111111] hover:border-[#111111] transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={adjusting || adjustForm.changeAmount === 0}
                  className="flex-1 py-3 bg-[#111111] text-white text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  {adjusting ? "Đang lưu..." : "Xác nhận"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
