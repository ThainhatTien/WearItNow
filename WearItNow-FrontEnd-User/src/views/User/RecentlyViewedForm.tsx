import React, { useEffect, useState } from "react";
import { Product } from "../../stores/Product";
import { Link } from "react-router-dom";

const RecentlyViewedForm: React.FC = () => {
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<
    Product[]
  >([]);

  useEffect(() => {
    // Khi component được render, lấy dữ liệu sản phẩm đã xem từ localStorage
    const viewedProducts = localStorage.getItem("productView");

    if (viewedProducts) {
      // Parse chuỗi JSON từ localStorage thành mảng sản phẩm
      setRecentlyViewedProducts(JSON.parse(viewedProducts));
    }
  }, []);

  return (
    <section className="bg-white p-6 shadow rounded ml-6 h-full">
      <h2 className="text-xl font-semibold mb-4">Sản phẩm đã xem gần đây</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recentlyViewedProducts.length === 0 ? (
          <p className="text-gray-500 col-span-full">
            Bạn chưa có sản phẩm đã xem nào.
          </p>
        ) : (
          recentlyViewedProducts.slice(0, 6).map((product) => (
            <div
              key={product.productId}
              className="p-4 border rounded shadow-sm transition-transform transform hover:scale-105 hover:shadow-xl hover:border-gray-300"
            >
              <Link to={`/products/productdetail/${product.productId}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover mb-2"
                />
                <p className="text-center text-sm">{product.name}</p>
                <p className="text-center font-bold">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price!)}
                </p>
              </Link>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default RecentlyViewedForm;
