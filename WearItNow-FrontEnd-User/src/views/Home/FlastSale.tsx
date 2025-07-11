import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { showToast } from "../../components/CustomToast";
import {
  fetchDiscountedProducts,
  fetchProducts,
} from "../../services/ProductApi";
import { ProductsResult, Product as ProductType } from "../../stores/Product";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LoadingBarComponent from "../../components/LoadingBarComponent";
import { useCart } from "../../context/CartContext"; // Import useCart từ context
import { CartItem as CartItemType } from "../../stores/Cart"; // Import CartItem từ CartContext
import ProductCard from "../ProductCart";
import FadeInSlideUp from "../../components/FadeInSlideUp";
import useProductView from "../../hooks/RecentlyViewed";

const FlastSaleProducts: React.FC = () => {
  // Khởi tạo các state
  const [products, setProducts] = useState<ProductType[]>([]); // Danh sách sản phẩm
  const [error, setError] = useState<string | null>(null); // Thông báo lỗi
  const [progress, setProgress] = useState<number>(0); // Tiến độ thanh loading
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading
  const { addToCart } = useCart(); // Lấy hàm addToCart từ context
  const { handleProductClick } = useProductView();
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

  // Hàm để cập nhật tiến độ thanh loading
  const updateProgress = (value: number) => {
    setProgress(value);
  };

  // Hàm gọi API để tải sản phẩm
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true); // Bắt đầu loading
      updateProgress(0); // Đặt tiến độ ban đầu

      try {
        const data: ProductsResult = await fetchDiscountedProducts(1, 8); // Gọi API để lấy dữ liệu sản phẩm
        if (data.code === 1000) {
          setProducts(data.result.data); // Cập nhật danh sách sản phẩm
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

    loadProducts(); // Gọi hàm tải sản phẩm
  }, []); // Không cần updateProgress ở đây

  // Cấu hình cho Slider
  const settings = {
    dots: false,
    infinite: true,
    speed: 100,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true, // Bật chế độ tự động
    autoplaySpeed: 10000, // Thay đổi sau mỗi 3 giây
    centerPadding: "20px",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      {/* Thanh loading hiển thị ở đầu trang */}
      <LoadingBarComponent progress={progress} />

      <section className="my-3 mx-6 px-3">
        {error ? (
          <div className="text-red-500 text-center mb-4">{error}</div> // Hiển thị thông báo lỗi
        ) : (
          <Slider {...settings} className="w-full">
            {products.map((product, index) => (
              <div key={product.productId} className="px-2">
                <div
                  className="relative cursor-pointer text-center"
                  onClick={() => handleProductClick(product)}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              </div>
            ))}
          </Slider>
        )}
      </section>
    </>
  );
};

export default FlastSaleProducts;
