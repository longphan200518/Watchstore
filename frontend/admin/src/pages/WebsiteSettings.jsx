import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import {
  getAllSettingsByCategory,
  updateSetting,
  bulkUpdateSettings,
  createSetting,
  deleteSetting,
} from "../services/websiteSettingsService";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";

// Category icons và màu sắc
const categoryConfig = {
  General: {
    icon: "mdi:information",
    color: "blue",
    description: "Thông tin chung của website",
  },
  Branding: {
    icon: "mdi:palette",
    color: "purple",
    description: "Logo, màu sắc và nhận diện thương hiệu",
  },
  Homepage: {
    icon: "mdi:home",
    color: "green",
    description: "Nội dung trang chủ và hero section",
  },
  Navigation: {
    icon: "mdi:menu",
    color: "indigo",
    description: "Menu điều hướng và thanh tìm kiếm",
  },
  Footer: {
    icon: "mdi:page-layout-footer",
    color: "gray",
    description: "Thông tin footer và social links",
  },
  SEO: {
    icon: "mdi:search-web",
    color: "orange",
    description: "Tối ưu hóa công cụ tìm kiếm",
  },
  Features: {
    icon: "mdi:feature-search",
    color: "pink",
    description: "Bật/tắt các tính năng",
  },
};

export default function WebsiteSettings() {
  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Quản lý sản phẩm", path: "/products" },
    { label: "Quản lý đơn hàng", path: "/orders" },
    { label: "Quản lý thương hiệu", path: "/brands" },
    { label: "Quản lý người dùng", path: "/users" },
    { label: "Quản lý đánh giá", path: "/reviews" },
    { label: "Cài đặt Website", path: "/website-settings" },
  ];

  const [settingsByCategory, setSettingsByCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [editedSettings, setEditedSettings] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSetting, setNewSetting] = useState({
    key: "",
    value: "",
    description: "",
    category: "General",
    dataType: "text",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await getAllSettingsByCategory();
      if (response.success) {
        setSettingsByCategory(response.data || []);
        // Expand all categories by default
        const expanded = {};
        response.data.forEach((cat) => {
          expanded[cat.category] = true;
        });
        setExpandedCategories(expanded);
      } else {
        setError("Không tải được cài đặt");
      }
    } catch (err) {
      setError("Lỗi khi tải cài đặt");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleInputChange = (key, value) => {
    setEditedSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSetting = async (key, currentValue, description) => {
    const newValue = editedSettings[key];
    if (newValue === undefined || newValue === currentValue) {
      return;
    }

    try {
      setSaving(true);
      const response = await updateSetting(key, {
        value: newValue,
        description: description,
      });

      if (response.success) {
        // Remove from edited settings
        setEditedSettings((prev) => {
          const updated = { ...prev };
          delete updated[key];
          return updated;
        });
        fetchSettings();
      } else {
        alert(response.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      alert("Lỗi khi lưu cài đặt");
    } finally {
      setSaving(false);
    }
  };

  const handleBulkSave = async () => {
    if (Object.keys(editedSettings).length === 0) {
      alert("Không có thay đổi nào để lưu");
      return;
    }

    try {
      setSaving(true);
      const response = await bulkUpdateSettings(editedSettings);

      if (response.success) {
        setEditedSettings({});
        fetchSettings();
        alert("Đã lưu tất cả thay đổi");
      } else {
        alert(response.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      alert("Lỗi khi lưu cài đặt");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSetting = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await createSetting(newSetting);

      if (response.success) {
        setShowAddModal(false);
        setNewSetting({
          key: "",
          value: "",
          description: "",
          category: "General",
          dataType: "text",
        });
        fetchSettings();
      } else {
        alert(response.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      alert("Lỗi khi tạo cài đặt");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSetting = async (key) => {
    if (!confirm("Bạn có chắc muốn xóa cài đặt này?")) return;

    try {
      const response = await deleteSetting(key);
      if (response.success) {
        fetchSettings();
      } else {
        alert("Không thể xóa cài đặt");
      }
    } catch (err) {
      alert("Lỗi khi xóa cài đặt");
    }
  };

  const renderInput = (setting) => {
    const currentValue =
      editedSettings[setting.key] !== undefined
        ? editedSettings[setting.key]
        : setting.value;

    switch (setting.dataType) {
      case "textarea":
        return (
          <textarea
            value={currentValue}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        );

      case "boolean":
        return (
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={currentValue === "true" || currentValue === true}
              onChange={(e) =>
                handleInputChange(setting.key, e.target.checked.toString())
              }
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              {currentValue === "true" || currentValue === true ? "Bật" : "Tắt"}
            </span>
          </label>
        );

      case "color":
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={currentValue}
              onChange={(e) => handleInputChange(setting.key, e.target.value)}
              className="w-16 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={currentValue}
              onChange={(e) => handleInputChange(setting.key, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      case "number":
        return (
          <input
            type="number"
            value={currentValue}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case "image":
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={currentValue}
              onChange={(e) => handleInputChange(setting.key, e.target.value)}
              placeholder="Nhập URL hình ảnh..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {currentValue && (
              <div className="relative bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                <div className="flex items-center justify-center min-h-[120px]">
                  <img
                    src={currentValue}
                    alt={setting.key}
                    className="max-h-32 object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="hidden flex-col items-center text-gray-400">
                    <Icon icon="mdi:image-broken" className="text-4xl mb-2" />
                    <span className="text-sm">Không thể tải hình ảnh</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Preview
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={currentValue}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar navItems={navItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="Cài đặt Website" />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header Actions */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    ⚙️ Cài đặt Website
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Tùy chỉnh giao diện và nội dung trang web của bạn
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
                  >
                    <Icon icon="mdi:plus-circle" className="text-xl" />
                    Thêm mới
                  </button>
                  {Object.keys(editedSettings).length > 0 && (
                    <button
                      onClick={handleBulkSave}
                      disabled={saving}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition shadow-md hover:shadow-lg flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed animate-pulse"
                    >
                      <Icon icon="mdi:content-save-all" className="text-xl" />
                      Lưu tất cả ({Object.keys(editedSettings).length})
                    </button>
                  )}
                </div>
              </div>

              {/* Info Banner */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon
                    icon="mdi:information"
                    className="text-2xl text-blue-600 mt-0.5"
                  />
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Mẹo:</span> Click vào từng
                      category để mở rộng và chỉnh sửa settings. Thay đổi sẽ
                      được highlight màu cam cho đến khi bạn lưu.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Icon
                  icon="mdi:loading"
                  className="text-4xl text-blue-600 animate-spin"
                />
              </div>
            ) : error ? (
              <div className="text-red-600 text-center py-8">{error}</div>
            ) : (
              <div className="space-y-4">
                {settingsByCategory.map((category) => (
                  <div
                    key={category.category}
                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(category.category)}
                      className="w-full px-6 py-5 flex items-center justify-between hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-lg bg-${
                            categoryConfig[category.category]?.color || "blue"
                          }-100 flex items-center justify-center`}
                        >
                          <Icon
                            icon={
                              categoryConfig[category.category]?.icon ||
                              "mdi:cog"
                            }
                            className={`text-2xl text-${
                              categoryConfig[category.category]?.color || "blue"
                            }-600`}
                          />
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-gray-900">
                              {category.category}
                            </h2>
                            <span className="px-2.5 py-0.5 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                              {category.settings.length}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {categoryConfig[category.category]?.description ||
                              "Cấu hình các thiết lập"}
                          </p>
                        </div>
                      </div>
                      <Icon
                        icon={
                          expandedCategories[category.category]
                            ? "mdi:chevron-down"
                            : "mdi:chevron-right"
                        }
                        className="text-3xl text-gray-400"
                      />
                    </button>

                    {/* Category Content */}
                    {expandedCategories[category.category] && (
                      <div className="px-6 pb-6 pt-2 space-y-4 bg-gray-50">
                        {category.settings.map((setting) => (
                          <div
                            key={setting.key}
                            className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <code className="text-sm font-mono font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200">
                                    {setting.key}
                                  </code>
                                  <span className="text-xs font-medium text-gray-600 bg-gradient-to-r from-gray-100 to-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
                                    {setting.dataType}
                                  </span>
                                </div>
                                {setting.description && (
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {setting.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    handleSaveSetting(
                                      setting.key,
                                      setting.value,
                                      setting.description
                                    )
                                  }
                                  disabled={
                                    saving ||
                                    editedSettings[setting.key] === undefined ||
                                    editedSettings[setting.key] ===
                                      setting.value
                                  }
                                  className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent transition"
                                  title="Lưu thay đổi"
                                >
                                  <Icon
                                    icon="mdi:content-save"
                                    className="text-xl"
                                  />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteSetting(setting.key)
                                  }
                                  className="p-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-800 transition"
                                  title="Xóa setting"
                                >
                                  <Icon icon="mdi:delete" className="text-xl" />
                                </button>
                              </div>
                            </div>
                            <div className="mt-3">{renderInput(setting)}</div>
                            {editedSettings[setting.key] !== undefined &&
                              editedSettings[setting.key] !== setting.value && (
                                <div className="mt-3 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                                  <div className="flex items-center gap-2 text-sm text-orange-700">
                                    <Icon
                                      icon="mdi:alert-circle"
                                      className="text-lg"
                                    />
                                    <span className="font-medium">
                                      Có thay đổi chưa lưu
                                    </span>
                                  </div>
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Setting Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Thêm cài đặt mới</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Icon icon="mdi:close" className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleAddSetting} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key *
                </label>
                <input
                  type="text"
                  value={newSetting.key}
                  onChange={(e) =>
                    setNewSetting({ ...newSetting, key: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value *
                </label>
                <input
                  type="text"
                  value={newSetting.value}
                  onChange={(e) =>
                    setNewSetting({ ...newSetting, value: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={newSetting.description}
                  onChange={(e) =>
                    setNewSetting({
                      ...newSetting,
                      description: e.target.value,
                    })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục *
                </label>
                <select
                  value={newSetting.category}
                  onChange={(e) =>
                    setNewSetting({ ...newSetting, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="General">General</option>
                  <option value="Branding">Branding</option>
                  <option value="Homepage">Homepage</option>
                  <option value="Navigation">Navigation</option>
                  <option value="Footer">Footer</option>
                  <option value="SEO">SEO</option>
                  <option value="Features">Features</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kiểu dữ liệu *
                </label>
                <select
                  value={newSetting.dataType}
                  onChange={(e) =>
                    setNewSetting({ ...newSetting, dataType: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="text">Text</option>
                  <option value="textarea">Textarea</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="color">Color</option>
                  <option value="image">Image</option>
                  <option value="json">JSON</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {saving ? "Đang lưu..." : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
