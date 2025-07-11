// services/cartApi.ts
import axios from "axios";
import {CartResult, CartItemServer} from "../stores/Cart";

const API_BASE_URL = 'https://api.wearltnow.online/v0/cart'; // Thay đổi URL này theo API của bạn

export const getUserCart = async (userId: number): Promise<CartResult | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get?userId=${userId}`);
      return response.data;
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.code === 1025 &&
        error.response.data.message === "Cart Not Found"
      ) {
        return null;
      } else {
        console.error('Error:', error);
        throw error; // Ném lỗi nếu không phải lỗi "Cart Not Found"
      }
    }
  };
  

// export const syncCartToDatabase = async (cartItems: CartItem[]) => {
//     try {
//         await axios.post("/api/cart/sync", { cartItems });
//     } catch (error) {
//         console.error("Error syncing cart:", error);
//     }
// };

export const addItemToCart = async (item: CartItemServer, userId: number) => {
    try {
        await axios.post(`${API_BASE_URL}/save?userId=${userId}`, [item]);
    } catch (error) {
        console.error("Error adding item to cart:", error);
    }
};

export const removeItemFromCart = async (cartItemId: number, userId: number) => {
    try {
        await axios.delete(`${API_BASE_URL}/remove/${cartItemId}?userId=${userId}`);
    } catch (error) {
        console.error("Error removing item from cart:", error);
    }
};

export const updateCartItemQuantity = async (productId: number, quantity: number) => {
    try {
        await axios.put(`${API_BASE_URL}/${productId}`, {quantity});
    } catch (error) {
        console.error("Error updating cart item quantity:", error);
    }
};

export const clearCartInDatabase = async () => {
    try {
        await axios.delete(`${API_BASE_URL}`);
    } catch (error) {
        console.error("Error clearing cart:", error);
    }
};
