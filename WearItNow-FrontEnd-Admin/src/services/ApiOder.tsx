import { Order } from 'types/orderTypes';
import axiosInstance from './api.service';

// Tạo Interface cho phản hồi phân trang
const ORDER_API_URL = '/orders';

class OrderApiService {
  // Lấy tất cả đơn hàng với dữ liệu trả về có định dạng PaginatedResponse<Order>
  async getAllOrders(
    page: number = 1,
    size: number = 8,
    orderCode?: string,
    status?: string,
    minTotalAmount?: number,
    maxTotalAmount?: number,
  ): Promise<PaginatedResponse<Order>> {
    try {
      // Xây dựng URL với query parameters
      let url = `${ORDER_API_URL}?page=${page}&size=${size}`;

      // Nếu có orderCode, thêm vào query string
      if (orderCode) {
        url += `&orderCode=${orderCode}`;
      }

      // Nếu có status, thêm vào query string
      if (status) {
        url += `&status=${status}`;
      }

      // Nếu có minTotalAmount, thêm vào query string
      if (minTotalAmount !== undefined) {
        url += `&minTotalAmount=${minTotalAmount}`;
      }

      // Nếu có maxTotalAmount, thêm vào query string
      if (maxTotalAmount !== undefined) {
        url += `&maxTotalAmount=${maxTotalAmount}`;
      }

      // Gửi yêu cầu GET tới API
      const response = await axiosInstance.get(url);

      // Kiểm tra dữ liệu phản hồi và trả về dữ liệu phân trang từ trường 'result'
      return response.data.result; // API trả về dữ liệu phân trang trong thuộc tính 'result'
    } catch (error) {
      // Xử lý lỗi và ghi log nếu có
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // Thêm đơn hàng
  async addOrder(order: Order): Promise<Order> {
    try {
      const response = await axiosInstance.post(ORDER_API_URL, order);
      return response.data as Order;
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  }

  // Cập nhật đơn hàng
  async updateOrder(orderId: string, order: Partial<Order>): Promise<Order> {
    try {
      const response = await axiosInstance.put(`${ORDER_API_URL}/${orderId}`, order);
      return response.data as Order;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  // Xóa đơn hàng
  async deleteOrder(orderId: string): Promise<void> {
    try {
      await axiosInstance.delete(`${ORDER_API_URL}/${orderId}`);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }

  // Xác nhận đơn hàng
  async confirmOrder(orderId: string): Promise<Order> {
    try {
      const response = await axiosInstance.post(`${ORDER_API_URL}/${orderId}/confirm`);
      return response.data as Order;
    } catch (error) {
      console.error('Error confirming order:', error);
      throw error;
    }
  }

  // Cập nhật trạng thái đơn hàng
  async updateOrderStatus(orderId: string, newStatus: string): Promise<Order> {
    try {
      const response = await axiosInstance.put(
        `${ORDER_API_URL}/${orderId}/status?newStatus=${newStatus}`,
      );
      return response.data.result as Order;
    } catch (error) {
      console.error('Error updating order status:', error.response ? error.response.data : error);
      throw error;
    }
  }

  // Tìm đơn hàng theo mã sản phẩm (productId)
  async getOrdersByProductId(
    productId: number,
    page: number = 1,
    size: number = 8,
  ): Promise<PaginatedResponse<Order>> {
    try {
      const url = `${ORDER_API_URL}?page=${page}&size=${size}&productId=${productId}`;
      const response = await axiosInstance.get(url);
      return response.data.result; // API trả về dữ liệu phân trang trong thuộc tính 'result'
    } catch (error) {
      console.error('Error fetching orders by productId:', error);
      throw error;
    }
  }
}

export default new OrderApiService();
