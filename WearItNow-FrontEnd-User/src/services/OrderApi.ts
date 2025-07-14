import axios from 'axios';
import { Order } from '../stores/Order';
import axiosInstance from './api.services';

const API_BASE_URL = 'http://localhost:8080/api';

interface OrderResponse {
  data: Order[];
}

export const getOrderByUserId = async (
  userId: number
): Promise<OrderResponse> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/orders/${userId}`);

    if (response.data.code === 1000 && response.data.result) {
      return {
        data: response.data.result.data || [],
      };
    } else {
      throw new Error('Không thể lấy đơn hàng');
    }
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu đơn hàng: ', error);
    throw new Error('Đã xảy ra lỗi trong quá trình lấy đơn hàng.');
  }
};

export const updateOrderStatus = async (orderId: number, newStatus: string): Promise<void> => {
  try {
    const response = await axiosInstance.put(`${API_BASE_URL}/orders/${orderId}/status`, null, {
      params: { newStatus },
    });

    if (response.data.code !== 1000) {
      throw new Error('Không thể cập nhật trạng thái đơn hàng');
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng: ', error);
    throw new Error('Đã xảy ra lỗi trong quá trình cập nhật trạng thái đơn hàng.');
  }
};
