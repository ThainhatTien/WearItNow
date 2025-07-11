import React, { useEffect, useState } from "react";
import { getOrderByUserId, updateOrderStatus } from "../../services/OrderApi";
import { Order } from "../../stores/Order";
import Modal from "../../modal/ModalProduct";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrdersForm: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>("ALL");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const { data } = await getOrderByUserId(Number(userId));
          setOrders(data);
        } else {
          setError("Không tìm thấy ID người dùng trong local storage");
        }
      } catch (error) {
        setError("Không thể lấy đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOpenModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("vi-VN");
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      await updateOrderStatus(orderId, "CANCELED");
      setOrders(
        orders.map((order) =>
          order.orderId === orderId ? { ...order, status: "CANCELED" } : order
        )
      );
      toast.success("Hủy đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      toast.error("Không thể hủy đơn hàng");
    }
  };

  const confirmCancelOrder = (orderId: number) => {
    confirmAlert({
      title: "Xác Nhận Hủy Đơn Hàng",
      message: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      buttons: [
        {
          label: "YES",
          onClick: () => handleCancelOrder(orderId),
          style: {
            backgroundColor: "#d9534f",
            borderRadius: "5px",
            padding: "10px 20px",
            color: "white",
            border: "none",
            cursor: "pointer",
            display: "block",
            margin: "0 auto",
            width: "100px",
          },
        },
        {
          label: "NO",
          onClick: () => {},
          style: {
            backgroundColor: "#5bc0de",
            borderRadius: "5px",
            padding: "10px 20px",
            color: "white",
            border: "none",
            cursor: "pointer",
            display: "block",
            margin: "0 auto",
            width: "100px",
          },
        },
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
    });
  };

  const confirmDelivered = (orderId: number) => {
    confirmAlert({
      title: "Xác Nhận Đã Nhận Hàng",
      message: "Bạn có chắc chắn đã nhận được hàng không?",
      buttons: [
        {
          label: "YES",
          onClick: () => handleConfirmDelivered(orderId),
          style: {
            backgroundColor: "#28a745", // Màu xanh lá cho nút "YES"
            borderRadius: "5px",
            padding: "10px 20px",
            color: "white",
            border: "none",
            cursor: "pointer",
            display: "block",
            margin: "0 auto",
            width: "100px",
          },
        },
        {
          label: "NO",
          onClick: () => {},
          style: {
            backgroundColor: "#dc3545", // Màu đỏ cho nút "NO"
            borderRadius: "5px",
            padding: "10px 20px",
            color: "white",
            border: "none",
            cursor: "pointer",
            display: "block",
            margin: "0 auto",
            width: "100px",
          },
        },
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
    });
  };
  const handleConfirmDelivered = async (orderId: number) => {
    try {
      await updateOrderStatus(orderId, "DELIVERED");
      setOrders(
        orders.map((order) =>
          order.orderId === orderId ? { ...order, status: "DELIVERED" } : order
        )
      );
      toast.success("Đơn hàng đã được đánh dấu là đã nhận!");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      toast.error("Không thể cập nhật trạng thái đơn hàng");
    }
  };
  const sortOrders = (orders: Order[]): Order[] => {
    const orderPriority: { [key: string]: number } = {
      PENDING: 1,
      CONFIRMED: 2,
      SHIPPED: 3,
      CANCELED: 4,
      DELIVERED: 5,
    };

    return orders.sort(
      (a, b) => orderPriority[a.status] - orderPriority[b.status]
    );
  };

  const filteredOrders = sortOrders(
    orders.filter((order) => {
      if (selectedTab === "ALL") return true;
      return order.status === selectedTab;
    })
  );

  const renderOrderStatus = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Đơn hàng đang chờ xử lí";
      case "CONFIRMED":
        return "Đơn hàng đã được xác nhận";
      case "SHIPPED":
        return "Đơn hàng đang được giao";
      case "CANCELED":
        return "Đơn hàng đã hủy";
      case "DELIVERED":
        return "Đơn hàng đã nhận";
      default:
        return status;
    }
  };

  const renderPaymentStatus = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "PAID":
        return "Đã thanh toán";
      case "UNPAID":
        return "Chưa thanh toán";
      default:
        return paymentStatus;
    }
  };

  return (
    <section className="bg-white p-6 shadow rounded h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Đơn Hàng</h2>
      <div className="flex border-b mb-4">
        {[
          "ALL",
          "PENDING",
          "CONFIRMED",
          "SHIPPED",
          "CANCELED",
          "DELIVERED",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 text-gray-700 border-b-2 ${
              selectedTab === tab ? "border-red-500" : "border-transparent"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div
        className={`flex flex-col items-center w-full transition-all duration-500 overflow-hidden flex-1 ${
          isExpanded ? "max-h-full" : "max-h-[510px]"
        }`}
      >
        {loading ? (
          <p className="text-gray-500">Đang tải...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-gray-500">Bạn chưa có đơn hàng trạng thái này.</p>
        ) : (
          <div className="w-full flex-1 hover:shadow-lg ">
            {filteredOrders.map((order) => (
              <div
                key={order.orderId}
                className="border p-4 mb-4 rounded-lg shadow-sm hover:shadow-lg"
              >
                <div className="mb-2">
                  <span className="font-medium">Mã Đơn Hàng: </span>
                  {order.order_code}
                </div>
                <div className="mb-2">
                  <span className="font-medium">Tổng Tiền: </span>
                  {formatCurrency(order.totalAmount)}đ
                </div>
                <div className="mb-2">
                  <span className="font-medium">Trạng Thái: </span>
                  <span
                    className={`status px-2 py-1 rounded ${
                      order.status === "PENDING"
                        ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                        : order.status === "CONFIRMED"
                        ? "bg-blue-100 border-blue-400 text-blue-700"
                        : order.status === "SHIPPED"
                        ? "bg-orange-100 border-orange-400 text-orange-700"
                        : order.status === "CANCELED"
                        ? "bg-red-100 border-red-400 text-red-700"
                        : order.status === "DELIVERED"
                        ? "bg-green-100 border-green-400 text-green-700"
                        : ""
                    }`}
                  >
                    {renderOrderStatus(order.status)}
                  </span>
                  {order.status === "SHIPPED" && (
                    <button
                      onClick={() => confirmDelivered(order.orderId)}
                      className="text-black  bg-gray-300 ml-5 px-4 py-1 rounded hover:bg-green-500 hover:text-white transition-colors duration-300"
                    >
                      Đã Nhận Hàng
                    </button>
                  )}
                </div>
                <div className="mb-2">
                  <span className="font-medium">Trạng Thái Thanh Toán: </span>
                  <span
                    className={`status px-2 py-1 rounded ${
                      order.payment_status === "PAID"
                        ? "bg-green-100 border-green-400 text-green-700"
                        : "bg-red-100 border-red-400 text-red-700"
                    }`}
                  >
                    {renderPaymentStatus(order.payment_status)}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-medium">
                    Thời Gian Giao Hàng Dự Kiến:{" "}
                  </span>
                  {new Date(order.expected_delivery_time).toLocaleDateString(
                    "vi-VN"
                  )}
                </div>
                {order.status === "PENDING" && (
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => confirmCancelOrder(order.orderId)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Hủy Đơn Hàng
                    </button>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleOpenModal(order)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                  >
                    Xem Chi Tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className={`w-full flex justify-center mt-4 ${
          filteredOrders.length > 2 ? "visible" : "invisible"
        }`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-500 hover:underline self-center"
        >
          {isExpanded ? "Thu Gọn" : "Xem Thêm"}
        </button>
      </div>

      {selectedOrder && (
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <div className="flex flex-col justify-between h-full">
            <h3 className="text-lg text-center font-semibold mb-4">
              Chi Tiết Đơn Hàng
            </h3>
            <div className="mb-4">
              <div>
                <strong>Mã Đơn Hàng:</strong> {selectedOrder.order_code}
              </div>
              <div>
                <strong>Tổng Tiền:</strong>{" "}
                {formatCurrency(selectedOrder.totalAmount)}đ
              </div>
              <div>
                <strong>Phí Vận Chuyển:</strong>{" "}
                {formatCurrency(selectedOrder.shippingFee)}đ
              </div>
              <div className="mb-2">
                <span className="font-medium">
                  <strong>Trạng Thái: </strong>
                </span>
                <span
                  className={`status px-2 py-1 rounded ${
                    selectedOrder.status === "PENDING"
                      ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                      : selectedOrder.status === "CONFIRMED"
                      ? "bg-green-100 border-green-400 text-green-700"
                      : selectedOrder.status === "SHIPPED"
                      ? "bg-blue-100 border-blue-400 text-blue-700"
                      : selectedOrder.status === "CANCELED"
                      ? "bg-red-100 border-red-400 text-red-700"
                      : ""
                  }`}
                >
                  {renderOrderStatus(selectedOrder.status)}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-medium">
                  <strong>Trạng Thái Thanh Toán: </strong>
                </span>
                <span
                  className={`status px-2 py-1 rounded ${
                    selectedOrder.payment_status === "PAID"
                      ? "bg-green-100 border-green-400 text-green-700"
                      : "bg-red-100 border-red-400 text-red-700"
                  }`}
                >
                  {renderPaymentStatus(selectedOrder.payment_status)}
                </span>
              </div>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-[60vh]">
              {selectedOrder.orderDetails.map((detail) => (
                <div
                  key={detail.productId}
                  className="mb-4 flex justify-between items-center"
                >
                  <div className="flex-1 mr-4">
                    <div>
                      <strong>{detail.name}</strong>
                    </div>
                    <div>
                      <strong>Giá:</strong> {formatCurrency(detail.price)}đ
                    </div>
                    <div>
                      <strong>Số Lượng:</strong> {detail.quantity}
                    </div>
                    <div>
                      <strong>Màu:</strong> {detail.color}
                    </div>
                    <div>
                      <strong>Size:</strong> {detail.size}
                    </div>
                  </div>
                  <div className="flex-1">
                    <img
                      src={detail.image}
                      alt={detail.name}
                      className="w-full object-cover h-auto"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              className="w-full py-2 bg-red-500 text-white font-semibold rounded-t-md"
              onClick={handleCloseModal}
            >
              Đóng
            </button>
            <hr />
          </div>
        </Modal>
      )}

      <ToastContainer />
    </section>
  );
};

export default OrdersForm;
