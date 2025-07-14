// services/cartApi.ts
import axios from "axios";
import {CartResult, CartItemServer} from "../stores/Cart";

const API_BASE_URL = 'localhost:8080/api/v0/cart'; // Thay đổi URL này theo API của bạn

// Function to add a product to cart by productId and quantity
// This is used by the product components
const addToCart = async (productId: number, quantity: number = 1) => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      throw new Error("User is not logged in");
    }
    
    // Create a default cart item with minimal required info
    const cartItem: CartItemServer = {
      productId,
      quantity,
      size: "M", // Default size, will be updated in modal
      color: "Black" // Default color, will be updated in modal
    };
    
    await addItemToCart(cartItem, Number(userId));
    return true;
  } catch (error) {
    throw new Error("Failed to add item to cart");
  }
};

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

export default addToCart;
