import { useState, useEffect } from 'react';
import { getAllNotifications, putNotifications, getApiByOrderCode, putApiByOrderCode } from 'services/ApiNotification';
import { Notification } from 'types/Notification';
import { Order } from 'types/orderTypes';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { enqueueSnackbar } from "notistack";

const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [orderDetails, setOrderDetails] = useState<Order[]>([]);
  const [showAllNotifications, setShowAllNotifications] = useState<boolean>(false);

  const { userMyInfo } = useSelector((state: RootState) => state.userData);

  useEffect(() => {
    if (userMyInfo) {
      fetchNotifications();
    }
  }, [userMyInfo]);

  // Hàm lấy tất cả thông báo
  const fetchNotifications = async () => {
    if (!userMyInfo) return;
    setLoading(true);
    try {
      const response = await getAllNotifications(userMyInfo.userId);
      if (response.data && response.data.result) {
        // Sắp xếp các thông báo theo id từ lớn đến bé
        const sortedNotifications = response.data.result.sort((a: Notification, b: Notification) => b.id - a.id);
        setNotifications(sortedNotifications);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      setError('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };
  

  // Xử lý khi click vào thông báo
  const handleNotificationClick = async (notification: Notification) => {
    const updatedNotification: Notification = { ...notification, status: 'read' };
    setSelectedNotification(updatedNotification);

    try {
      await putNotifications(notification.id, updatedNotification);
      setNotifications((prevNotifications) =>
        prevNotifications.map((item) => (item.id === updatedNotification.id ? updatedNotification : item))
      );
      const orderCode = notification.message.split(' ').pop(); // Lấy mã đơn hàng từ thông báo
      if (orderCode) {
        fetchOrderDetails(orderCode); // Gọi API lấy chi tiết đơn hàng
      }
    } catch (error) {
      setError("Không thể cập nhật trạng thái thông báo, vui lòng thử lại.");
    }
  };

  // Hàm lấy chi tiết đơn hàng
  const fetchOrderDetails = async (orderCode: string) => {
    try {
      const response = await getApiByOrderCode(orderCode);
      if (response.data.result.data) {
        setOrderDetails(response.data.result.data);
      }
    } catch (error) {
      console.error("Không thể lấy thông tin đơn hàng", error);
    }
  };

  // Lọc ra các thông báo chưa đọc
  const unreadNotifications = notifications.filter((notification) => notification.status === 'unread');

  // Giới hạn số lượng thông báo hiển thị
  const displayedNotifications = showAllNotifications ? unreadNotifications : unreadNotifications.slice(0, 4);

  // Hàm xác nhận đơn hàng
  const handleConfirmOrder = async (orderId: number) => {
    try {
      const newStatus = 'CONFIRMED'
      await putApiByOrderCode(orderId, newStatus);
      setSelectedNotification(null);
      enqueueSnackbar(`Đơn hàng ${orderId} đã được xác nhận!`,{ variant: 'success' })
    } catch (error) {
      setError(error.mesage);
      enqueueSnackbar(`Lỗi Khi xác nhận Đơn hàng ${orderId} `,{ variant: 'error' })
    }
  };
  const handleCloseModal = () => {
    setSelectedNotification(null);
  };
  return {
    notifications,
    loading,
    error,
    handleNotificationClick,
    displayedNotifications,
    unreadNotifications,
    showAllNotifications,
    setShowAllNotifications,
    selectedNotification,
    orderDetails,
    handleConfirmOrder,
    handleCloseModal,
  };
};

export default useNotifications;
