import React, { useState, useEffect } from "react";
import { showToast } from "../../components/CustomToast";
import { fetchProductsAddedInLastMonth } from "../../services/ProductApi";
import { ProductsResult } from "../../stores/Product";
import LoadingBarComponent from "../../components/LoadingBarComponent";
import { useCart } from "../../context/CartContext";
import { CartItem as CartItemType } from "../../stores/Cart";
import ProductCard from "../ProductCart";
import useProductView from "../../hooks/RecentlyViewed";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Navigate, useNavigate } from "react-router-dom";

const NewProducts: React.FC = () => {
  // Khởi tạo các state
  const [products, setProducts] = useState<any[]>([]); // Danh sách sản phẩm
  const [error, setError] = useState<string | null>(null); // Thông báo lỗi
  const [progress, setProgress] = useState<number>(0); // Tiến độ thanh loading
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading
  const { addToCart } = useCart(); // Lấy hàm addToCart từ context
  const { handleProductClick } = useProductView();
  const navigate = useNavigate();

  // Hàm để cập nhật tiến độ thanh loading
  const updateProgress = (value: number) => {
    setProgress(value);
  };

  // Hàm xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = (cartItem: CartItemType) => {
    try {
      addToCart(cartItem); // Thêm sản phẩm vào giỏ hàng
      showToast("Thêm vào giỏ hàng thành công", "success");
    } catch (error) {
      console.log("Lỗi Khi thêm sản phẩm vào giỏ hàng", error);
      showToast("Thêm vào giỏ hàng thất bại", "error");
    }
  };

  // Hàm gọi API để tải sản phẩm
  useEffect(() => {
    const loadProductsAddedInLastMonth = async () => {
      setLoading(true); // Bắt đầu loading
      updateProgress(0); // Đặt tiến độ ban đầu

      try {
        const data: ProductsResult = await fetchProductsAddedInLastMonth(1, 10); // Gọi API để lấy dữ liệu sản phẩm
        if (data.code === 1000) {
          setProducts(data.result.data); // Cập nhật danh sách sản phẩm chỉ với 8 sản phẩm đầu tiên
          updateProgress(100); // Đặt tiến độ hoàn thành
        } else {
          throw new Error("Không thể tải sản phẩm");
        }
      } catch (error) {
        setError("Không thể tải sản phẩm"); // Cập nhật thông báo lỗi
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    loadProductsAddedInLastMonth(); // Gọi hàm tải sản phẩm
  }, []); // Không cần updateProgress ở đây

  if (loading) {
    return (
      <div>
        <LoadingSpinner fullscreen={true} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 font-bold">{error}</div>;
  }

  const handleProductNews = () => {
    navigate("/products");
  };

  return (
    <>
      {/* Thanh loading hiển thị ở đầu trang */}
      <LoadingBarComponent progress={progress} />

      <section className="px-4 py-8">
        {/* Hiển thị thông báo lỗi nếu có */}
        {error ? (
          <div className="text-red-500 text-center">{error}</div> // Hiển thị thông báo lỗi
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <div
                key={product.productId}
                className="relative cursor-pointer text-center"
                onClick={() => handleProductClick(product)}
              >
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center items-center my-5">
          <button
            onClick={handleProductNews}
            className="font-bold bg-black text-white border rounded-md text-center px-4 py-2 hover:text-black hover:bg-white"
          >
            Xem Chi Tiết
          </button>
        </div>
      </section>
    </>
  );
};

export default NewProducts;
