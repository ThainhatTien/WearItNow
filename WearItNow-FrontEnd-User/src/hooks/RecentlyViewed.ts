import { useCallback } from "react";
import { Product } from "../stores/Product"; 

const useProductView = () => {
    const handleProductClick = useCallback((product: Product) => {
        try {
            // Lấy danh sách sản phẩm đã xem từ localStorage, nếu không có thì khởi tạo mảng rỗng
            const viewedProducts = JSON.parse(localStorage.getItem("productView") || "[]");
            
            // Kiểm tra nếu sản phẩm đã tồn tại trong lịch sử xem
            const productExists = viewedProducts.some(
                (viewedProduct: Product) => viewedProduct.productId === product.productId
            );

            // Nếu sản phẩm chưa có trong danh sách, thêm vào
            if (!productExists) {
                viewedProducts.push(product);
            }

            // Giới hạn số lượng sản phẩm đã xem là 6 sản phẩm gần nhất
            if (viewedProducts.length > 6) {
                viewedProducts.shift(); // Loại bỏ sản phẩm cũ nhất (ở đầu mảng)
            }

            // Lưu lại danh sách sản phẩm đã xem vào localStorage
            localStorage.setItem("productView", JSON.stringify(viewedProducts));

        } catch (error) {
            console.error("Error when saving product to viewed history:", error);
        }
    }, []);

    return { handleProductClick };
};

export default useProductView;
