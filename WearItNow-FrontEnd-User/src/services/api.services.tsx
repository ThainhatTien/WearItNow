import axios from "axios";
import { refreshToken } from "./RefreshToken";

const axiosInstance = axios.create({
    // baseURL: 'http://localhost:8080/api', // Địa chỉ API của bạn
    baseURL: 'https://api.wearltnow.online/api',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}` // Bạn có thể thêm token ở đây nếu cần
    },
  });
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response, // Nếu phản hồi thành công, trả về phản hồi
    async (error) => {
      const originalRequest = error.config; // Lưu lại cấu hình yêu cầu gốc
      console.log('Error response:', error.response); // In ra phản hồi lỗi
      console.log('Original request:', originalRequest); // In ra yêu cầu gốc
  
      // Nếu lỗi là 401 Unauthorized và chưa thử refresh token
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Đánh dấu đã thử lại
  
        try {
          const newAccessToken = await refreshToken(); // Gọi hàm refreshToken
          if (newAccessToken) {
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest); // Gửi lại yêu cầu với token mới
          }
        } catch (err) {
          // console.error('Lỗi khi làm mới token:', err);
          // Nếu không thể refresh token, có thể cần điều hướng về trang đăng nhập
          window.location.href = '/authentication/login';
          return Promise.reject(err);
        }
      }
      return Promise.reject(error); // Trả về lỗi nếu không xử lý được
    }
  );
  export default axiosInstance;