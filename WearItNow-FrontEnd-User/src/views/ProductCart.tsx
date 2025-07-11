import React, { useEffect, useState } from "react";
import { Product as ProductType } from "../stores/Product";
import { CartItem as CartItemType } from "../stores/Cart";
import { Button, Image, Modal, Carousel } from "antd";
import { Link } from "react-router-dom";
import { showToast } from "../components/CustomToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faEye,
  faHeart,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import detai1 from "../assets/images/icon/detail1.webp";
import detai2 from "../assets/images/icon/detail2.webp";
import detai3 from "../assets/images/icon/detail3.webp";
import detai4 from "../assets/images/icon/detail4.webp";
import detai5 from "../assets/images/icon/detail5.webp";
import detai6 from "../assets/images/icon/detail6.webp";
import {
  addToFavorites,
  getUserFavorites,
  removeFromFavorites,
} from "../services/ProductFavoriteApi";
import { encodeId } from "../utils/crypto";

// Định nghĩa kiểu dữ liệu cho props của ProductCard
interface ProductCardProps {
  product: ProductType;
  onAddToCart: (cartItem: CartItemType) => void; // Hàm gọi để thêm sản phẩm vào giỏ hàng
}

// Component để hiển thị thông tin sản phẩm
const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false); // Trạng thái hover
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isProductDetail, setIsProductDetail] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(product?.image); // Hình lớn
  const [averageRate, setAverageRate] = useState<number>(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [userId, setUserId] = useState<number | null>(null);

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

  // useEffect(() => {
  //   //hàm gọi để lấy đánh giá của sản phẩm
  //   const fetchEvaluete = async () => {
  //     try {
  //       const data = await fetchProductReviews(product.productId);
  //       setAverageRate(data.result.averageRate);
  //     } catch (error) {
  //       console.log("Không thể tải đánh giá trung bình");
  //     }
  //   };
  //   fetchEvaluete();
  // }, [product.productId]);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl); // Thay đổi hình lớn khi click vào hình nhỏ
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(Number(storedUserId));
      checkFavoriteStatus(Number(storedUserId)); // Kiểm tra trạng thái yêu thích khi có userId
    }
  }, []);

  // Kiểm tra sản phẩm có trong danh sách yêu thích của người dùng
  const checkFavoriteStatus = async (userId: number) => {
    try {
      const response = await getUserFavorites(userId); // Giả sử getUserFavorites là một hàm API để lấy danh sách yêu thích
      const favorites = response.result || []; // Lấy trường 'result' từ response

      // Kiểm tra xem favorites có phải là mảng không
      if (Array.isArray(favorites)) {
        const isFavoriteProduct = favorites.some(
          (fav: any) => fav.product.productId === product.productId
        );
        setIsFavorite(isFavoriteProduct);
      } else {
        console.error("Dữ liệu yêu thích không phải là mảng:", favorites);
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái yêu thích:", error);
    }
  };

  // Hàm xử lý thêm/xóa sản phẩm khỏi danh sách yêu thích
  const handleFavoriteToggle = async () => {
    if (!userId) {
      // Nếu không có userId, điều hướng đến trang đăng nhập
      navigate("/login");
      return;
    }

    try {
      // Thêm hoặc xóa sản phẩm khỏi yêu thích
      if (isFavorite) {
        await removeFromFavorites(userId, product.productId);
        showToast("Đã xóa khỏi danh sách yêu thích", "success");
      } else {
        await addToFavorites(userId, product.productId);
        showToast("Đã thêm vào danh sách yêu thích", "success");
      }

      // Sau khi thay đổi, kiểm tra lại trạng thái yêu thích
      checkFavoriteStatus(userId);
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái yêu thích:", error);
      showToast("Không thể thay đổi trạng thái yêu thích", "error");
    }
  };

  const toggleModal = () => {
    setIsProductDetail(false);
  };

  const showProductDetail = () => {
    setIsProductDetail(true);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      const missingSelection = !selectedSize ? "size" : "color";
      showToast(`Vui lòng chọn ${missingSelection}`, "info");
      isModalOpen ? setIsModalOpen(false) : setIsProductDetail(false);
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

    onAddToCart(cartItem);
    isModalOpen ? setIsModalOpen(false) : setIsProductDetail(false);
    setSelectedColor(null);
    setSelectedSize(null);
    navigate("/payproduct");
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      const missingSelection = !selectedSize ? "size" : "color";
      showToast(`Vui lòng chọn ${missingSelection}`, "info");
      isModalOpen ? setIsModalOpen(false) : setIsProductDetail(false);
      setSelectedColor(null);
      setSelectedSize(null);
      return;
    }

    const cartItem: CartItemType = {
      productId: product.productId,
      name: product.name || "",
      price: product.price || 0,
      image: product.image || "",
      quantity: 1,
      size: selectedSize,
      color: selectedColor,
    };

    onAddToCart(cartItem);
    isModalOpen ? setIsModalOpen(false) : setIsProductDetail(false);
    setSelectedColor(null);
    setSelectedSize(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedColor(null);
    setSelectedSize(null);
  };

  const handleSizeSelection = (size: string) => {
    setSelectedSize(size);
  };

  const handleColorSelection = (color: string) => {
    setSelectedColor(color);
  };

  const availableSizes = Array.from(
    new Set(
      product.inventories
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

  const hasDiscount = product.discountRate && product.discountRate > 0;

  return (
    <div>
      <div
        className="relative justify-center rounded items-center transition-transform duration-300 transform hover:scale-110" // Thiết lập kiểu dáng cho component
        onMouseEnter={() => setIsHovered(true)} // Đặt trạng thái hover khi chuột vào
        onMouseLeave={() => setIsHovered(false)} // Đặt trạng thái hover khi chuột rời
      >
        {/* Hình ảnh sản phẩm */}
        <Link to={`/product/${product.name}/${encodeId(product.productId)}`}>
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-64 h-48"
          />
        </Link>

        <div className="bg-white p-2">
          <Link to={`/product/${product.name}/${encodeId(product.productId)}`}>
            <p className="text-center mt-2">{product.name}</p>{" "}
            {/* Tên sản phẩm */}
            <p className="text-center font-bold">
              {hasDiscount ? (
                <>
                  <span className="text-red-500">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price!)}
                  </span>

                  <br />
                  <div className="">
                    <span className="line-through text-gray-500">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.originalPrice!)}
                    </span>
                    <span className="text-red-500">
                      {"    "}-{product.discountRate}%
                    </span>
                  </div>
                </>
              ) : (
                new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.price!)
              )}
            </p>
          </Link>
          <div className="mb-2 text-center">
            {[...Array(5)].map((_, index) => (
              <FontAwesomeIcon
                key={index}
                icon={faStar}
                className={
                  index < product.averageRate
                    ? "text-yellow-500"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
        </div>

        {/* Nút thêm vào giỏ hàng chỉ hiển thị khi hover */}
        {isHovered && (
          <>
            <div className="flex justify-center overflow-hidden">
              <div className="absolute bottom-2/4 left-0 right-0 py-2 flex flex-nowrap justify-center transition-opacity duration-300 ease-in-out opacity-100">
                <button
                  className={`text-black border rounded-md p-2 m-1 transition-colors duration-300 ease-in-out transform hover:scale-105 ${
                    isFavorite
                      ? "bg-pink-500 text-white hover:bg-pink-600" // Thêm hiệu ứng hover cho màu hồng
                      : "bg-white hover:bg-black hover:text-white"
                  }`}
                  onClick={handleFavoriteToggle}
                >
                  <FontAwesomeIcon icon={faHeart} />
                </button>
                <button
                  className="text-black border rounded-md p-2 m-1 bg-white hover:bg-black hover:text-white transition-colors duration-300 ease-in-out transform hover:scale-105"
                  onClick={showModal}
                >
                  <FontAwesomeIcon icon={faCartShopping} />
                </button>
                <button
                  className="text-black border rounded-md p-2 m-1 bg-white hover:bg-black hover:text-white transition-colors duration-300 ease-in-out transform hover:scale-105"
                  onClick={showProductDetail}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
              </div>
            </div>
          </>
        )}
        <Modal
          title="Chọn kích cỡ và màu sắc"
          open={isModalOpen}
          onOk={handleAddToCart}
          onCancel={handleCancel}
          okText="Thêm vào giỏ hàng"
          cancelText="Hủy"
        >
          <div className="justify-center items-center relative">
            <div className="flex items-center space-x-4 mb-2">
              <span className="text-gray-500">Kích cỡ: </span>
              {availableSizes.map((size) => (
                <button
                  key={size}
                  className={`border border-gray-300 px-2 py-1 mr-2 ${
                    selectedSize === size
                      ? "bg-gray-400 text-gray-700 hover:border-cyan-400 border-2 border-transparent"
                      : "bg-gray-50 hover:bg-gray-200"
                  }`}
                  onClick={() => handleSizeSelection(size)}
                >
                  {size}
                </button>
              ))}
              {/* {availableSizes.map((size) => (
              <Button
                key={size}
                onClick={() => handleSizeSelection(size)}
                className={`px-4 py-2 rounded ${
                  selectedSize === size
                    ? "bg-gray-400 text-gray-700 hover:border-cyan-400 border-2 border-transparent"
                    : "bg-gray-50 hover:bg-gray-200"
                }`}
                disabled={
                  !product.inventories.some(
                    (inv) => inv.size === size && inv.quantity > 0
                  )
                }
              >
                {size}
              </Button>
            ))} */}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-500">Màu sắc: </span>
              {availableColors.map((color) => {
                if (handleColorDisplay(color)) {
                  return (
                    <button
                      key={color}
                      className={`border rounded-full ${
                        selectedColor === color
                          ? "border-black"
                          : "border-gray-300"
                      } w-8 h-8 mr-2 ${
                        selectedColor === color ? "bg-blue-500" : ""
                      }`}
                      onClick={() => handleColorSelection(color)}
                      style={{ backgroundColor: color }}
                    />
                  );
                }
                return null; // không hiển thị màu nếu không có sẵn
              })}
              {/* {product.inventories
              .filter(
                (inventory) =>
                  inventory.quantity > 0 && inventory.size === selectedSize
              ) // Lọc ra các màu có sẵn và đúng kích cỡ
              .map((inventory) => (
                <button
                  key={inventory.productInventoryId}
                  className={`border ${
                    selectedColor === inventory.color
                      ? "border-black"
                      : "border-gray-300"
                  } w-8 h-8 mr-2 ${
                    selectedColor === inventory.color ? "bg-blue-500" : ""
                  }`}
                  onClick={() => handleColorSelection(inventory.color)}
                  style={{ backgroundColor: inventory.color }}
                />
              ))} */}
            </div>
          </div>
        </Modal>

        <Modal
          // title="Chi tiet san pham"
          open={isProductDetail}
          onCancel={() => toggleModal()}
          footer={null}
          width={700}
        >
          <div className="p-5">
            <div className="grid grid-cols-2 grid-rows-1 gap-5">
              <div className="col-1">
                {/* Hình lớn */}
                <div className="justify-items-center items-center">
                  <div className="w-full">
                    <Image
                      src={selectedImage || product.image}
                      alt={product.name}
                    />
                  </div>
                </div>

                {/* Slider hình nhỏ */}
                <div className="justify-items-center items-center mt-3 gap-4">
                  <div className="w-3/4">
                    {product &&
                    Array.isArray(product.images) &&
                    product.images.length > 0 ? (
                      <Carousel
                        arrows={true}
                        dots={false}
                        slidesToShow={2}
                        autoplay={false}
                      >
                        {product.images.map((image) => (
                          <div
                            key={image.imageId}
                            className="flex justify-center cursor-pointer"
                            onClick={() => handleImageClick(image.imageUrl)} // Khi click, thay đổi hình lớn
                          >
                            <Image
                              src={image.imageUrl}
                              alt={`Product image ${image.imageId}`}
                              width={80}
                              height={80}
                              preview={false} // Tắt chế độ xem trước
                              className={`${
                                selectedImage === image.imageUrl
                                  ? "border-2 border-blue-500"
                                  : "border border-gray-300"
                              } rounded`}
                            />
                          </div>
                        ))}
                      </Carousel>
                    ) : (
                      <p>Không có hình ảnh cho sản phẩm này.</p> // Thông báo khi không có hình ảnh
                    )}
                  </div>
                </div>
              </div>
              <div className="col-1">
                <div className="flex items-center">
                  <span className="bg-green-500 text-white px-2 py-1 text-xs">
                    MỚI
                  </span>
                </div>
                <h1 className="text-xl font-bold mb-2">{product.name}</h1>
                <p className="text-red-500 text-2xl font-bold mb-2">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price!)}
                </p>
                <div className="mb-4">
                  <span className="text-gray-500">Kích thước: </span>
                  <div className="flex">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        className={`border border-gray-300 px-2 py-1 mr-2 ${
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
                  <div className="flex">
                    {availableColors.map((color) => {
                      if (handleColorDisplay(color)) {
                        return (
                          <button
                            key={color}
                            className={`border rounded-full ${
                              selectedColor === color
                                ? "border-black"
                                : "border-gray-300"
                            } w-8 h-8 mr-2 ${
                              selectedColor === color ? "bg-blue-500" : ""
                            }`}
                            onClick={() => handleColorSelection(color)}
                            style={{ backgroundColor: color }}
                          />
                        );
                      }
                      return null; // không hiển thị màu nếu không có sẵn
                    })}
                  </div>
                </div>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-gray-500 mb-2">
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
                      onChange={handleQuantityChange} // Đảm bảo rằng sự kiện này được gán đúng
                      className="border border-gray-300 rounded-md p-2 w-16 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <h2 className="font-bold">Mô tả sản phẩm</h2>
                  <p className="text-gray-700">{product.description}</p>
                </div>
                <div className="mb-4">
                  <button
                    onClick={() => handleBuyNow()}
                    className="bg-red-500 text-white px-4 py-2 mr-2 border rounded-md hover:bg-white hover:text-red-500"
                  >
                    MUA HÀNG
                  </button>
                  <button
                    onClick={() => handleAddToCart()}
                    className="bg-blue-500 text-white px-4 py-2 border rounded-md hover:bg-white hover:text-blue-500"
                  >
                    THÊM VÀO GIỎ HÀNG
                  </button>
                </div>
              </div>
              <div className="col-span-2"></div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ProductCard;
