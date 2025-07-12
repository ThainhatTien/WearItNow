import React, { useState, useEffect } from "react";
import { Product } from "../../stores/Product";
import { fetchProductsAddedInLastMonth } from "../../services/ProductApi";
import { encodeId } from "../../utils/crypto";
import { Link } from "react-router-dom";
import { showToast } from "../../components/CustomToast";
import ProductCard from "../ProductCart";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Navigate, useNavigate } from "react-router-dom";
import CartApi, { addItemToCart } from "../../services/CartApi";
import { CartItem, CartItemServer } from "../../stores/Cart";

const NewProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

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
        const data = await fetchProductsAddedInLastMonth(1, 8);
        setProducts(data.result.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching new products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Sản Phẩm Mới
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div
              key={product.productId}
              className="relative cursor-pointer text-center"
              onClick={() => navigate(`/product/${product.name}/${encodeId(product.productId)}`)}
            >
              <ProductCard product={product} onAddToCart={handleAddToCart} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewProducts;
