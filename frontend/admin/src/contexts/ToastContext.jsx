import { createContext, useContext, useState, useCallback } from "react";
import { Icon } from "@iconify/react";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message, duration) => {
      showToast(message, "success", duration);
    },
    [showToast]
  );

  const error = useCallback(
    (message, duration) => {
      showToast(message, "error", duration);
    },
    [showToast]
  );

  const warning = useCallback(
    (message, duration) => {
      showToast(message, "warning", duration);
    },
    [showToast]
  );

  const info = useCallback(
    (message, duration) => {
      showToast(message, "info", duration);
    },
    [showToast]
  );

  const value = {
    showToast,
    success,
    error,
    warning,
    info,
    removeToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

const Toast = ({ toast, onClose }) => {
  const { message, type } = toast;

  const styles = {
    success: {
      bg: "bg-gradient-to-r from-green-500 to-emerald-500",
      icon: "mdi:check-circle",
      iconColor: "text-white",
    },
    error: {
      bg: "bg-gradient-to-r from-red-500 to-pink-500",
      icon: "mdi:alert-circle",
      iconColor: "text-white",
    },
    warning: {
      bg: "bg-gradient-to-r from-yellow-500 to-orange-500",
      icon: "mdi:alert",
      iconColor: "text-white",
    },
    info: {
      bg: "bg-gradient-to-r from-blue-500 to-cyan-500",
      icon: "mdi:information",
      iconColor: "text-white",
    },
  };

  const style = styles[type] || styles.info;

  return (
    <div
      className={`${style.bg} text-white px-6 py-4 rounded-lg shadow-2xl pointer-events-auto 
        transform transition-all duration-300 ease-out animate-slideInRight
        hover:scale-105 flex items-center gap-3 min-w-[320px] max-w-[480px]`}
    >
      <Icon
        icon={style.icon}
        className={`text-2xl ${style.iconColor} flex-shrink-0`}
      />
      <p className="flex-1 font-medium">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors"
      >
        <Icon icon="mdi:close" className="text-xl" />
      </button>
    </div>
  );
};

// Add to your global CSS or Tailwind config
// @keyframes slideInRight {
//   from {
//     transform: translateX(100%);
//     opacity: 0;
//   }
//   to {
//     transform: translateX(0);
//     opacity: 1;
//   }
// }
