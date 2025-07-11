import axiosInstance from "services/api.service";
import { Discount } from "types/DiscountTypes"; // Đảm bảo Discount đã được định nghĩa trong types

const DISCOUNT_API_URL = '/discount-codes';

class DiscountApiService {
  // Lấy danh sách mã giảm giá với phân trang
  async getAllDiscounts(page: number = 1, size: number = 8): Promise<PaginatedResponse<Discount>> {
    try {
      const url = `${DISCOUNT_API_URL}?page=${page}&size=${size}`;
      const response = await axiosInstance.get(url);
      const { currentPage, totalPages, pageSize, totalElements, data } = response.data.result;  // Lấy dữ liệu từ response
  
      return {
        data: data,  // Dữ liệu mã giảm giá
        totalPages,
        currentPage,
        totalElements,
        pageSize,  // Đảm bảo trả về pageSize
      };
    } catch (error: any) {
      console.error('Error fetching discount codes:', error);
      throw new Error(error?.response?.data?.message || 'Unable to fetch discount codes. Please try again later.');
    }
  }
  

  // Tạo mã giảm giá mới
// DiscountApiService.ts
 async createDiscountCode(discountData: Omit<Discount, 'id'>): Promise<Discount> {
  try {
    const response = await axiosInstance.post('/discount-codes/create', discountData);  // Chỉnh sửa đường dẫn đúng là '/create'
    return response.data.result as Discount;
  } catch (error: any) {
    console.error('Error creating discount code:', error);
    throw new Error(error?.response?.data?.message || 'Failed to create discount code. Please try again.');
  }
}


  // Áp dụng mã giảm giá cho đơn hàng
  async applyDiscountCode(code: string, orderId: number, userId: number): Promise<number> {
    try {
      const response = await axiosInstance.post(`${DISCOUNT_API_URL}/apply`, { code, orderId, userId });
      return response.data.result;  // Trả về số tiền giảm giá
    } catch (error: any) {
      console.error('Error applying discount code:', error);
      throw new Error(error?.response?.data?.message || 'Unable to apply discount code. Please check the code and try again.');
    }
  }
}

// Xuất default instance của DiscountApiService
export default new DiscountApiService();
