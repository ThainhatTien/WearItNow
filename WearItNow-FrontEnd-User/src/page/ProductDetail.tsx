import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faStar } from "@fortawesome/free-solid-svg-icons";
import { showToast } from "../components/CustomToast";
import {
  fetchProductById,
  fetchProductReviews,
  fetchProductsWithCategoryId,
  sendComment,
} from "../services/ProductApi"; // Hàm gọi API để lấy sản phẩm
import {
  ProductsResult,
  ProductResponse,
  Product as ProductType,
} from "../stores/Product"; // Định nghĩa kiểu sản phẩm
import { useNavigate } from "react-router-dom";
import detai1 from "../assets/images/icon/detail1.webp";
import detai2 from "../assets/images/icon/detail2.webp";
import detai3 from "../assets/images/icon/detail3.webp";
import detai4 from "../assets/images/icon/detail4.webp";
import detai5 from "../assets/images/icon/detail5.webp";
import detai6 from "../assets/images/icon/detail6.webp";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Import useCart từ context
import { CartItem as CartItemType } from "../stores/Cart";
import LoadingSpinner from "../components/LoadingSpinner"; // Import CartItem từ CartContext
import { Image } from "antd";
import Slider from "react-slick";
import {
  addToFavorites,
  getUserFavorites,
  removeFromFavorites,
} from "../services/ProductFavoriteApi";
import { Comment } from "../stores/ProductComents";
import { decodeId, encodeId } from "../utils/crypto";
import { Link } from "react-router-dom";

const ProductDetail: React.FC = () => {
  const { encodedId } = useParams<{ encodedId: string }>(); // Lấy productId từ URL
  const [loading, setLoading] = useState<boolean>(true); // State quản lý trạng thái loading
  const [product, setProduct] = useState<ProductType | null>(null); // State lưu sản phẩm
  const [error, setError] = useState<string | null>(null); // State lưu thông báo lỗi
  const { addToCart } = useCart(); // Lấy hàm addToCart từ context
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(product?.image); // Hình lớn
  const [activeTab, setActiveTab] = useState("1");
  const [productId, setProductId] = useState<number>(-1);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const tabs = [
    {
      title: "Mô Tả Sản Phẩm",
      key: "1",
      content: (
        <DescriptionProduct
          description={product?.description ?? "Mô tả không có sẵn"}
        />
      ),
      icon: faInfoCircle,
      color: "#FFD43B",
    },
    {
      title: "Đánh Giá Sản Phẩm",
      key: "2",
      content: <ProductReviews productId={productId} userId={Number(userId)} />,
      icon: faStar,
      color: "#FF6347",
    },
  ];

  // Hàm xử lý thay đổi số lượng
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (inputValue === "") {
      setSelectedQuantity(1);
      return;
    }
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      const boundedValue = Math.max(1, Math.min(availableQuantity, value));
      setSelectedQuantity(boundedValue);
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl); // Thay đổi hình lớn khi click vào hình nhỏ
  };

  const handleBuyNow = (product: ProductType) => {
    if (!selectedSize || !selectedColor) {
      const missingSelection = !selectedSize ? "size" : "color";
      showToast(`Vui lòng chọn ${missingSelection}`, "info");
      setSelectedColor(null);
      setSelectedSize(null);
      return;
    }
    const cartItem: CartItemType = {
      productId: product.productId,
      name: product.name || "",
      price: product.price || 0,
      image: product.image || "",
      quantity: selectedQuantity,
      size: selectedSize,
      color: selectedColor,
    };
    addToCart(cartItem); // Thêm sản phẩm vào giỏ hàng
    showToast("Vui lòng điền thông tin cá nhân", "success");
    setSelectedColor(null);
    setSelectedSize(null);
    navigate("/payproduct");
  };

  // Hàm xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = (product: ProductType) => {
    if (!selectedSize || !selectedColor) {
      const missingSelection = !selectedSize ? "size" : "color";
      showToast(`Vui lòng chọn ${missingSelection}`, "info");
      setSelectedColor(null);
      setSelectedSize(null);
      return;
    }

    const cartItem: CartItemType = {
      productId: product.productId,
      name: product.name || "",
      price: product.price || 0,
      image: product.image || "",
      quantity: selectedQuantity,
      size: selectedSize,
      color: selectedColor,
    };
    addToCart(cartItem); // Thêm sản phẩm vào giỏ hàng
    showToast("Thêm vào giỏ hàng thành công", "success");
    setSelectedColor(null);
    setSelectedSize(null);
  };

  useEffect(() => {
    // Khi selectedSize hoặc selectedColor thay đổi, cập nhật số lượng
    if (selectedSize && selectedColor) {
      const inventory = product?.inventories.find(
        (inventory) =>
          inventory.size === selectedSize && inventory.color === selectedColor
      );
      setAvailableQuantity(inventory ? inventory.quantity : 0);
    }
  }, [selectedSize, selectedColor, product]);

  // Lọc các kích thước có sẵn
  const availableSizes = Array.from(
    new Set(
      product?.inventories
        .filter((inventory) => inventory.quantity > 0)
        .map((inventory) => inventory.size)
    )
  );

  // Lọc các màu sắc có sẵn cho kích thước đã chọn
  const availableColors = Array.from(
    new Set(
      product?.inventories
        .filter((inventory) => inventory.quantity > 0)
        .map((inventory) => inventory.color)
    )
  );

  const handleColorDisplay = (color: string) => {
    // Tìm kiếm từng màu trong inventory để đảm bảo nó có sẵn
    return product?.inventories.some(
      (inventory) => inventory.color === color && inventory.quantity > 0
    );
  };

  // Hàm xử lý khi người dùng chọn kích thước
  const handleSizeSelection = (size: string) => {
    setSelectedSize(size);
  };

  // Hàm xử lý khi người dùng chọn màu
  const handleColorSelection = (color: string) => {
    setSelectedColor(color);
  };

  // Kiểm tra xem id có hợp lệ không
  useEffect(() => {
    const loadProducts = async () => {
      // Kiểm tra xem productId có giá trị không
      if (!encodedId) {
        return;
      }

      // Giải mã ID từ tham số URL
      const decodedId = decodeId(encodedId);
      const id = Number(decodedId);

      if (isNaN(id)) {
        return;
      }
      setProductId(id); // Cập nhật id
      setLoading(true); // Bắt đầu loading
      try {
        const data: ProductResponse = await fetchProductById(id); // Sử dụng id đã chuyển đổi
        if (data.code === 1000) {
          setProduct(data.result); // Lưu sản phẩm vào state
        } else {
          showToast("Không tải được sản phẩm", "error");
        }
      } catch (error) {
        showToast("Không tải được sản phẩm", "error");
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    loadProducts();
  }, [encodedId]);

  // Kiểm tra xem sản phẩm có trong danh sách yêu thích không
  const checkFavorite = async () => {
    if (userId && product) {
      try {
        const favoritesResponse = await getUserFavorites(Number(userId));
        const favorites = favoritesResponse.result; // Đảm bảo lấy đúng mảng favorites từ response

        // Kiểm tra cấu trúc của favorites
        if (Array.isArray(favorites)) {
          // Sử dụng hàm some để kiểm tra xem sản phẩm có trong danh sách yêu thích hay không
          const isProductFavorite = favorites.some(
            (item: { product: ProductType }) =>
              item.product.productId === product.productId
          );
          setIsFavorite(isProductFavorite);
        } else {
          console.error("favorites không phải là mảng:", favorites);
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra yêu thích", error);
      }
    }
  };

  // Thêm sản phẩm vào danh sách yêu thích
  const handleAddToFavorites = async () => {
    if (!userId || !product) return;

    try {
      await addToFavorites(Number(userId), product.productId);
      setIsFavorite(true);
      showToast("Thêm vào yêu thích thành công", "success");
    } catch (error: any) {
      console.error("Lỗi khi thêm vào yêu thích", error.message);
      showToast(
        error.message || "Không thể thêm sản phẩm vào yêu thích",
        "error"
      );
    }
  };

  // Xóa sản phẩm khỏi danh sách yêu thích
  const handleRemoveFromFavorites = async () => {
    if (!userId || !product) return;

    try {
      await removeFromFavorites(Number(userId), product.productId);
      setIsFavorite(false);
      showToast("Đã xóa khỏi yêu thích", "success");
    } catch (error: any) {
      console.error("Lỗi khi xóa khỏi yêu thích", error.message);
      showToast(
        error.message || "Không thể xóa sản phẩm khỏi yêu thích",
        "error"
      );
    }
  };

  // Kiểm tra yêu thích sau khi sản phẩm được tải
  useEffect(() => {
    if (product) {
      checkFavorite();
    }
  }, [product]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };

  if (loading)
    return (
      <div>
        <LoadingSpinner fullscreen={true} />
      </div>
    );
  if (error) return <div>{error}</div>;
  return (
    <>
      {product ? (
        <div className="px-4 sm:px-8 md:px-16 lg:px-20 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2  gap-4">
            <div className="col-1">
              {/* Large image */}
              <div className="justify-items-center items-center">
                <div className="w-full md:w-4/5">
                  <Image
                    src={selectedImage || product.image}
                    alt={product.name}
                  />
                </div>
              </div>

              {/* Small image slider */}
              <div className="justify-items-center items-center mt-3 gap-4">
                <div className="w-full md:w-3/4">
                  <Slider {...settings}>
                    {product.images.map((image) => (
                      <div
                        key={image.imageId}
                        className="flex justify-center cursor-pointer"
                        onClick={() => handleImageClick(image.imageUrl)} // Change large image on click
                      >
                        <img
                          src={image.imageUrl}
                          alt={`Product image ${image.imageId}`}
                          width={80}
                          height={80}
                          className={`w-20 h-20 ${
                            selectedImage === image.imageUrl
                              ? "border-2 border-blue-500"
                              : "border border-gray-300"
                          } rounded`}
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            </div>

            <div className="col-1 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center mb-2">
                <span className="bg-green-500 text-white px-2 py-1 text-xs">
                  MỚI
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold mb-2">
                {product.name}
              </h1>
              <p className="text-red-500 text-xl sm:text-2xl font-bold mb-2">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.price!)}
              </p>
              <div className="mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-2">
                  <div className="col-1">
                    <ul className="list-none">
                      <li className="flex items-center mb-1 h-[66px]">
                        <img src={detai1} className="w-11" />
                        <span>Đổi trả tận nhà trong vòng 15 ngày</span>
                      </li>
                      <li className="flex items-center mb-1 h-[66px]">
                        <img src={detai2} className="w-11" />
                        <span>Miễn phí vận chuyển đơn từ 500K</span>
                      </li>
                      <li className="flex items-center mb-1 h-[66px]">
                        <img src={detai3} className="w-11" />
                        <span>Bảo hành trong vòng 30 ngày</span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-1">
                    <ul className="list-none">
                      <li className="flex items-center mb-1 h-[66px]">
                        <img src={detai4} className="w-11" />
                        <span>Hotline 0287.100.6789 hỗ trợ từ 8h30-24h</span>
                      </li>
                      <li className="flex items-center mb-1 h-[66px]">
                        <img src={detai5} className="w-11" />
                        <span>Giao hàng toàn quốc</span>
                      </li>
                      <li className="flex items-center mb-1 h-[66px]">
                        <img src={detai6} className="w-11" />
                        <span>Có cộng dồn ưu đãi KHTT</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <span className="text-gray-500">Kích thước: </span>
                <div className="flex flex-wrap">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      className={`border border-gray-300 px-2 py-1 mr-2 mb-2 ${
                        selectedSize === size ? "bg-blue-500 text-white" : ""
                      }`}
                      onClick={() => handleSizeSelection(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <span className="text-gray-500">Màu sắc: </span>
                <div className="flex flex-wrap">
                  {availableColors.map((color) => {
                    if (handleColorDisplay(color)) {
                      return (
                        <button
                          key={color}
                          className={`border rounded-full ${
                            selectedColor === color
                              ? "border-black"
                              : "border-gray-300"
                          } w-8 h-8 mr-2 mb-2 ${
                            selectedColor === color ? "bg-blue-500" : ""
                          }`}
                          onClick={() => handleColorSelection(color)}
                          style={{ backgroundColor: color }}
                        />
                      );
                    }
                    return null; // Hide color if unavailable
                  })}
                </div>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-500">
                  Số lượng hiện có:{" "}
                  <span className="font-bold text-gray-800">
                    {availableQuantity}
                  </span>
                </p>
                <div className="flex items-center space-x-2">
                  <label htmlFor="quantity" className="text-gray-700">
                    Chọn số lượng:
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={availableQuantity}
                    value={selectedQuantity}
                    onChange={handleQuantityChange}
                    className="border border-gray-300 rounded-md p-2 w-16 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="">
                <button
                  className="bg-red-500 text-white px-4 py-2 mr-2 border rounded-md hover:bg-white hover:text-red-500"
                  onClick={() => handleBuyNow(product)}
                >
                  MUA HÀNG
                </button>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-500 text-white px-4 py-2 mr-2 border rounded-md hover:bg-white hover:text-blue-500"
                >
                  THÊM VÀO GIỎ HÀNG
                </button>
                <button
                  onClick={
                    isFavorite
                      ? handleRemoveFromFavorites
                      : handleAddToFavorites
                  }
                  className={`${
                    isFavorite
                      ? "bg-red-500 text-white border rounded-md hover:text-red-500 hover:bg-white"
                      : "bg-green-600 text-white border rounded-md hover:text-green-600 hover:bg-white"
                  } text-white px-4 py-2 rounded`}
                >
                  {isFavorite ? "BỎ YÊU THÍCH" : "YÊU THÍCH"}
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-center items-center">
              <div className="tab-titles text-center text-xl sm:text-2xl m-4 font-bold">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 transition-colors duration-300 ease-in-out ${
                      activeTab === tab.key
                        ? "text-black border-b-2 border-red-500"
                        : "text-black hover:border-b-2 border-red-500"
                    }`}
                  >
                    <FontAwesomeIcon
                      className="mr-1"
                      icon={tab.icon}
                      beat
                      style={{ color: tab.color }}
                    />
                    {tab.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="tab-content my-2">
              {tabs.find((tab) => tab.key === activeTab)?.content}
            </div>
          </div>

          <div>
            <SimilarProducts categoryId={product.category.categoryId} />
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <LoadingSpinner fullscreen={true} />
        </div>
      )}
    </>
  );
};

//Hiển thị đánh giá
const ProductReviews: React.FC<{ productId: number; userId: number }> = ({
  productId,
  userId,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [averageRate, setAverageRate] = useState<number>(0);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    // Giả sử API trả về dữ liệu với format như đã cho
    const fetchComments = async () => {
      try {
        const data = await fetchProductReviews(productId); // Thay đổi URL này để lấy từ API của bạn
        setComments(data.result.comments);
        setAverageRate(data.result.averageRate);
      } catch (error) {
        // Xử lý lỗi khi không thể tải bình luận
        setComments([]);
        setAverageRate(0);
      }
    };
    fetchComments();
  }, [productId]);

  const handleRatingChange = (newValue: number) => {
    setRating(newValue);
  };

  const handleReviewChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReview(event.target.value);
  };

  const handleSubmitReview = async () => {
    if (userId == null) {
      showToast("Vui lòng đăng nhập", "info");
    }

    if (rating === 0 || review.trim() === "") {
      alert("Vui lòng chọn đánh giá và nhập bình luận.");
      return;
    }

    const commentData = {
      productId: productId,
      userId: userId,
      rate: rating,
      content: review,
    };

    try {
      await sendComment(commentData); // Gọi hàm sendComment với dữ liệu đã chuẩn bị
      showToast("Bình luận đã được gửi thành công", "success");
      // Reset trạng thái sau khi gửi
      setRating(0);
      setReview("");
    } catch (error) {
      alert("Đã xảy ra lỗi khi gửi bình luận.");
    }
  };

  const renderComments = (comments: Comment[]) => {
    return comments.map((comment) => (
      <div className="flex items-start justify-start">
        <div key={comment.commentId} className="w-full">
          <div className="mb-2 flex flex-col sm:flex-row">
            <div className="mb-2 sm:mb-0">
              <img
                src="https://placehold.co/50x50"
                alt="User Avatar"
                className="rounded-full w-12 h-12" // Adjust image size for responsiveness
              />
            </div>
            <div className="ml-2 flex-1">
              {/* Rating */}
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <FontAwesomeIcon
                    key={index}
                    icon={faStar}
                    className={
                      index < comment.rate ? "text-yellow-500" : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          </div>

          {/* Nested Comments */}
          {comment.comments && comment.comments.length > 0 && (
            <div className="mx-6 my-2 p-3 border rounded-md bg-gray-100">
              {renderComments(comment.comments)} {/* Recursive render */}
            </div>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="px-4 sm:px-8 lg:px-10">
      <div className="mb-3">
        <span className="ml-2 text-3xl sm:text-4xl item-center">
          {averageRate.toFixed(1)} /
          <span className="text-2xl sm:text-3xl"> 5</span>
        </span>
        <div className="flex items-center mb-2 text-2xl sm:text-3xl">
          {[...Array(5)].map((_, index) => (
            <FontAwesomeIcon
              key={index}
              icon={faStar}
              className={
                index < Math.round(averageRate)
                  ? "text-yellow-500"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
      </div>

      <div>{renderComments(comments)}</div>

      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-semibold">
          Viết đánh giá của bạn:
        </h3>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, index) => (
            <FontAwesomeIcon
              key={index}
              icon={faStar}
              className={index < rating ? "text-yellow-500" : "text-gray-300"}
              onClick={() => handleRatingChange(index + 1)}
            />
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <textarea
            className="w-full sm:w-4/5 border border-gray-300 p-2 rounded-md resize-none"
            rows={3}
            placeholder="Viết đánh giá của bạn..."
            value={review}
            onChange={handleReviewChange}
          ></textarea>
          <button
            className="w-full sm:w-1/5 bg-blue-500 text-white px-3 py-2 border rounded-md hover:bg-white hover:text-blue-500 mt-2 sm:mt-0"
            onClick={handleSubmitReview}
          >
            Gửi đánh giá
          </button>
        </div>
      </div>
    </div>
  );
};

const DescriptionProduct: React.FC<{ description: string }> = ({
  description,
}) => {
  return (
    <div className="">
      <p className="text-gray-700 text-center">{description}</p>
    </div>
  );
};

const SimilarProducts: React.FC<{ categoryId: number }> = ({ categoryId }) => {
  const [products, setProducts] = useState<ProductType[]>([]); // Danh sách sản phẩm
  const [error, setError] = useState<string | null>(null); // Thông báo lỗi
  // Hàm gọi API để tải sản phẩm
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data: ProductsResult = await fetchProductsWithCategoryId(
          categoryId,
          1,
          4
        ); // Gọi API để lấy dữ liệu sản phẩm
        if (data.code === 1000) {
          setProducts(data.result.data); // Cập nhật danh sách sản phẩm
        } else {
          throw new Error("Không thể tải sản phẩm");
        }
      } catch (error) {
        setError("Không thể tải sản phẩm"); // Cập nhật thông báo lỗi
      }
    };

    loadProducts(); // Gọi hàm tải sản phẩm
  }, []); // Không cần updateProgress ở đây

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4 text-center">Sản phẩm tương tự</h2>
      <div className="flex justify-between gap-4 flex-wrap">
        {products.map((product, index) => (
          <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/6">
            <Link
              to={`/product/${product.name}/${encodeId(product.productId)}`}
            >
              <img
                src={product.image}
                alt="Similar product 1"
                className="w-full mb-2"
              />
            </Link>
            <Link
              to={`/product/${product.name}/${encodeId(product.productId)}`}
            >
              <p className="text-gray-700 text-center">{product.name}</p>
              <p className="text-red-500 font-bold text-center">
                {product.price}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;
