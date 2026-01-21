import { Icon } from "@iconify/react";

// Full page loading
export const PageLoading = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <Icon
          icon="mdi:loading"
          className="text-6xl text-blue-600 animate-spin mx-auto mb-4"
        />
        <p className="text-gray-600 font-medium">Đang tải...</p>
      </div>
    </div>
  );
};

// Inline loading spinner
export const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl",
  };

  return (
    <Icon
      icon="mdi:loading"
      className={`animate-spin text-blue-600 ${sizes[size]} ${className}`}
    />
  );
};

// Skeleton card for product list
export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="skeleton h-64 w-full"></div>
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-2/3"></div>
        <div className="flex justify-between items-center mt-4">
          <div className="skeleton h-6 w-20"></div>
          <div className="skeleton h-8 w-24"></div>
        </div>
      </div>
    </div>
  );
};

// Skeleton table row
export const SkeletonTableRow = ({ cols = 5 }) => {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="skeleton h-4 w-full"></div>
        </td>
      ))}
    </tr>
  );
};

// Loading button
export const LoadingButton = ({
  loading,
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`relative ${className} ${
        loading ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" className="text-current" />
        </span>
      )}
      <span className={loading ? "opacity-0" : ""}>{children}</span>
    </button>
  );
};

// Empty state
export const EmptyState = ({
  icon = "mdi:inbox",
  title,
  description,
  action,
}) => {
  return (
    <div className="text-center py-12">
      <Icon icon={icon} className="text-6xl text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-6">{description}</p>}
      {action}
    </div>
  );
};
