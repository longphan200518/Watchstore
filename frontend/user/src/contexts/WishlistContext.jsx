import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    // Kiểm tra xem user có đăng nhập không
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        message: "Vui lòng đăng nhập để thêm vào danh sách yêu thích",
      };
    }

    if (!wishlist.find((item) => item.id === product.id)) {
      setWishlist([...wishlist, product]);
      return { success: true, message: "Đã thêm vào danh sách yêu thích" };
    }
    return {
      success: false,
      message: "Sản phẩm đã có trong danh sách yêu thích",
    };
  };

  const removeFromWishlist = (productId) => {
    setWishlist(wishlist.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const getTotalWishlist = () => {
    return wishlist.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getTotalWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};
