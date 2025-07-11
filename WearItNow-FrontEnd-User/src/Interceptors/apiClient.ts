// src/Interceptors/apiClient.ts
import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import AuthApi from '../services/AuthApi';

// Khởi tạo axios instance với cấu hình cơ bản
const apiClient = axios.create({
  baseURL: 'https://api.wearltnow.online/api',
  timeout: 10000, // Thời gian timeout cho request
  headers: {
    'Content-Type': 'application/json', // Header mặc định
  }
});

// Thêm thuộc tính _retry vào InternalAxiosRequestConfig
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Interceptor cho request - tự động thêm token xác thực
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor cho response - xử lý làm mới token khi hết hạn
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;
    
    // Kiểm tra nếu lỗi do token hết hạn và chưa thử lại
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const oldToken = localStorage.getItem('token');

      if (!oldToken) {
        console.error('No token found in localStorage. Please login again.');
        window.location.href = '/login'; 
        return Promise.reject(error);
      }

      try {
        // Thử làm mới token
        const { token: newToken } = await AuthApi.refreshToken(oldToken);
        localStorage.setItem('token', newToken);
        
        // Cập nhật token trong header của request ban đầu
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        }
        
        // Thử lại request ban đầu với token mới
        return apiClient(originalRequest);
      } catch (err) {
        console.error('Token refresh failed:', err);
        // Xóa token không hợp lệ và chuyển hướng đến trang đăng nhập
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
