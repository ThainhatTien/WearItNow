import React, { useState, useEffect } from "react";
import { showToast } from "../components/CustomToast";
import {
  fetchDiscountedProducts,
  fetchFavoriteCount,
  fetchProducts,
  fetchProductsAddedInLastMonth,
  fetchProductsWithCategoryId,
  fetchTopSellingProducts,
} from "../services/ProductApi"; // Hàm gọi API để lấy sản phẩm
import { ProductsResult, Product as ProductType } from "../stores/Product"; // Định nghĩa kiểu sản phẩm
import { Pagination, Slider, Button, Tooltip } from "antd"; // Import các component từ Ant Design
import { useCart } from "../context/CartContext"; // Import useCart từ context
import { CartItem as CartItemType } from "../stores/Cart"; // Import CartItem từ CartContext
import ProductCard from "../views/ProductCart";
import LoadingSpinner from "../components/LoadingSpinner";
import { colors } from "../stores/Color";
import { sizes } from "../stores/Size";
import { Category } from "../stores/Category";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { decodeId } from "../utils/crypto";
import debounce from "lodash/debounce";

// Component ProductPage
const ProductPage: React.FC = () => {
  // State quản lý sản phẩm, lỗi, trạng thái loading và các bộ lọc
  const [products, setProducts] = useState<ProductType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(8);
  const { addToCart } = useCart();
  const [isFiltered, setIsFiltered] = useState<boolean>(false); // Kiểm tra khi nào lọc được áp dụng
  const [categories, setCategories] = useState<Category[]>([]);
  // State cho bộ lọc
  const [maxPrice, setMaxPrice] = useState<number | null>(2000000);
  const [minPrice, setMinPrice] = useState<number | null>(1000);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedProductSize, setSelectedProductSize] = useState<string | null>(
    null
  );
  const [showMoreColors, setShowMoreColors] = useState(false);
  const [showMoreSizes, setShowMoreSizes] = useState(false);
  const [sortBy, setSortBy] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const { encodedId } = useParams<{ encodedId: string }>();

  const handleShowMoreSizes = () => {
    setShowMoreSizes(!showMoreSizes);
  };

  const handleShowMoreColors = () => {
    setShowMoreColors(!showMoreColors);
  };

  // Hàm thiết lập bộ lọc
  const buildFilters = () => {
    const filters: { [key: string]: any } = {};
    if (maxPrice !== null && maxPrice !== 0) filters.maxPrice = maxPrice;
    if (minPrice !== null && minPrice !== 0) filters.minPrice = minPrice;
    if (selectedColor !== null) filters.color = selectedColor;
    if (selectedProductSize !== null) filters.productSize = selectedProductSize;
    return filters;
  };

  // Bỏ lọc
  const handleClearFilters = () => {
    setSelectedColor(null);
    setSelectedProductSize(null);
    setMinPrice(1);
    setMaxPrice(2000000);
    setIsFiltered(false); // Đặt lại trạng thái lọc
    setCurrentPage(1); // Đặt lại về trang 1 khi làm mới bộ lọc
    loadProducts(); // Tải lại sản phẩm mặc định
  };

  // Hàm xử lý thay đổi giá
  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setMinPrice(value[0]);
      setMaxPrice(value[1]);
    }
  };

  // Hàm xử lý màu sắc
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  // Hàm xử lý kích thước
  const handleSizeChange = (size: string) => {
    setSelectedProductSize(size);
  };

  // Hàm xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = (cartItem: CartItemType) => {
    addToCart(cartItem);
    showToast("Thêm vào giỏ hàng thành công", "success");
  };

  // Hàm gọi API để lấy danh sách sản phẩm
  const loadProducts = async () => {
    setLoading(true);

    // Kiểm tra và giải mã categoryId từ encodedId
    let updatedCategoryId = categoryId;
    if (encodedId) {
      const decodedId = decodeId(encodedId);
      const id = Number(decodedId);

      // Chỉ thay đổi categoryId nếu nó khác với current categoryId
      if (id !== updatedCategoryId) {
        updatedCategoryId = id;
      }
    } else {
      updatedCategoryId = null; // Không có encodedId, thiết lập lại categoryId nếu cần
    }

    // Cập nhật lại categoryId nếu có sự thay đổi
    if (updatedCategoryId !== categoryId) {
      setCategoryId(updatedCategoryId);
    }

    try {
      // Xây dựng filters từ trạng thái isFiltered
      const filters = isFiltered ? buildFilters() : {};

      let products: ProductsResult;

      // Kiểm tra xem categoryId có hợp lệ hay không
      if (updatedCategoryId !== null) {
        // Gọi API để lấy sản phẩm theo categoryId
        products = await fetchProductsWithCategoryId(
          updatedCategoryId,
          currentPage,
          pageSize,
          filters,
          sortBy
        );
      } else {
        // Gọi API lấy tất cả sản phẩm nếu không có categoryId
        products = await fetchProducts(currentPage, pageSize, filters, sortBy);
      }

      if (products.code === 1000) {
        // Lưu trữ kết quả nếu thành công
        setProducts(products.result.data);
        setTotalPages(products.result.totalPages);
        setPageSize(products.result.pageSize);
      } else {
        // Hiển thị thông báo lỗi nếu không thể tải sản phẩm
        showToast("Không tải được danh sách sản phẩm", "error");
      }
    } catch (error) {
      // Xử lý lỗi khi không thể gọi API
      showToast("Không tải được danh sách sản phẩm", "error");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi trang
  const onChange = (page: number) => {
    setCurrentPage(page);
  };

  // Hàm lọc sản phẩm khi nhấn nút "Lọc"
  const handleFilter = () => {
    setIsFiltered(true); // Đặt trạng thái lọc thành true
    setCurrentPage(1); // Đặt lại trang về 1 khi lọc
    loadProducts(); // Tải lại sản phẩm dựa trên bộ lọc
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const onSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
    setCurrentPage(1); // Reset to first page on sort change
    loadProducts(); // Reload products with new sort criteria
  };

  useEffect(() => {
    loadProducts(); // Chỉ gọi loadProducts khi categoryId khác null
  }, [categoryId, currentPage, isFiltered, sortBy]); // Chạy lại khi trang hoặc trạng thái lọc thay đổi

  // Hàm debounce cho các thay đổi trang hoặc bộ lọc
  const debouncedLoadProducts = debounce(loadProducts, 500);

  // Nếu có thay đổi, gọi hàm debounce thay vì gọi trực tiếp loadProducts
  useEffect(() => {
    debouncedLoadProducts();
  }, [currentPage, isFiltered, sortBy]);

  return (
    <div className="px-4 py-4 sm:px-10 sm:py-10">
      <div className="flex flex-col sm:flex-row items-start justify-between">
        <div className="text-2xl font-bold mb-4 sm:mb-0">Sản phẩm</div>
        <div className="mb-4 sm:mb-0">
          <label htmlFor="">Sắp xếp theo </label>
          <select className="p-1" onChange={onSortChange} value={sortBy}>
            <option value="name_asc">Tên A-Z</option>
            <option value="name_desc">Tên Z-A</option>
            <option value="price_asc">Giá Từ Thấp Đến Cao</option>
            <option value="price_desc">Giá Từ Cao Đến Thấp</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row">
        {/* Bộ lọc */}
        <div className="w-full sm:w-1/4 p-4 border-r mb-4 sm:mb-0">
          <div className="text-lg font-bold mb-2">
            <FontAwesomeIcon
              className="mr-1"
              icon={faFilter}
              style={{ color: "#63E6BE" }}
            />
            Bộ lọc
          </div>

          {/* Màu sắc */}
          <div className="mb-4">
            <div className="font-semibold mb-2">Màu sắc</div>
            <div className="grid grid-cols-4 sm:grid-cols-3 xl:grid-cols-4 gap-2 text-center mx-4">
              {colors
                .slice(0, showMoreColors ? colors.length : 4)
                .map((color) => (
                  <div
                    key={color.hex}
                    className={`w-9 h-9 rounded-full cursor-pointer ${
                      selectedColor === color.name
                        ? "border-4 border-blue-500"
                        : ""
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => handleColorChange(color.name)}
                  />
                ))}
            </div>
            <button
              className="text-blue-500 mt-2"
              onClick={handleShowMoreColors}
            >
              {showMoreColors ? "Ẩn bớt" : "Hiển thị thêm"}
            </button>
          </div>

          {/* Kích thước */}
          <div className="mb-4">
            <div className="font-semibold mb-2">Kích thước</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mx-4">
              {sizes.slice(0, showMoreSizes ? sizes.length : 4).map((size) => (
                <div
                  key={size}
                  className={`p-2 bg-white border rounded text-center cursor-pointer ${
                    selectedProductSize === size ? "bg-blue-200" : ""
                  }`}
                  onClick={() => handleSizeChange(size)}
                >
                  {size}
                </div>
              ))}
            </div>
            <button
              className="text-blue-500 mt-2"
              onClick={handleShowMoreSizes}
            >
              {showMoreSizes ? "Ẩn bớt" : "Hiển thị thêm"}
            </button>
          </div>

          {/* Khoảng giá */}
          <div className="mb-4">
            <div className="flex justify-between">
              <div className="font-semibold mb-2">Khoảng giá</div>
              <div>
                {formatCurrency(minPrice || 0)} -{" "}
                {formatCurrency(maxPrice || 0)}
              </div>
            </div>

            <Slider
              range
              step={10000}
              value={[minPrice ?? 0, maxPrice ?? 0]}
              min={1000}
              max={2000000}
              tooltip={{ open: false }}
              onChange={handlePriceChange}
            />
          </div>

          {/* Nút lọc */}
          <div className="mb-4 flex justify-between">
            <Button
              className="bg-red-500 text-white hover:bg-white hover:text-red-500"
              onClick={handleClearFilters}
            >
              Bỏ lọc
            </Button>
            <Button
              className="bg-green-500 text-white hover:bg-white hover:text-green-500"
              onClick={handleFilter}
            >
              Lọc
            </Button>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="w-full sm:w-5/6 ps-5 h-full">
          {loading ? (
            <div className="flex justify-center">
              <LoadingSpinner fullscreen={true} />
            </div>
          ) : error ? (
            <div>Không tải được danh sách sản phẩm. Vui lòng thử lại!</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <div key={product.productId} className="mb-1">
                  <ProductCard
                    onAddToCart={handleAddToCart}
                    product={product}
                  />
                </div>
              ))}
            </div>
          )}
          <Pagination
            showSizeChanger={false}
            current={currentPage}
            total={totalPages * pageSize}
            pageSize={pageSize}
            className="justify-center pt-5"
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage; // Xuất component
