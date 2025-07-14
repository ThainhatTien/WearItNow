import { AccountModel } from './../stores/UserModel';
import AuthApi from './AuthApi';
// services/UserService.ts
const apiUrl = "http://localhost:8080/api"; 

export const getUserInfo = async () => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  if (!token) throw new Error("User is not logged in");

  try {
    const response = await fetch(`${apiUrl}/api/users/myInfo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Gửi token để xác thực
      },
    });

    if (response.ok) {
      return await response.json(); // Nếu thành công, trả về dữ liệu
    } else if (response.status === 401) {
      // Nếu token hết hạn (401), làm mới token và thử lại
      const newToken = await refreshToken(token); // Làm mới token
      localStorage.setItem("token", newToken); // Lưu token mới vào localStorage

      // Sau khi làm mới token, thực hiện lại request
      const retryResponse = await fetch(`${apiUrl}/api/users/myInfo`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newToken}`, // Gửi token mới để xác thực
        },
      });

      if (retryResponse.ok) {
        return await retryResponse.json(); // Trả về dữ liệu nếu thành công
      } else {
        throw new Error("Failed to fetch user info after token refresh");
      }
    } else {
      throw new Error("Failed to fetch user info");
    }
  } catch (error) {
    // Nếu có lỗi, xóa token trong localStorage
    localStorage.removeItem("token");
    throw error;
  }
};

// Cập nhật thông tin người dùng
const updateUserInfo = async (userId: string | null, data: any) => {
  const token = localStorage.getItem("token");
  if (!token || !userId) throw new Error("Người dùng chưa đăng nhập hoặc userId bị thiếu");

  try {
    const response = await fetch(`${apiUrl}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Gửi token để xác thực
      },
      body: JSON.stringify(data), // Chuyển dữ liệu thành chuỗi JSON
    });

    if (response.ok) {
      return await response.json(); // Trả về dữ liệu nếu thành công
    } else if (response.status === 401) {
      // Nếu token hết hạn (401), làm mới token và thử lại
      const newToken = await refreshToken(token); // Làm mới token
      localStorage.setItem("token", newToken); // Lưu token mới vào localStorage

      // Sau khi làm mới token, thực hiện lại request
      const retryResponse = await fetch(`${apiUrl}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newToken}`, // Gửi token mới
        },
        body: JSON.stringify(data),
      });

      if (retryResponse.ok) {
        return await retryResponse.json(); // Trả về dữ liệu nếu thành công
      } else {
        const retryErrorData = await retryResponse.json();
        // Xử lý lỗi khi thử lại
        throw new Error("Cập nhật thông tin người dùng thất bại sau khi làm mới token");
      }
    } else {
      const errorData = await response.json();
      // Xử lý lỗi từ phản hồi
      throw new Error(`Cập nhật thông tin người dùng thất bại: ${errorData.message}`);
    }
  } catch (error) {
    // Xử lý lỗi khi cập nhật
    throw new Error("Lỗi khi cập nhật thông tin người dùng");
  }
};


// Hàm làm mới token
const refreshToken = async (oldToken: string) => {
  try {
    const { token: newToken } = await AuthApi.refreshToken(oldToken); // Gọi API làm mới token
    return newToken; // Trả về token mới
  } catch (error) {
    // Xử lý lỗi khi làm mới token
    localStorage.removeItem("token");
    throw new Error("Failed to refresh token");
  }
};

export { updateUserInfo };
