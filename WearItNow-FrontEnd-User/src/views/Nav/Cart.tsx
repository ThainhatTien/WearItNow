import React, { useId, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { CartItem } from "../../stores/Cart";
import { showToast } from "../../components/CustomToast";
import { useLocation } from "react-router-dom";

interface CartProps {
  isOpen: boolean; // Trạng thái mở giỏ hàng
  onClose: () => void; // Hàm xử lý đóng giỏ hàng
  items: CartItem[];
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items }) => {
  const { cartItems, removeFromCart, updateCartItem } = useCart();
  const userId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
    // Đóng giỏ hàng khi đường dẫn thay đổi
    onClose();
  }, [location.pathname]); // Lắng nghe sự thay đổi đường dẫn

  // Tính tổng cho các sản phẩm được chọn
  const selectedTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (!isOpen) return null; // Không hiển thị nếu giỏ hàng không mở

  return (
    <div className="fixed right-0 top-0 w-96 bg-white shadow-lg h-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Giỏ hàng ({cartItems.length})
        </h2>
        <button className="text-gray-500" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      {cartItems.length === 0 ? (
        <p className="text-gray-600 mb-4">Giỏ hàng rỗng</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between mb-4"
            >
              <img src={item.image} alt={item.name} className="h-12 w-12" />
              <div className="flex-1 ml-4">
                <p className="text-gray-800">{item.name}</p>
                <p className="text-gray-800">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.price!)}
                </p>
                <p>
                  Số lượng:
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) =>
                      updateCartItem(
                        Number(item.productId),
                        Number(e.target.value)
                      )
                    }
                    className="w-16 mx-2"
                  />
                </p>
              </div>
              {userId && token ? (
                <button
                  onClick={() => removeFromCart(Number(item.productId))}
                  className="text-red-500"
                >
                  Xóa
                </button>
              ) : (
                <button
                  onClick={() => removeFromCart(Number(item.productId))}
                  className="text-red-500"
                >
                  Xóa
                </button>
              )}
            </div>
          ))}
        </>
      )}
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-800">Tổng</p>
        <p className="text-gray-800">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(selectedTotal)}
        </p>
      </div>
      <Link
        to="/payproduct"
        className="w-full bg-red-500 text-white p-2 rounded"
      >
        Thanh toán
      </Link>
    </div>
  );
};

export default Cart; // Xuất component Cart
