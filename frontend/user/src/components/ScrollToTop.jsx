import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

export default function ScrollToTop({ isDark = false }) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg ${
            isDark
              ? "bg-amber-600 hover:bg-amber-700 text-white"
              : "bg-amber-600 hover:bg-amber-700 text-white"
          }`}
          aria-label="Scroll to top"
          title="Lên trên cùng"
        >
          <Icon icon="ri:arrow-up-line" width={24} height={24} />
        </button>
      )}
    </>
  );
}
