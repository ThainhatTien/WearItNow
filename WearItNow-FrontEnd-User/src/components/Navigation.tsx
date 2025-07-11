import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logocutbg.png";
import Cart from "../views/Nav/Cart";
import SearchBar from "../views/Nav/Search";
import { CategoriesResult, Category } from "../stores/Category";
import { fetchCategories } from "../services/CategoryApi";
import VN from "../assets/images/vn.jpg";
import EN from "../assets/images/en.png";
import { useCart } from "../context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faShoppingCart,
  faUser,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "./LoadingSpinner";
import { encodeId } from "../utils/crypto";
const Navigation: React.FC = () => {
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [language, setLanguage] = useState("VN");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to handle menu toggle
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const newArrivals = [
    "Hàng mới về",
    "Statement Simplicity",
    "Beyond the beach",
  ];
  const featured = ["Giá tốt"];

  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const closeCart = () => setIsCartOpen(false);
  const toggleSearch = () => setIsSearchVisible((prev) => !prev);
  const handleCloseSearch = () => setIsSearchVisible(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const handleUserDashboardClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/userdashboard");
    } else {
      navigate("/login");
    }
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "VN" ? "EN" : "VN"));
  };

  const renderCategories = (categories: Category[]) => {
    return (
      <div className="container mx-auto py-8">
        <ul className="flex justify-center space-x-2">
          {categories.map((category) => (
            <li key={category.categoryId} className="group">
              <Link
                to={`/category/${category.slug}`}
                className="font-bold uppercase hover:text-blue-400  hover:border-b-2 border-blue-400"
              >
                {category.parentId === null && (
                  <>{category.name || "Không có tên"}</>
                )}
              </Link>

              {category.subCategories.length > 0 && (
                <div className="absolute left-0 top-full w-full bg-white shadow-lg z-20 opacity-0 invisible translate-y-[-10px] group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-500 ease-in-out">
                  <div className="mx-auto max-w-7xl p-6">
                    {/* <div className="grid grid-cols-4 gap-8"> */}
                    {/* <div>
                        <h3 className="font-bold text-gray-800 mb-4">
                          Hàng mới về
                        </h3>
                        <ul className="space-y-2">
                          {newArrivals.map((item) => (
                            <li key={item}>
                              <a
                                className="text-gray-600 hover:text-red-600"
                                href="#"
                              >
                                {item}
                              </a>
                            </li>
                          ))}
                        </ul>
                        <h3 className="font-bold text-gray-800 mt-8 mb-4">
                          Nổi bật
                        </h3>
                        <ul className="space-y-2">
                          {featured.map((item) => (
                            <li key={item}>
                              <a
                                className="text-gray-600 hover:text-red-600"
                                href="#"
                              >
                                {item}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div> */}

                    <div>
                      {/* <h3 className="font-bold text-gray-800 mb-4">
                        Danh mục sản phẩm
                      </h3> */}
                      <ul className="grid grid-cols-4 gap-x-32 gap-y-4">
                        {category.subCategories.map((subCategory) => (
                          <li key={subCategory.categoryId} className="">
                            <Link
                              to={`/${category.slug}/${
                                subCategory.slug
                              }/${encodeId(subCategory.categoryId)}`}
                              className="block w-screen text-gray-700 hover:text-blue-500"
                            >
                              {subCategory.name || "Không có tên"}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* </div> */}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data: CategoriesResult = await fetchCategories();
        if (data.code === 1000) {
          setCategories(data.result.data);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {
        setError("Không thể tải danh mục");
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed bg-white shadow-md py-9 px-6 md:px-10 flex w-full justify-between items-center h-16 z-10 duration-300 transition-all ${
        isScrolled ? "top-0" : ""
      }`}
    >
      <div className="flex justify-start items-center">
        <Link to="/" className="flex justify-center items-center">
          <img
            src={logo}
            alt="logo"
            className="rounded-full w-10 h-10 object-cover"
          />
          <span className="ml-2 font-bold xl:text-xl hover:text-blue-500 md:hidden lg:block">
            WEARITNOW
          </span>
        </Link>
      </div>

      <ul
        className={`flex justify-center items-center space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6 ${
          isMenuOpen
            ? "flex-col absolute bg-white top-16 left-0 w-full shadow-md md:flex-row md:static md:space-x-2"
            : "hidden md:flex"
        }`}
      >
        {loading ? (
          <LoadingSpinner fullscreen={true} />
        ) : error ? (
          <li>{error}</li>
        ) : categories.length > 0 ? (
          renderCategories(categories)
        ) : (
          <li>Không có danh mục nào.</li>
        )}
      </ul>

      <div className="flex justify-end items-center space-x-3 sm:space-x-4">
        <div className="relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="cursor-pointer hover:text-blue-500"
            onClick={toggleSearch}
            aria-label="Search"
          />
          {isSearchVisible && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg z-50">
              <SearchBar onClose={handleCloseSearch} />
            </div>
          )}
        </div>

        <div className="relative">
          <FontAwesomeIcon
            icon={faShoppingCart}
            className="cursor-pointer hover:text-blue-500"
            onClick={toggleCart}
            aria-label="Shopping Cart"
          />
          {cartItems.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1">
              {cartItems.length}
            </span>
          )}
          <Cart isOpen={isCartOpen} onClose={closeCart} items={cartItems} />
        </div>

        <div
          className="cursor-pointer flex items-center"
          onClick={toggleLanguage}
        >
          <img
            src={language === "VN" ? VN : EN}
            alt={language === "VN" ? "Vietnamese" : "English"}
            className="w-5 h-5 mr-1"
          />
          {language}
        </div>

        <FontAwesomeIcon
          icon={faUser}
          className="cursor-pointer hover:text-blue-500"
          aria-label="User Dashboard"
          onClick={handleUserDashboardClick}
        />

        <div
          className="md:hidden flex items-center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FontAwesomeIcon
            icon={faBars}
            className="cursor-pointer text-gray-600"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
