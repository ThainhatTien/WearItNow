import {Result} from "../result/Result";
import {Response} from "../response/Response";
import { toast } from "react-toastify";

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
function showToast(message: string, type: "success" | "error" | "info" = "info") {
  // Implementation for showing toast notification
  switch(type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    default:
      toast.info(message);
  }
}

// Function to check if the cart is empty and show a toast if it is
function checkCartAndNotify(cartItems: CartItem[]) {
  if (cartItems.length === 0) {
    showToast("Vui lòng chọn sản phẩm", "info"); // Notify user to select a product
  }
}