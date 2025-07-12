import React, { useState, useEffect } from "react";
import { Product } from "../../stores/Product";
import { fetchDiscountedProducts } from "../../services/ProductApi";
import { encodeId } from "../../utils/crypto";
import { Link } from "react-router-dom";
import { showToast } from "../../components/CustomToast";
import ProductCard from "../ProductCart";
import { useNavigate } from "react-router-dom";
import FadeInSlideUp from "../../components/FadeInSlideUp";
import useProductView from "../../hooks/RecentlyViewed";
import CartApi, { addItemToCart } from "../../services/CartApi";
import { CartItem, CartItemServer } from "../../stores/Cart";

const FlastSaleProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { handleProductClick } = useProductView();

  // Hàm xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async (cartItem: CartItem) => {
    try {
      // Use the cartItem from ProductCard component
      const userId = localStorage.getItem("userId");
      if (!userId) {
        showToast("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng", "info");
        navigate("/login");
        return;
      }
      
      const cartItemServer: CartItemServer = {
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        size: cartItem.size,
        color: cartItem.color
      };
      
      await addItemToCart(cartItemServer, Number(userId));
      showToast("Sản phẩm đã được thêm vào giỏ hàng!", "success");
    } catch (error) {
      // Xử lý lỗi khi thêm sản phẩm vào giỏ hàng
      showToast("Không thể thêm sản phẩm vào giỏ hàng", "error");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetchDiscountedProducts(1, 8);
        setProducts(data.result.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching discounted products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Flash Sale
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div
              key={product.productId}
              className="relative"
              onClick={() => handleProductClick(product)}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <Link to={`/product/${product.name}/${encodeId(product.productId)}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.discountRate > 0 && (
                      <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs font-bold">
                        -{product.discountRate}%
                      </div>
                    )}
                  </Link>
                </div>
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlastSaleProducts;
