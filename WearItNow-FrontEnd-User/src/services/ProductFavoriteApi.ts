import axios from 'axios';

// Địa chỉ base API
const API_URL = 'http://localhost:8080/api/favorites';

// Thêm sản phẩm vào danh sách yêu thích
export const addToFavorites = async (userId: number, productId: number) => {
  try {
    const response = await axios.post(`${API_URL}/add`, null, {
      params: {
        userId: userId,
        productId: productId,
      },
    });
    return response.data; // Trả về dữ liệu từ server
  } catch (error: any) {
    if (error.response) {
      // Server phản hồi với mã lỗi
      console.error('Error adding to favorites:', error.response.data);
      throw new Error(error.response.data.message || 'Lỗi khi thêm vào danh sách yêu thích');
    } else if (error.request) {
      // Yêu cầu đã được gửi nhưng không nhận được phản hồi
      console.error('No response received:', error.request);
      throw new Error('Không nhận được phản hồi từ server');
    } else {
      // Một cái gì đó đã xảy ra trong khi thiết lập yêu cầu
      console.error('Error setting up request:', error.message);
      throw new Error('Lỗi khi thiết lập yêu cầu');
    }
  }
};

// Xóa sản phẩm khỏi danh sách yêu thích
export const removeFromFavorites = async (userId: number, productId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/remove`, {
      params: {
        userId: userId,
        productId: productId,
      },
    });
    return response.data; // Trả về dữ liệu từ server
  } catch (error: any) {
    if (error.response) {
      // Server phản hồi với mã lỗi
      console.error('Error removing from favorites:', error.response.data);
      throw new Error(error.response.data.message || 'Lỗi khi xóa khỏi danh sách yêu thích');
    } else if (error.request) {
      // Yêu cầu đã được gửi nhưng không nhận được phản hồi
      console.error('No response received:', error.request);
      throw new Error('Không nhận được phản hồi từ server');
    } else {
      // Một cái gì đó đã xảy ra trong khi thiết lập yêu cầu
      console.error('Error setting up request:', error.message);
      throw new Error('Lỗi khi thiết lập yêu cầu');
    }
  }
};
// Lấy danh sách yêu thích của người dùng
export const getUserFavorites = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data; // Trả về dữ liệu từ server
  } catch (error: any) {
    console.error('Error fetching user favorites:', error);
    throw error;
  }
};
