// services/UserAddressService.ts

import axios from "axios";
import { UserAddress, UserAddressResponse } from "../stores/UserAddress";

const API_BASE_URL = "https://api.wearltnow.online/api/user-address";



// Hàm tạo mới địa chỉ người dùng
export const createUserAddress = async (address: UserAddress) => {
    try {
        const response = await axios.post(API_BASE_URL, address);
        return response.data; 
    } catch (error) {
        console.error("Error creating user address:", error);
        throw error;
    }
};

export const getUserAddress = async (userID: number): Promise<UserAddressResponse> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${userID}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user address:", error);
      throw error;
    }
  };

  export const deleteUserAddress = async (addressId: number) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${addressId}`);
      return response.data;  // Trả về dữ liệu phản hồi nếu cần
    } catch (error) {
      console.error('Lỗi khi xóa địa chỉ:', error);
      throw error;  // Ném lỗi ra ngoài nếu cần xử lý ở nơi gọi
    }
  };

  export const updateAddress = async (addressId: number, addressData: UserAddress) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      console.error("Error updating address:", error);
      throw error;
    }
  };