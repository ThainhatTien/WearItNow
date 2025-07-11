import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem } from "../stores/Cart";
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  clearCartInDatabase,
  getUserCart,
} from "../services/CartApi";

// Khởi tạo context
const CartContext = createContext<{
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateCartItem: (productId: number, quantity: number) => void;
  clearCart: () => void;
}>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartItem: () => {},
  clearCart: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const userId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");

  // Hàm lưu giỏ hàng vào sessionStorage
  const saveCartToSessionStorage = (items: CartItem[]) => {
    sessionStorage.setItem("cart", JSON.stringify(items));
  };

  const fetchCartFromServer = async () => {
    if (userId && token) {
      try {
        const userCart = await getUserCart(userId);
        if (userCart?.code === 1000) {
          const serverCart = Array.isArray(userCart.result)
            ? userCart.result
            : [];
          setCartItems(serverCart);
          saveCartToSessionStorage(serverCart);
        }
      } catch (error) {
        console.error("Lỗi khi tải giỏ hàng từ server:", error);
      }
    }
  };

  // Lấy giỏ hàng từ server khi người dùng đã đăng nhập
  useEffect(() => {
    fetchCartFromServer();
  }, [userId, token]);

  // Xử lý thêm sản phẩm vào giỏ hàng
  const addToCart = async (item: CartItem) => {
    if (userId && token) {
      try {
        await addItemToCart(item, userId);
        fetchCartFromServer();
      } catch (error) {
        console.error("Lỗi khi thêm sản phẩm vào database:", error);
      }
    }

    setCartItems((prevItems) => {
      const updatedCart = [...prevItems];
      const existingItem = updatedCart.find(
        (i) => i.productId === item.productId
      );
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        updatedCart.push(item);
      }
      saveCartToSessionStorage(updatedCart);
      return updatedCart;
    });
  };

  // Xử lý xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (productId: number) => {
    if (userId && token) {
      try {
        // Lấy giỏ hàng từ sessionStorage hoặc localStorage
        const savedCart = JSON.parse(sessionStorage.getItem("cart") || "[]");
        const itemToRemove = savedCart.find(
          (item: CartItem) => item.productId === productId
        );
        if (itemToRemove) {
          const cartItemId = itemToRemove.cartItemId; // Lấy cartItemId
          await removeItemFromCart(cartItemId, userId);
          fetchCartFromServer();
        }
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm khỏi database:", error);
      }
    }

    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter(
        (item) => item.productId !== productId
      );
      saveCartToSessionStorage(updatedCart);
      return updatedCart;
    });
  };

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  const updateCartItem = async (
    productId: number,
    quantity: number,
    item?: CartItem
  ) => {
    if (userId && token) {
      if (!item) {
        console.error("Sản phẩm không hợp lệ");
        return; // Nếu item không tồn tại, dừng hàm và không gọi API
      }
      try {
        await addItemToCart(item, userId);
      } catch (error) {
        console.error(
          "Lỗi khi cập nhật số lượng sản phẩm trong database:",
          error
        );
      }
    }

    setCartItems((prevItems) => {
      const updatedCart = prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      saveCartToSessionStorage(updatedCart);
      return updatedCart;
    });
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    setCartItems([]);
    saveCartToSessionStorage([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook để sử dụng CartContext
export const useCart = () => useContext(CartContext);
