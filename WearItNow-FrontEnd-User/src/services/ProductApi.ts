import {
  ProductsResult,
  ProductsResponse,
  ProductResponse,
  ProductFilter,
  Product,
} from "../stores/Product";
import axios from "axios";
import { CommentData, ProductCommentsResponse } from "../stores/ProductComents";
import axiosInstance from "./api.services";

// Cấu hình base URL cho API
const API_BASE_URL = "https://api.wearltnow.online/api";
const API_BASE_URL_LOCAL = "http://localhost:8080/api";

// Hàm tiện ích để gọi API
async function fetchFromAPI<T>(
  endpoint: string,
  params: Record<string, any> = {}
): Promise<T> {
  try {
    const response = await axios.get<T>(`${API_BASE_URL}${endpoint}`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error calling API:", error);
    throw new Error("Không thể tải dữ liệu từ API");
  }
}

// Hàm tổng quát lấy sản phẩm
export async function fetchProducts(
  page?: number | 1,
  size?: number | 8,
  filters?: ProductFilter,
  sortBy?: string,
  additionalParams: Record<string, any> = {}
): Promise<ProductsResult> {
  const params: Record<string, any> = {
    page,
    size,
    ...filters,
    ...additionalParams,
  };

  // Xử lý tham số sortBy
  if (sortBy) {
    const [sortField, sortDirection] = sortBy.split("_");
    params.sortBy = sortField;
    params.sortDirection = sortDirection;
  }

  // Gọi API
  return fetchFromAPI<ProductsResult>("/products", params);
}

// 1. Lấy sản phẩm theo categoryId
export async function fetchProductsWithCategoryId(
  categoryId: number,
  page: number = 1,
  size: number,
  filters?: ProductFilter,
  sortBy?: string
): Promise<ProductsResult> {
  return fetchProducts(page, size, filters, sortBy, { categoryId });
}

// 2. Lấy sản phẩm bán chạy nhất (Đường dẫn khác)
export async function fetchTopSellingProducts(
  page: number = 1, // Set default value for page
  size: number = 10, // Set default value for size
  filters?: ProductFilter,
  sortBy?: string
): Promise<ProductsResult> {
  try {
    // Flatten filters if necessary or handle them as query parameters
    const params: Record<string, any> = {
      page,
      size,
      sortBy,
      ...filters, // Spread filters into params (assuming they are simple key-value pairs)
    };

    // Gọi API và nhận response trực tiếp từ axios
    const response = await axios.get(`${API_BASE_URL}/products/top-selling-products`, {
      params,
    });

    // Trả về dữ liệu trong response
    return response.data;  // Trả về data từ response
  } catch (error) {
    console.error("Error fetching top-selling products:", error);
    throw new Error("Không thể lấy sản phẩm bán chạy nhất");
  }
}

// 3. Lấy sản phẩm được thêm trong vòng 1 tháng qua
export async function fetchProductsAddedInLastMonth(
  page: number = 1,
  size: number,
  filters?: ProductFilter,
  sortBy?: string
): Promise<ProductsResult> {
  const currentDate = new Date();
  const pastDate = new Date();
  pastDate.setMonth(currentDate.getMonth() - 1); // Giảm 1 tháng

  // Format ngày
  const from = pastDate.toISOString().split("T")[0];
  const to = currentDate.toISOString().split("T")[0];

  return fetchProducts(page, size, filters, sortBy, { from, to });
}

// 4. Lấy sản phẩm theo lượt yêu thích
export async function fetchFavoriteCount(
  page: number = 1,
  size: number,
  filters?: ProductFilter,
  sortBy: string = "favoriteCount_desc"
): Promise<ProductsResult> {
  return fetchProducts(page, size, filters, sortBy);
}

// 5. Hàm để lấy sản phẩm giảm giá
export async function fetchDiscountedProducts(
  page: number,
  size: number,
  filters?: ProductFilter,
  sortBy?:string
): Promise<ProductsResult> {
  const params: Record<string, any> = {
    page,
    size,
    sortBy,
    ...filters, // Các bộ lọc tùy chọn như bộ lọc theo danh mục, thương hiệu, v.v.
  };
  // Gọi API để lấy sản phẩm giảm giá
  return fetchFromAPI<ProductsResult>("/products/discounted", params);
}

// Hàm lấy sản phẩm theo ID
export const fetchProductById = async (
  productId: number
): Promise<ProductResponse> => {
  try {
    const response = await axios.get<ProductResponse>(
      `${API_BASE_URL}/products/productdetail/${productId}`
    );
    return response.data; // Dữ liệu sản phẩm trong response.data
  } catch (error) {
    console.error("Error product:", error);
    throw error;
  }
};

//Hàm lấy các đánh giá của sản phẩm
export const fetchProductReviews = async (
  productId: number
): Promise<ProductCommentsResponse> => {
  try {
    const response = await axios.get<ProductCommentsResponse>(
      `${API_BASE_URL}/comments/product/${productId}`
    );
    return response.data;
  } catch (error) {
    console.log("Error product:", error);
    throw error;
  }
};

// Hàm lấy sản phẩm theo Slug
export const fetchProductBySlug = async (
  slug: string
): Promise<ProductsResponse> => {
  try {
    const response = await axios.get<ProductsResponse>(
      `${API_BASE_URL}/products/${slug}`
    );
    return response.data; // Dữ liệu sản phẩm trong response.data
  } catch (error) {
    console.error("Error product:", error);
    throw error;
  }
};

// Hàm lấy sản phẩm theo danh mục
export const fetchProductsByCategory = async (
  categoryId: number
): Promise<ProductsResult> => {
  const url = `${API_BASE_URL}/products`;

  try {
    const response = await axios.get<ProductsResult>(url, {
      params: { categoryId }, // Truyền categoryId vào params
    });
    return response.data; // Trả về dữ liệu sản phẩm theo danh mục
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw new Error("Không thể tải sản phẩm cùng danh mục");
  }
};

// Hàm lấy sản phẩm theo tên sản phẩm
export const fetchProductByProductName = async (
  productName: string
): Promise<ProductsResult> => {
  try {
    const response = await axios.get<ProductsResult>(
      `${API_BASE_URL}/products?productName=${productName}`
    );
    return response.data;
  } catch (error) {
    console.error("Error product:", error);
    throw error;
  }
};

//Hàm gửi gửi bình luận
export const sendComment = async (commentData: CommentData) => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  if (!token) throw new Error("User is not logged in");

  try {
    // Gửi yêu cầu POST với header bao gồm Authorization Bearer token
    await axiosInstance.post(`${API_BASE_URL}/comments`, commentData, {
      
    });

    console.log("Comment added successfully");
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};
