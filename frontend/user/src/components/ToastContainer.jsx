import { useEffect } from "react";
import { Icon } from "@iconify/react";
import { useToast } from "../contexts/ToastContext";

export default function ToastContainer() {
 const { toasts, removeToast } = useToast();

 const getTypeStyles = (type) => {
 const baseClass =
 "flex items-center gap-3 px-4 py-3 rounded-lg font-medium";
 switch (type) {
 case "success":
 return `${baseClass} bg-green-100 text-green-800 border border-green-300`;
 case "error":
 return `${baseClass} bg-red-100 text-red-800 border border-red-300`;
 case "warning":
 return `${baseClass} bg-gray-100 text-gray-900 border border-black`;
 case "info":
 default:
 return `${baseClass} bg-blue-100 text-blue-800 border border-blue-300`;
 }
 };

 const getIcon = (type) => {
 switch (type) {
 case "success":
 return "teenyicons:tick-outline";
 case "error":
 return "teenyicons:close-outline";
 case "warning":
 return "teenyicons:alert-outline";
 case "info":
 default:
 return "teenyicons:info-outline";
 }
 };

 return (
 <div className="fixed top-6 right-6 z-50 space-y-2 max-w-md">
 {toasts.map((toast) => (
 <div
 key={toast.id}
 className={`${getTypeStyles(
 toast.type
 )} animate-in fade-in slide-in-from-right-4 duration-300`}
 >
 <Icon icon={getIcon(toast.type)} width={20} />
 <span className="flex-1">{toast.message}</span>
 <button
 onClick={() => removeToast(toast.id)}
 className="ml-2 opacity-70 hover:opacity-100 transition"
 >
 <Icon icon="teenyicons:close-outline" width={16} />
 </button>
 </div>
 ))}
 </div>
 );
}

