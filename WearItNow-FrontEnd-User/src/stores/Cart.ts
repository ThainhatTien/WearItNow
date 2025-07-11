import {Result} from "../result/Result";
import {Response} from "../response/Response";

export interface CartItem {
  productId: number; // ID của sản phẩm
  name: string; // Tên sản phẩm
  price: number; // Giá sản phẩm
  image: string; // Hình ảnh sản phẩm
  quantity: number; // Số lượng sản phẩm trong giỏ hàng
  size:  string; //size của sản phẩm
  color: string; //màu của sản phẩm
}

export interface CartItemServer {
  productId: number;
  quantity: number;
  size: string;
  color: string;
}

// Kết quả cho phản hồi giỏ hàng
export type CartResult = Response<Result<CartItem[]>>;
// Phản hồi đơn giản cho giỏ hàng
export type CartResponse = Response<CartItem[]>;

// Function to show a toast notification
function showToast(message: string) {
  // Implementation for showing toast notification
  console.log(message); // Replace with actual toast logic
}

// Function to check if the cart is empty and show a toast if it is
function checkCartAndNotify(cartItems: CartItem[]) {
  if (cartItems.length === 0) {
    showToast("Vui lòng chọn sản phẩm"); // Notify user to select a product
  }
}