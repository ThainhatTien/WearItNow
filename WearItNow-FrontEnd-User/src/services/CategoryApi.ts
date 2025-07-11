import {CategoriesResponse, CategoriesResult} from "../stores/Category";
import axios from "axios";

// Cấu hình base URL cho API
// const API_BASE_URL = 'http://localhost:8080/api'; 
const API_BASE_URL = 'https://api.wearltnow.online/api';// Thay đổi URL này theo API của bạn

// Hàm lấy tất cả danh mục
export async function fetchCategories(): Promise<CategoriesResult> {
    try {
        const response = await axios.get<CategoriesResult>(`${API_BASE_URL}/categories`);
        return response.data; // Axios trả về dữ liệu trong response.data
    } catch (error) {
        console.error('Error category:', error);
        throw error;
    }
}

// Hàm lấy danh mục theo slug
export async function fetchSlugCategories(slug: string): Promise<CategoriesResponse> {
    try {
        const response = await axios.get<CategoriesResponse>(`${API_BASE_URL}/categories/${slug}`);
        return response.data; // Axios trả về dữ liệu trong response.data
    } catch (error) {
        console.error('Error category:', error);
        throw error;
    }
}

// // Hàm lấy danh mục theo ID
// export const fetchCategoryById = async (categoryId: number): Promise<Category> => {
//   const response = await axios.get<Category>(`${API_BASE_URL}/categories/${categoryId}`);
//   return response.data;
// };

// // Hàm thêm danh mục mới
// export const createCategory = async (category: Category): Promise<Category> => {
//   const response = await axios.post<Category>(`${API_BASE_URL}/categories`, category);
//   return response.data;
// };

// // Hàm cập nhật danh mục
// export const updateCategory = async (categoryId: number, category: Category): Promise<Category> => {
//   const response = await axios.put<Category>(`${API_BASE_URL}/categories/${categoryId}`, category);
//   return response.data;
// };

// // Hàm xóa danh mục
// export const deleteCategory = async (categoryId: number): Promise<void> => {
//   await axios.delete(`${API_BASE_URL}/categories/${categoryId}`);
// };