import React, { useState, useEffect } from "react";
import { showToast } from "../components/CustomToast";
import { useParams } from "react-router-dom";
import { fetchSlugCategories } from "../services/CategoryApi";
import { fetchProductBySlug } from "../services/ProductApi";
import Slider from "react-slick";
import {
  CategoriesResponse,
  Category as CategoryType,
} from "../stores/Category";
import { ProductsResponse, Product as ProductType } from "../stores/Product";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useCart } from "../context/CartContext"; // Import useCart t? context
import { CartItem as CartItemType } from "../stores/Cart"; // Import CartItem t? CartContext
import ProductCard from "../views/ProductCart";
import LoadingSpinner from "../components/LoadingSpinner";
import { message } from "antd";

// Component Category
const Category: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductType[]>([]);
  const { addToCart } = useCart(); // L?y h?m addToCart t? context

  // H?m x? l? th?m s?n ph?m v?o gi? h?ng
  const handleAddToCart = (cartItem: CartItemType) => {
    addToCart(cartItem); // Th?m s?n ph?m v?o gi? h?ng
    showToast("Th?m v?o gi? h?ng th?nh c?ng", "success");
  };

  // Load c?c SubCategory theo Category
  useEffect(() => {
    const loadCategory = async () => {
      if (!slug) {
        showToast("Lỗi không tải được danh mục", "error");
        return;
      }
      try {
        const data: CategoriesResponse = await fetchSlugCategories(slug);
        if (data.code === 1000 && data.result.length > 0) {
          setCategory(data.result[0]); // Set the first category
        } else {
          showToast("Lỗi không tải được danh mục", "error");
        }
      } catch {
        showToast("Lỗi không tải được danh mục", "error");
      }
    };

    loadCategory();
  }, [slug]);

  // load s?n ph?m theo SubCategory
  useEffect(() => {
    const loadProducts = async () => {
      if (!slug) {
        showToast("Lỗi không tải được sản phẩm", "error");
        return;
      }
      setLoading(true);
      try {
        const data: ProductsResponse = await fetchProductBySlug(slug);
        if (data.code === 1000) {
          setProducts(data.result);
        } else {
          showToast("Lỗi không tải được sản phẩm", "error");
        }
      } catch {
        showToast("Lỗi không tải được sản phẩm", "error");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [slug]);

  // Tr?ng th?i ?ang t?i ho?c l?i
  if (loading) {
    return (
      <div className="text-center">
        <LoadingSpinner fullscreen={true} />
      </div>
    );
  }

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-gray-100 px-20 py-10">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">BẠN CẦN TÌM</h1>
        <CategoryDetails category={category} />
      </div>
      <hr />
      <ProductSection products={products} onAddToCart={handleAddToCart} />
    </div>
  );
};

// Component hi?n th? chi SubCategory
const CategoryDetails: React.FC<{ category: CategoryType | null }> = ({
  category,
}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-gray-100 px-20 py-10">
      {category && category.subCategories.length > 0 ? (
        <Slider {...settings}>
          {category.subCategories?.map((subCategory) => (
            <div
              className="flex flex-col items-center"
              key={subCategory.categoryId}
            >
              <div className="p-3 mx-9">
                <i className="fa-thin fa-shirt"></i>
              </div>
              <span className="mt-2 text-lg">{subCategory.name}</span>
            </div>
          ))}
        </Slider>
      ) : (
        <p>Kh?ng c? danh m?c con n?o.</p>
      )}
    </div>
  );
};

// Component hi?n th? s?n ph?m theo SubCategory
const ProductSection: React.FC<{
  products: ProductType[];
  onAddToCart: (cartItem: CartItemType) => void;
}> = ({ products, onAddToCart }) => {
  if (products.length === 0) {
    return <p className="text-center">Kh?ng c? s?n ph?m n?o.</p>;
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  };

  // Nh?m s?n ph?m theo danh m?c
  const productsByCategory: { [key: string]: ProductType[] } = {};
  products.forEach((product) => {
    const categoryId = product.category?.categoryId; // Ki?m tra categoryId c? t?n t?i
    if (categoryId) {
      if (!productsByCategory[categoryId]) {
        productsByCategory[categoryId] = [];
      }
      productsByCategory[categoryId].push(product);
    }
  });

  return (
    <div className="p-4">
      {Object.keys(productsByCategory).length > 0 ? (
        Object.keys(productsByCategory)?.map((categoryId) => {
          const categoryProducts = productsByCategory[categoryId];
          const categoryName = categoryProducts[0]?.category?.name; // Ki?m tra categoryName
          const image = categoryProducts[0]?.category?.image;

          return (
            <div key={categoryId} className="mb-8">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <h2 className="text-xl font-bold mb-4">{categoryName}</h2>
                  <img src={image} alt="" className="w-full h-auto" />
                </div>
                <div className="col-span-3 ml-5 ">
                  <Slider {...settings}>
                    {productsByCategory[categoryId].map((product, index) => (
                      <div className="flex flex-col items-center mx-5 pt-10">
                        <div className="mx-2">
                          <ProductCard
                            key={index}
                            product={product}
                            onAddToCart={onAddToCart}
                          />
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center">Kh?ng c? s?n ph?m n?o theo danh m?c.</p>
      )}
    </div>
  );
};

export default Category;
