import React, { useEffect, useState } from "react";
import { Product } from "../../stores/Product"; // Import interface Product
import { getUserFavorites } from "../../services/ProductFavoriteApi";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom

// Định nghĩa kiểu dữ liệu cho response.result
interface FavoriteResponse {
  product: Product;
}

const FavoritesForm: React.FC = () => {
  const [favorites, setFavorites] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false); // Thêm state để theo dõi việc mở rộng/thu gọn

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadFavorites = async () => {
      if (userId) {
        try {
          const response = await getUserFavorites(Number(userId)); // Gọi API để lấy yêu thích
          // Kiểm tra nếu response.result là mảng và chứa các sản phẩm
          if (Array.isArray(response.result)) {
            // Duyệt qua mảng kết quả và lấy đối tượng product
            setFavorites(
              response.result.map((res: FavoriteResponse) => res.product)
            );
          } else {
            setFavorites([]); // Nếu không phải mảng, gán thành mảng rỗng
          }
        } catch (err) {
          setError("Không thể tải danh sách yêu thích.");
        } finally {
          setLoading(false);
        }
      }
    };

    loadFavorites();
  }, [userId]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <section className="bg-white p-6 shadow rounded ml-6 h-full">
      <h2 className="text-xl font-semibold mb-4">Sản phẩm yêu thích</h2>
      {favorites && favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500">Bạn chưa có sản phẩm yêu thích nào.</p>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-hidden transition-all duration-500 ${
            isExpanded ? "max-h-full" : "max-h-[450px]"
          }`}
        >
          {favorites?.map((product) => (
            <div
              key={product.productId}
              className="border p-4 text-center rounded shadow-sm hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
            >
              {/* Link đến trang chi tiết sản phẩm */}
              <Link to={`/products/productdetail/${product.productId}`}>
                {/* Kiểm tra và hiển thị ảnh sản phẩm */}
                <img
                  src={product.image} // Dùng 'image' từ sản phẩm
                  alt={product.name} // Dùng 'name' từ sản phẩm
                  className="w-full h-40 object-cover mb-2 rounded"
                />
                <h3 className="text-lg font-medium">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-green-500 font-semibold">
                  {product.price?.toLocaleString()} VND
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Nút Thu gọn / Xem thêm luôn nằm dưới cùng */}
      {favorites && favorites.length > 3 && (
        <div className="mt-4 flex justify-center w-full">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500 hover:underline self-center"
          >
            {isExpanded ? "Thu gọn" : "Xem thêm"}
          </button>
        </div>
      )}
    </section>
  );
};

export default FavoritesForm;
