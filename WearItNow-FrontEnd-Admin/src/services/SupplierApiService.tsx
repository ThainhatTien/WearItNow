import axiosInstance from "services/api.service";
import { Supplier } from "types/supplierTypes"; // Đảm bảo Supplier đã được định nghĩa trong types

const SUPPLIER_API_URL = '/suppliers';
class SupplierApiService {
  // Lấy danh sách nhà cung cấp với phân trang
  async getAllSuppliers(page: number = 1, size: number = 8): Promise<PaginatedResponse<Supplier>> {
    try {
      const url = `${SUPPLIER_API_URL}?page=${page}&size=${size}`;
      const response = await axiosInstance.get(url);
      return response.data.result;  
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  }

  // Tạo nhà cung cấp mới
  async createSupplier(supplierData: Omit<Supplier, 'supplierId'>): Promise<Supplier> {
    try {
      const response = await axiosInstance.post(SUPPLIER_API_URL, supplierData);
      return response.data.result as Supplier;
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  }

  // Lấy thông tin nhà cung cấp theo ID
  async getSupplierById(id: number): Promise<Supplier> {
    try {
      const response = await axiosInstance.get(`${SUPPLIER_API_URL}/${id}`);
      return response.data.result as Supplier; // Giả sử kết quả trả về nằm trong trường 'result'
    } catch (error) {
      console.error('Error fetching supplier by ID:', error);
      throw error;
    }
  }

  // Cập nhật thông tin nhà cung cấp
  async updateSupplier(id: number, supplierData: Omit<Supplier, 'supplierId'>): Promise<Supplier> {
    try {
      const response = await axiosInstance.put(`${SUPPLIER_API_URL}/${id}`, supplierData);
      return response.data.result as Supplier; // Giả sử kết quả trả về nằm trong trường 'result'
    } catch (error) {
      console.error('Error updating supplier:', error);
      throw error;
    }
  }

  // Xóa nhà cung cấp theo ID
  async deleteSupplier(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`${SUPPLIER_API_URL}/${id}`);
    } catch (error) {
      console.error('Error deleting supplier:', error);
      throw error;
    }
  }
}


export default new SupplierApiService();
