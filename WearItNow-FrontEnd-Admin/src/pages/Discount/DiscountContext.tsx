import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import DiscountApiService from 'services/DiscountApiService';
import { Discount } from 'types/DiscountTypes';

interface DiscountContextType {
  discounts: Discount[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  fetchDiscounts: (page: number, size: number) => void;
  applyDiscountCode: (code: string, orderId: number, userId: number) => Promise<void>;
  addDiscount: (discountData: Omit<Discount, 'id'>) => Promise<void>; // Thêm phương thức này
}

const DiscountContext = createContext<DiscountContextType | undefined>(undefined);

interface DiscountProviderProps {
  children: ReactNode;
}

const DiscountProvider: React.FC<DiscountProviderProps> = ({ children }) => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [totalElements, setTotalElements] = useState<number>(0);

  // Fetch danh sách mã giảm giá với phân trang
  const fetchDiscounts = useCallback(async (page: number = 1, size: number = 8) => {
    setLoading(true);  // Đặt loading là true khi bắt đầu request
    setError(null);  // Reset lỗi trước khi bắt đầu gọi API
    try {
      const response: PaginatedResponse<Discount> = await DiscountApiService.getAllDiscounts(page, size);
      setDiscounts(response.data);  // Dữ liệu trả về từ API là mảng mã giảm giá
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setPageSize(response.pageSize);
      setTotalElements(response.totalElements);
    } catch (error) {
      setError('Failed to fetch discount codes');
      console.error('Error fetching discounts:', error);
    } finally {
      setLoading(false);  // Đặt loading lại là false khi đã nhận được kết quả
    }
  }, []);

  // Áp dụng mã giảm giá cho đơn hàng
  const applyDiscountCode = useCallback(async (code: string, orderId: number, userId: number) => {
    setError(null);  // Reset error trước khi áp dụng mã giảm giá
    try {
      await DiscountApiService.applyDiscountCode(code, orderId, userId);
    } catch (error) {
      setError('Failed to apply discount code');
      console.error('Error applying discount code:', error);
    }
  }, []);

  const addDiscount = useCallback(async (discountData: Omit<Discount, 'id'>) => {
    setLoading(true); // Bật loading khi đang thực hiện thao tác
    setError(null); // Reset lỗi trước khi thêm mã giảm giá
  
    try {
      // Gọi API thêm mã giảm giá mới
      const newDiscount = await DiscountApiService.createDiscountCode(discountData);
  
      // Nếu API trả về mã giảm giá mới thành công, cập nhật lại danh sách mã giảm giá
      setDiscounts((prevDiscounts) => [...prevDiscounts, newDiscount]);
  
    } catch (error) {
      // Nếu có lỗi, set thông báo lỗi và log lỗi chi tiết
      setError('Failed to create discount code');
      console.error('Error creating discount code:', error);
    } finally {
      // Tắt loading sau khi thao tác hoàn tất
      setLoading(false);
    }
  }, []);
  

  // Gọi hàm fetchDiscounts khi component mount hoặc các tham số phân trang thay đổi
  useEffect(() => {
    fetchDiscounts(currentPage, pageSize); // Gọi API khi currentPage hoặc pageSize thay đổi
  }, [currentPage, pageSize]); // Không cần phải phụ thuộc vào loading
  
  return (
    <DiscountContext.Provider
      value={{
        discounts,
        loading,
        error,
        currentPage,
        totalPages,
        pageSize,
        totalElements,
        fetchDiscounts,
        applyDiscountCode,
        addDiscount, // Thêm vào đây
      }}
    >
      {children}
    </DiscountContext.Provider>
  );
};

export { DiscountProvider, DiscountContext };
