import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import ApiOder from "services/ApiOder";
import { Order } from "types/orderTypes"; // Đảm bảo bạn đã định nghĩa kiểu Order trong file types

interface OrderContextType {
  orders: Order[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  orderCode: string;
  status: string;
  minTotalAmount: number | undefined;
  maxTotalAmount: number | undefined;
  sortOrder: 'newest' | 'oldest'; // Thêm trạng thái sắp xếp
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setTotalElements: React.Dispatch<React.SetStateAction<number>>;
  setOrderCode: React.Dispatch<React.SetStateAction<string>>;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  setMinTotalAmount: React.Dispatch<React.SetStateAction<number | undefined>>;
  setMaxTotalAmount: React.Dispatch<React.SetStateAction<number | undefined>>;
  setSortOrder: React.Dispatch<React.SetStateAction<'newest' | 'oldest'>>; // Cung cấp setter cho sortOrder
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: string) => Promise<void>;
  handlePageChange: (event: unknown, newPage: number) => void;
  handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedOrder: Order | null;
  handleViewDetails: (order: Order) => void;
  handleCloseModal: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [orderCode, setOrderCode] = useState(""); // Trạng thái lưu orderCode
  const [status, setStatus] = useState(""); // Trạng thái lưu status
  const [minTotalAmount, setMinTotalAmount] = useState<number | undefined>(undefined); // Trạng thái lưu minTotalAmount
  const [maxTotalAmount, setMaxTotalAmount] = useState<number | undefined>(undefined); // Trạng thái lưu maxTotalAmount
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest'); // Thêm trạng thái sắp xếp

  const fetchOrders = useCallback(async () => {
    try {
      const { data, totalElements } = await ApiOder.getAllOrders(
        currentPage + 1,
        pageSize,
        orderCode,
        status,
        minTotalAmount ?? 0,
        maxTotalAmount ?? 9999999
      );

      // Sắp xếp đơn hàng theo sortOrder
      if (sortOrder === 'newest') {
        data.sort((a, b) => new Date(b.expected_delivery_time).getTime() - new Date(a.expected_delivery_time).getTime());
      } else {
        data.sort((a, b) => new Date(a.expected_delivery_time).getTime() - new Date(b.expected_delivery_time).getTime());
      }

      setOrders(data);
      setTotalElements(totalElements);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, [currentPage, pageSize, orderCode, status, minTotalAmount, maxTotalAmount, sortOrder]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, sortOrder]); // Thêm sortOrder vào dependency

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await ApiOder.updateOrderStatus(orderId, newStatus);
      await fetchOrders(); // Tải lại danh sách đơn hàng sau khi cập nhật trạng thái
    } catch (error) {
      console.error('Error updating order status:', error);
      
    }
  };

  const handlePageChange = (_: unknown, newPage: number) => setCurrentPage(newPage);

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentPage,
        pageSize,
        totalElements,
        orderCode,
        status,
        minTotalAmount,
        maxTotalAmount,
        sortOrder, // Cung cấp giá trị sortOrder
        setCurrentPage,
        setPageSize,
        setOrders,
        setTotalElements,
        setOrderCode,
        setStatus,
        setMinTotalAmount,
        setMaxTotalAmount,
        setSortOrder, // Cung cấp setter cho sortOrder
        fetchOrders,
        updateOrderStatus,
        handlePageChange,
        handleRowsPerPageChange,
        selectedOrder,
        handleViewDetails,
        handleCloseModal,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
};
