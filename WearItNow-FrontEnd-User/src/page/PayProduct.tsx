import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { CartItem } from "../stores/Cart";
import {
  getProvinces,
  getDistricts,
  getWards,
  checkOut,
  getAvailable,
  calculateShippingFee,
  PaymentTypes,
  PaymentData,
  getAddressUser,
  getDiscount,
} from "../services/ShippingApi";
import {
  Button,
  message,
  Steps,
  theme,
  Result,
  QRCode,
  Modal,
  Input,
} from "antd";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { Order } from "../stores/Order";
import { getUserInfo } from "../services/UserApi";
import { showToast } from "../components/CustomToast";
// Các interface cho dữ liệu tỉnh, huyện, xã
interface Province {
  ProvinceID: number;
  ProvinceName: string;
}

interface District {
  DistrictID: number;
  DistrictName: string;
}

interface Ward {
  WardCode: number;
  WardName: string;
}

interface OrderSummaryProps {
  items: CartItem[]; // Mảng các item trong giỏ hàng
  shippingFee: number; // Phí vận chuyển
  appliedDiscount: number; // Giá trị giảm giá đã áp dụng
  selectedDiscountCode: DiscountCode | null; // Mã giảm giá đã chọn (có thể là null nếu chưa chọn)
  handleDiscountCode: (id: number, code: string, amount: number) => void; // Hàm xử lý khi áp dụng mã giảm giá
  userId: number | null;
}

interface PaymentOption {
  paymentTypeId: number;
  name: string;
}

interface ShippingService {
  service_id: number; // ID của dịch vụ
  short_name: string; // Tên dịch vụ
  service_type_id: number; // Loại hình dịch vụ
}

interface DiscountCode {
  id: number;
  code: string;
  amount: number;
  type: "PERCENTAGE" | "FIXED";
}

interface PaymentData {
  paymentId: number;
  amount: number;
  paymentStatus: string;
  createdAt: string;
  qrCode: string;
  countdownTime: string;
}

// Định nghĩa các bước trong quy trình
const steps = [
  {
    title: "Thông tin giao hàng",
  },
  {
    title: "Chọn phương thức thanh toán",
  },
  {
    title: "Hoàn tất",
  },
];

// Component chính cho trang Checkout
const Checkout: React.FC = () => {
  const { token } = theme.useToken();
  const { cartItems } = useCart();
  const [current, setCurrent] = useState(0);
  const { clearCart } = useCart();
  // State cho thông tin giao hàng
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  );
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [selectedService, setSelectedService] =
    useState<ShippingService | null>(null);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedpayment, setPayment] = useState<PaymentOption | null>(null); // Thêm state cho phương thức thanh toán
  const [selectedorder, setOrder] = useState<Order | null>(null);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [selectedDiscountCode, setSelectedDiscountCode] =
    useState<DiscountCode | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0); // Thêm state để lưu giá trị giảm giá
  const [customDiscountCode, setCustomDiscountCode] = useState("");
  const [userInfo, setUserInfo] = useState<any>(null);
  const userId = Number(localStorage.getItem("userId") ?? 0);

  const [errors, setErrors] = useState<{
    fullName?: boolean;
    phoneNumber?: boolean;
    address?: boolean;
    province?: boolean;
    district?: boolean;
    ward?: boolean;
  }>({});

  const totalItemAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalAmount = totalItemAmount + shippingFee - appliedDiscount; // Giảm trừ số tiền áp dụng mã giảm giá

  // Hàm xử lý mã giảm giá
  const handleDiscountCode = (id: number, code: string, amount: number) => {
    // Cập nhật mã giảm giá đã chọn
    setSelectedDiscountCode({ id, code, amount, type: "PERCENTAGE" });

    // Giá trị giảm giá
    let discountValue: number;

    // Kiểm tra nếu amount nhỏ hơn hoặc bằng 100
    if (amount <= 100) {
      // Giảm gi theo phần trăm
      discountValue = totalItemAmount * (amount / 100);
    } else {
      // Giảm giá theo số tiền
      discountValue = amount;
    }

    // Cập nhật giá trị giảm giá vào trạng thái
    setAppliedDiscount(discountValue);
  };

  //Cap nhat state khi chon phuong thuc thanh toan
  const handlePaymentSelect = (paymentTypeId: number, name: string) => {
    setPayment({ paymentTypeId, name });
  };

  // Hàm mở modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Hàm xử lý đóng modal
  const handleOk = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  //Hàm lấy phí vận chuyển
  useEffect(() => {
    const fetchAndCalculateShippingFee = async () => {
      if (!selectedDistrict || !selectedWard) {
        return; // Dừng nếu chưa chọn đầy đủ thông tin
      }

      try {
        // Gọi API lấy danh sách dịch vụ
        const availableServices = await getAvailable(
          selectedDistrict.DistrictID
        );
        if (!availableServices || availableServices.length === 0) {
          showToast("Không có dịch vụ vận chuyển khả dụng!", "info");
          return;
        }

        // Tìm dịch vụ "Hàng nhẹ" (service_type_id = 2)
        const lightweightService = availableServices.find(
          (service: { service_type_id: number }) =>
            service.service_type_id === 2
        );

        setSelectedService(lightweightService);

        if (!lightweightService) {
          showToast("Không tìm thấy dịch vụ vận chuyển phù hợp!", "info");
          return;
        }

        // Chuẩn bị dữ liệu hàng hóa
        const items = cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          height: 1, // Điều chỉnh theo thực tế
          weight: 1, // Điều chỉnh theo thực tế
          length: 1, // Điều chỉnh theo thực tế
          width: 1, // Điều chỉnh theo thực tế
        }));

        // Gọi API tính phí vận chuyển
        const fee = await calculateShippingFee(
          selectedDistrict.DistrictID,
          lightweightService.service_type_id,
          selectedWard.WardCode.toString(),
          items
        );

        setShippingFee(fee); // Cập nhật phí vận chuyển
      } catch (error) {
        showToast("Không tính được phí vận chuyển. Vui lòng thử lại!", "error");
      }
    };
    fetchAndCalculateShippingFee(); // Gọi hàm khi component mount lần đầu
  }, [selectedDistrict, selectedWard, cartItems]);

  // Các hàm xử lý bước
  const next = () => {
    // Đặt lại trạng thái lỗi
    setErrors({});

    // Kiểm tra các trường bắt buộc
    if (current === 0) {
      let hasError = false;

      // Kiểm tra và cập nhật lỗi cho từng trường
      if (!validateInput("fullName", fullName)) {
        setErrors((prev) => ({ ...prev, fullName: true }));
        hasError = true;
      }

      if (!validateInput("phoneNumber", phoneNumber)) {
        setErrors((prev) => ({ ...prev, phoneNumber: true }));
        hasError = true;
      }

      if (!validateInput("address", address)) {
        setErrors((prev) => ({ ...prev, address: true }));
        hasError = true;
      }

      if (
        !validateInput("selectedProvince", selectedProvince) ||
        !validateInput("selectedDistrict", selectedDistrict) ||
        !validateInput("selectedWard", selectedWard)
      ) {
        setErrors((prev) => ({
          ...prev,
          province: true,
          district: true,
          ward: true,
        }));
        hasError = true;
      }

      // Nếu có lỗi, không chuyển sang bước tiếp theo
      if (hasError) return;
    }

    // Chuyển sang bước tiếp theo nếu không có lỗi
    setCurrent((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prev = () => {
    setCurrent((prev) => Math.max(prev - 1, 0));
  };

  // Hàm xử lý gửi thông tin đặt hàng
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = userInfo;

    // Xây dựng đối tượng checkoutRequest

    const checkoutRequest = {
      userId: user ? user.userId : null,
      paymentMethodId: selectedpayment ? selectedpayment.paymentTypeId : 0,
      serviceTypeId: selectedService ? selectedService.service_type_id : 0,
      discountCode: selectedDiscountCode ? selectedDiscountCode.code : null,
      items: user
        ? null
        : cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
    };

    const addressRequest = !user
      ? {
          toName: fullName,
          toPhone: phoneNumber,
          toWardCode: selectedWard ? selectedWard.WardCode : 0,
          toAddress: `${address}, ${selectedWard?.WardName || ""}, ${
            selectedDistrict?.DistrictName || ""
          }, ${selectedProvince?.ProvinceName || ""}`,
          toDistrictId: selectedDistrict ? selectedDistrict.DistrictID : 0,
        }
      : null;

    try {
      const requestBody = {
        checkoutRequest,
        addressRequest,
      };
      const data = await checkOut(requestBody);
      setOrder(data.result);

      selectedpayment?.paymentTypeId === 2 && ( // Chỉ khi paymentTypeId = 2
        <PaymentComponent orderId={selectedorder ? selectedorder.orderId : 0} />
      );

      // Hiển thị result thông tin đơn hàng
      setIsPaymentSuccess(true);
      // Xóa giỏ hàng
      clearCart();
      {
        selectedpayment && selectedpayment.paymentTypeId === 2 ? (
          <>showToast("Vui lòng thanh toán qua tài khoản", "info");</>
        ) : (
          <>showToast("Đặt hàng thành công", "success");</>
        );
      }
    } catch (error) {
      showToast("Lỗi khi đặt hàng", "error");
    }
  };

  // Lấy thông tin ngưi dùng từ API
  const fetchUserInfo = async () => {
    try {
      const data = await getUserInfo();
      setUserInfo(data.result);
    } catch (err) {
      setUserInfo(null);
    }
  };

  // Tự động điền thông tin người dùng từ localStorage khi component mount
  useEffect(() => {
    // Gọi hàm để lấy thông tin người dùng
    fetchUserInfo();
  }, []);

  // Lấy địa chỉ người dùng khi có thông tin người dùng
  useEffect(() => {
    if (userInfo) {
      const fetchUserAddress = async () => {
        try {
          const address = await getAddressUser(userInfo.userId);
          if (address != null) {
            // const address = addressData[0];
            setFullName(address.toName);
            setPhoneNumber(address.toPhone || "");
            setEmail(userInfo.email || "");
            setAddress(address.toAddress || "");

            // Set các giá trị tỉnh/huyện/xã
            const province = {
              ProvinceID: address.toProvinceId,
              ProvinceName: address.toProvinceName,
            };
            setSelectedProvince(province);
            handleProvinceChange(province.ProvinceID, province.ProvinceName); // Trigger change cho tỉnh

            const district = {
              DistrictID: address.toDistrictId,
              DistrictName: address.toDistrictName,
            };
            setSelectedDistrict(district);
            handleDistrictChange(district.DistrictID, district.DistrictName); // Trigger change cho quận

            const ward = {
              WardCode: address.toWardCode,
              WardName: address.toWardName,
            };
            setSelectedWard(ward);
            handleWardChange(ward.WardCode, ward.WardName); // Trigger change cho phường
          }
        } catch (error) {
          showToast("Không lấy được địa chỉ", "error");
        }
      };

      fetchUserAddress();
    }
  }, [userInfo]); // Chạy lại khi userInfo thay đổi

  // Các hàm xử lý thay đổi tỉnh, huyện, xã
  const handleProvinceChange = (provinceId: number, provinceName: string) => {
    if (provinceId && provinceName) {
      // Chỉ set nếu provinceId và provinceName hợp lệ
      setSelectedProvince({
        ProvinceID: provinceId,
        ProvinceName: provinceName,
      });
      setSelectedDistrict(null); // Reset quận/huyện khi tỉnh thay đổi
      setSelectedWard(null); // Reset phường/xã khi tỉnh thay đổi
      setErrors((prev) => ({ ...prev, province: false })); // Reset lỗi cho province
    } else {
      // Giữ giá trị hiện tại nếu không có ID hợp lệ
      setSelectedProvince(null);
      setErrors((prev) => ({ ...prev, province: true })); // Set lỗi cho province
    }
  };
  const handleOnChange = (field: string, value: any) => {
    // Cập nhật giá trị của trường nhập liệu
    switch (field) {
      case "fullName":
        setFullName(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "selectedProvince":
        setSelectedProvince(value);
        break;
      case "selectedDistrict":
        setSelectedDistrict(value);
        break;
      case "selectedWard":
        setSelectedWard(value);
        break;
      default:
        break;
    }
    setErrors((prev) => ({
      ...prev,
      [field]: !validateInput(field, value),
    }));
  };
  const validateInput = (field: string, value: any) => {
    switch (field) {
      case "fullName":
        return value.trim().length > 0; // Họ và tên không được để trống
      case "phoneNumber":
        return /^\d{10}$/.test(value); // Kiểm tra số điện thoại 10 chữ số
      case "address":
        return value.trim().length > 0; // Địa chỉ không được để trống
      case "selectedProvince":
      case "selectedDistrict":
      case "selectedWard":
        return value !== null; // Kiểm tra các trường địa lý
      default:
        return true;
    }
  };

  const handleDistrictChange = (districtId: number, districtName: string) => {
    if (districtId && districtName) {
      // Chỉ set nếu districtId và districtName hợp lệ
      setSelectedDistrict({
        DistrictID: districtId,
        DistrictName: districtName,
      });
      setSelectedWard(null); // Reset phường/xã khi quận/huyện thay đổi
      setErrors((prev) => ({ ...prev, district: false })); // Reset lỗi cho district
    } else {
      // Giữ giá trị hiện tại nếu không có ID hợp lệ
      setSelectedDistrict(null);
      setErrors((prev) => ({ ...prev, district: true })); // Set lỗi cho district
    }
  };

  const handleWardChange = (wardCode: number, wardName: string) => {
    if (wardCode && wardName) {
      // Chỉ set nếu wardCode và wardName hợp lệ
      setSelectedWard({ WardCode: wardCode, WardName: wardName });
      setErrors((prev) => ({ ...prev, ward: false })); // Reset lỗi cho ward
    } else {
      // Giữ giá trị hiện tại nếu không có ID hợp lệ
      setSelectedWard(null);
      setErrors((prev) => ({ ...prev, ward: true })); // Set lỗi cho ward
    }
  };

  // ịnh nghĩa các item cho Steps
  const items = steps.map((item) => ({ key: item.title, title: item.title }));
  // @ts-ignore
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-5xl p-4">
        <Steps current={current} items={items} />
        <div style={{ marginTop: 24 }}>
          {current === 0 && (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="sm:w-2/3">
                <ShippingInfo
                  fullName={fullName}
                  setFullName={setFullName}
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                  address={address}
                  setAddress={setAddress}
                  email={email}
                  setEmail={setEmail}
                  onclickCheckOut={handleSubmit}
                  selectedProvince={selectedProvince}
                  setSelectedProvince={setSelectedProvince}
                  selectedWard={selectedWard}
                  selectedDistrict={selectedDistrict}
                  handleProvinceChange={handleProvinceChange}
                  handleDistrictChange={handleDistrictChange}
                  handleOnChange={handleOnChange}
                  handleWardChange={handleWardChange}
                  errors={errors}
                />
              </div>
              <div className="sm:w-1/3">
                <OrderSummary
                  items={cartItems}
                  shippingFee={shippingFee}
                  appliedDiscount={appliedDiscount}
                  selectedDiscountCode={selectedDiscountCode} // Truyền mã giảm giá đã chọn
                  handleDiscountCode={handleDiscountCode} // Truyền hàm xử lý mã giảm giá
                  userId={userId}
                />
              </div>
            </div>
          )}
          {current === 1 && (
            <div>
              <PaymentMethods
                handlePaymentSelect={handlePaymentSelect}
                selectedPayment={selectedpayment}
              />
            </div>
          )}
          {isPaymentSuccess ? (
            selectedpayment && selectedpayment.paymentTypeId === 2 ? (
              <PaymentComponent
                orderId={selectedorder ? selectedorder.orderId : 0}
              />
            ) : (
              <Result
                status="success"
                title="Đặt hàng thành công!"
                subTitle={`Mã đơn hàng: ${selectedorder?.orderId || 0}`}
                extra={[
                  <Button
                    type="primary"
                    key="console"
                    onClick={() => navigate("/")}
                  >
                    Về trang chủ
                  </Button>,
                  <Button key="buy" onClick={() => navigate("/products")}>
                    Mua thêm sản phẩm
                  </Button>,
                ]}
              />
            )
          ) : (
            <>
              {current === 2 && <div>Xác nhận đơn hàng của bạn!</div>}
              {current < steps.length - 1 && (
                <Button type="primary" className="mt-5" onClick={next}>
                  Tiếp theo
                </Button>
              )}
              {current === steps.length - 1 && (
                <Button type="primary" className="mt-5" onClick={handleSubmit}>
                  Xong
                </Button>
              )}
              {current > 0 && (
                <Button
                  className="mt-5"
                  style={{ margin: "0 8px" }}
                  onClick={prev}
                >
                  Quay lại
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

//Hiển thị QrCode
const PaymentComponent: React.FC<{ orderId: number }> = ({ orderId }) => {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [urlQRCode, setUrlQRCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0); // Thời gian còn lại tính bằng giây

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        // Lấy thông tin thanh toán và mã QR
        const data = await PaymentData(orderId);

        // Cập nhật dữ liệu thanh toán
        setPaymentData(data.result);

        // Cập nhật mã QR trả về từ API
        setUrlQRCode(data.result.qrCode);

        // Lấy thời gian đếm ngược từ API và chuyển sang giây
        const countdown = data.result.countdownTime.split(":");
        const minutes = parseInt(countdown[0], 10);
        const seconds = parseInt(countdown[1], 10);
        setTimeRemaining(minutes * 60 + seconds); // Chuyển đổi thành giây
      } catch (err) {
        if (err instanceof Error) {
          setError("Error fetching payment data: " + err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, [orderId]);

  useEffect(() => {
    // Hàm để đếm ngược thời gian
    const countdownInterval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(countdownInterval); // Dừng đếm ngược khi thời gian còn lại = 0
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Dọn dẹp khi component bị unmount hoặc khi countdown kết thúc
    return () => clearInterval(countdownInterval);
  }, []);

  if (loading) {
    return <div>Đang tải thông tin thanh toán...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Chuyển đổi thời gian còn lại thành phút và giây
  const minutesRemaining = Math.floor(timeRemaining / 60);
  const secondsRemaining = timeRemaining % 60;
  const formattedTime = `${minutesRemaining}p ${secondsRemaining}s`;

  // Hiển thị thông tin thanh toán và mã QR
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 sm:text-xl">
        Thông Tin Thanh Toán
      </h2>

      {/* Hiển thị Payment ID */}
      <p className="text-lg font-medium text-gray-700 mb-3 sm:text-base">
        <strong className="text-gray-900">Payment ID:</strong>{" "}
        {paymentData?.paymentId}
      </p>

      {/* Hiển thị Số tiền */}
      <p className="text-lg font-medium text-gray-700 mb-3 sm:text-base">
        <strong className="text-gray-900">Số tiền:</strong>{" "}
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(paymentData?.amount || 0)}
      </p>

      {/* Hiển thị Trạng thái */}
      <p className="text-lg font-medium text-gray-700 mb-3 sm:text-base">
        <strong className="text-gray-900">Trạng thái:</strong>
        <span
          className={
            paymentData?.paymentStatus === "PAID"
              ? "text-green-500"
              : "text-yellow-500"
          }
        >
          {paymentData?.paymentStatus}
        </span>
      </p>

      {/* Hiển thị Ngày tạo */}
      <p className="text-lg font-medium text-gray-700 mb-3 sm:text-base">
        <strong className="text-gray-900">Ngày tạo:</strong>{" "}
        {new Date(paymentData?.createdAt || "").toLocaleString()}
      </p>

      {/* Hiển thị Thời gian còn lại */}
      <p className="text-lg font-medium text-gray-700 mb-3 sm:text-base">
        <strong className="text-gray-900">Thời gian còn lại:</strong>
        <span className="font-bold text-red-600">{formattedTime}</span>
      </p>

      {/* Hiển thị mã QR (nếu có) */}
      {urlQRCode ? (
        <div className="mt-4 flex justify-center">
          <img
            src={urlQRCode}
            alt="QR Code"
            className="w-36 h-36 border-2 border-gray-500 rounded-md shadow-md sm:w-28 sm:h-28"
          />
        </div>
      ) : (
        <p className="mt-4 text-gray-500">Đang tạo mã QR...</p>
      )}
    </div>
  );
};

//chọn phuương thức thanh toán
const PaymentMethods: React.FC<{
  selectedPayment: PaymentOption | null;
  handlePaymentSelect: (paymentTypeId: number, name: string) => void;
}> = ({ selectedPayment, handlePaymentSelect }) => {
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const data = await PaymentTypes(); // Gọi API để lấy danh sách phương thức thanh toán
        setPaymentOptions(data.result);
      } catch (err) {
        showToast("Không tải được phương thức thanh toán", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  if (loading) {
    return (
      <div>
        <LoadingSpinner fullscreen={true} />
      </div>
    );
  }

  if (error) {
    return <div>Error fetching payment methods: {error}</div>;
  }

  return (
    <div className="bg-gray-100">
      <div className="container mx-auto mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paymentOptions.map((option) => (
            <div
              key={option.paymentTypeId}
              className={`p-4 text-center rounded shadow cursor-pointer transition-all duration-300 ease-in-out ${
                selectedPayment?.paymentTypeId === option.paymentTypeId
                  ? "bg-blue-200"
                  : "bg-white"
              } hover:bg-gray-200`}
              onClick={() =>
                handlePaymentSelect(option.paymentTypeId, option.name)
              }
            >
              <input
                type="radio"
                name="paymentMethod"
                value={option.paymentTypeId}
                checked={
                  selectedPayment?.paymentTypeId === option.paymentTypeId
                }
                readOnly
                className="hidden" // Ẩn input nhưng vẫn cho phép chọn
              />
              <img
                src="https://placehold.co/50x50" // Thay bằng URL của hình ảnh phương thức thanh toán
                alt={`${option.name} logo`}
                className="mx-auto mb-2"
              />
              <p className="text-sm mt-1">{option.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Component chọn Tỉnh/Thành
const ProvinceSelect: React.FC<{
  onProvinceChange: (provinceId: number, provinceName: string) => void;
  selectedProvince: Province | null;
}> = ({ onProvinceChange, selectedProvince }) => {
  const [provinces, setProvinces] = useState<Province[]>([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const provincesData = await getProvinces();
        setProvinces(provincesData);
      } catch (error) {
        showToast("Không tải được danh sách tỉnh/thành phố", "error");
      }
    };

    fetchProvinces();
  }, []);

  return (
    <select
      className="p-2 border rounded w-full"
      onChange={(e) => {
        const selectedProvince = provinces.find(
          (p) => p.ProvinceID === Number(e.target.value)
        );
        if (selectedProvince) {
          onProvinceChange(
            selectedProvince.ProvinceID,
            selectedProvince.ProvinceName
          );
        }
      }}
    >
      <option value="">
        {selectedProvince ? selectedProvince.ProvinceName : "Chọn Tỉnh/Thành:"}
      </option>
      {provinces.map((province) => (
        <option key={province.ProvinceID} value={province.ProvinceID}>
          {province.ProvinceName}
        </option>
      ))}
    </select>
  );
};

// Component chọn Quận/Huyện
const DistrictSelect: React.FC<{
  provinceId: number;
  onDistrictChange: (districtId: number, districtName: string) => void;
  selectedDistrict: District | null;
}> = ({ provinceId, onDistrictChange, selectedDistrict }) => {
  const [districts, setDistricts] = useState<District[]>([]);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (provinceId) {
        try {
          const districtsData = await getDistricts(provinceId);
          setDistricts(districtsData);
        } catch (error) {
          showToast("Không tải được danh sách quận/huyện", "error");
        }
      }
    };

    fetchDistricts();
  }, [provinceId]);

  return (
    <select
      className="p-2 border rounded w-full"
      onChange={(e) => {
        const selectedDistrict = districts.find(
          (d) => d.DistrictID === Number(e.target.value)
        );
        if (selectedDistrict) {
          onDistrictChange(
            selectedDistrict.DistrictID,
            selectedDistrict.DistrictName
          );
        }
      }}
      disabled={districts.length === 0}
    >
      <option value="">
        {selectedDistrict ? selectedDistrict.DistrictName : "Chọn Quận/Huyện:"}
      </option>
      {districts.map((district) => (
        <option key={district.DistrictID} value={district.DistrictID}>
          {district.DistrictName}
        </option>
      ))}
    </select>
  );
};

// Component chọn Phường/Xã
const WardSelect: React.FC<{
  districtId: number;
  onWardChange: (wardCode: number, wardName: string) => void;
  selectedWard: Ward | null;
}> = ({ districtId, onWardChange, selectedWard }) => {
  const [wards, setWards] = useState<Ward[]>([]);

  useEffect(() => {
    const fetchWards = async () => {
      if (districtId) {
        try {
          const wardsData = await getWards(districtId);
          setWards(wardsData);
        } catch (error) {
          showToast("Không tải được danh sách phường/xã", "error");
        }
      } else {
        setWards([]);
      }
    };

    fetchWards();
  }, [districtId]);

  return (
    <select
      className="p-2 border rounded w-full"
      onChange={(e) => {
        const selectedWard = wards.find(
          (w) => w.WardCode == Number(e.target.value)
        );
        if (selectedWard) {
          onWardChange(selectedWard.WardCode, selectedWard.WardName); // Gọi hàm với mã xã và tên xã
        } else {
          console.warn("Không tìm thấy phường/xã");
        }
      }}
      disabled={wards.length === 0} // Disable dropdown nếu không có dữ liệu
    >
      <option value="">
        {selectedWard ? selectedWard.WardName : "Chọn phường/xã"}
      </option>
      {wards.length === 0 ? (
        <option value="" disabled>
          Không có dữ liệu
        </option>
      ) : (
        wards.map((ward) => (
          <option key={ward.WardCode} value={ward.WardCode}>
            {ward.WardName}
          </option>
        ))
      )}
    </select>
  );
};

//Lấy danh sách dịch vụ giao hàng (loại hình giao hàng)
const Shipping: React.FC<{
  districtId: number;
  selectedService: ShippingService | null;
  handleServiceSelect: (
    serviceId: number,
    serviceTypeId: number,
    shortName: string
  ) => void;
}> = ({ districtId, selectedService, handleServiceSelect }) => {
  const [services, setServices] = useState<ShippingService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const availableServices = await getAvailable(districtId);
        setServices(availableServices);
        // Tìm dịch vụ "Hng nhẹ"
        const lightweightService = availableServices.find(
          (service: { service_type_id: number }) =>
            service.service_type_id === 2
        );
        if (lightweightService) {
          // Thay vì gọi setSelectedService, chỉ cần gọi handleServiceSelect
          handleServiceSelect(
            lightweightService.service_id,
            lightweightService.service_type_id,
            lightweightService.short_name
          );
        }
      } catch (err) {
        showToast("Không tính đợc phí vận chuyển. Vui lòng thử lại!", "info");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [districtId, handleServiceSelect]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Không tính được phí vận chuyển. Vui lòng thử lại!</div>;
  }
  return null;
};

const DiscountCodes: React.FC<{
  userId: number | 0;
  selectedDiscountCode: DiscountCode | null;
  handeDiscountCodeSelect: (id: number, code: string, amount: number) => void;
}> = ({ userId, selectedDiscountCode, handeDiscountCodeSelect }) => {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customCode, setCustomCode] = useState<string>("");

  useEffect(() => {
    const fetchDiscountCodes = async () => {
      try {
        const codes = await getDiscount(userId);
        setDiscountCodes(codes);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      // Nếu userId tồn tại mới fetch discount codes
      fetchDiscountCodes();
    }
  }, [userId]);

  const handleCustomCodeSubmit = () => {
    // Logic xử lý khi người dùng nhập mã giảm giá tùy chỉnh
    console.log("Mã giảm giá tùy chỉnh đã nhập:", customCode);
    // Ví dụ: Bạn có thể gọi một hàm gửi mã giảm giá nhập từ người dùng
  };

  // if (loading) {
  //     return <div>Loading discount codes...</div>;
  // }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {userId ? (
        <>
          <Button
            className="float-right sm:float-none sm:w-full sm:mb-4"
            type="primary"
            onClick={() => setIsModalVisible(true)}
          >
            Chọn mã giảm giá
          </Button>

          <Modal
            title="Chọn mã giảm giá (nếu có)"
            open={isModalVisible}
            onOk={() => setIsModalVisible(false)}
            onCancel={() => setIsModalVisible(false)}
            className="sm:max-w-3xl sm:w-full"
          >
            <ul>
              {discountCodes.map((code) => (
                <li key={code.id} className="flex items-center mb-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="discountCode"
                      value={code.id}
                      checked={selectedDiscountCode?.id === code.id}
                      onChange={() =>
                        handeDiscountCodeSelect(code.id, code.code, code.amount)
                      }
                      className="mr-2"
                    />
                    <strong className="text-red-500">{code.code}</strong>
                  </label>
                </li>
              ))}
            </ul>
          </Modal>
        </>
      ) : (
        <div className="justify-center mb-2">
          <Input
            className="mb-2"
            placeholder="Nhập mã giảm giá"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
          />
          <Button
            type="primary"
            onClick={handleCustomCodeSubmit}
            className="w-full sm:w-auto"
          >
            Sử dụng mã giảm giá
          </Button>
        </div>
      )}
    </div>
  );
};
const ShippingInfo: React.FC<{
  fullName: string;
  setFullName: React.Dispatch<React.SetStateAction<string>>;
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  onclickCheckOut: (e: React.FormEvent) => Promise<void>;
  selectedProvince: Province | null;
  setSelectedProvince: React.Dispatch<React.SetStateAction<Province | null>>;
  selectedDistrict: District | null;
  selectedWard: Ward | null; // Thêm dòng này
  handleProvinceChange: (provinceId: number, provinceName: string) => void;
  handleDistrictChange: (districtId: number, districtName: string) => void;
  handleOnChange: (field: string, value: any) => void;
  handleWardChange: (wardCode: number, wardName: string) => void;
  errors: {
    fullName?: boolean;
    phoneNumber?: boolean;
    address?: boolean;
    province?: boolean;
    district?: boolean;
    ward?: boolean;
  };
}> = ({
  fullName,
  setFullName,
  phoneNumber,
  setPhoneNumber,
  address,
  setAddress,
  email,
  setEmail,
  selectedProvince,
  selectedDistrict,
  selectedWard,
  handleProvinceChange,
  handleDistrictChange,
  handleOnChange,
  handleWardChange,
  errors,
}) => {
  return (
    <div className="w-full bg-white p-6 rounded shadow-md">
      <h2 className="text-lg font-bold mb-4">Thông tin giao hàng</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Cột 1 */}
        <div>
          <input
            type="text"
            placeholder="Họ Và Tên"
            className={`p-2 border rounded w-full ${
              errors.fullName ? "border-red-500" : ""
            }`}
            value={fullName}
            onChange={(e) => handleOnChange("fullName", e.target.value)}
            required={!localStorage.getItem("currentUser")}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              Họ và tên không được để trống
            </p>
          )}
        </div>

        {/* Cột 2 */}
        <div>
          <input
            type="text"
            placeholder="Số điện thoại"
            className={`p-2 border rounded w-full ${
              errors.phoneNumber ? "border-red-500" : ""
            }`}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required={!localStorage.getItem("currentUser")}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">
              Số điện thoại không hợp lệ
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {/* Tỉnh */}
        <div>
          <ProvinceSelect
            onProvinceChange={handleProvinceChange}
            selectedProvince={selectedProvince}
          />
          {errors.province && (
            <p className="text-red-500 text-sm mt-1">Vui lòng chọn tỉnh</p>
          )}
        </div>

        {/* Quận */}
        <div>
          <DistrictSelect
            provinceId={selectedProvince ? selectedProvince.ProvinceID : 0}
            onDistrictChange={handleDistrictChange}
            selectedDistrict={selectedDistrict}
          />
          {errors.district && (
            <p className="text-red-500 text-sm mt-1">Vui lòng chọn quận</p>
          )}
        </div>

        {/* Phường/Xã */}
        <div>
          <WardSelect
            districtId={selectedDistrict ? selectedDistrict.DistrictID : 0}
            onWardChange={handleWardChange}
            selectedWard={selectedWard}
          />
          {errors.ward && (
            <p className="text-red-500 text-sm mt-1">Vui lòng chọn phường/xã</p>
          )}
        </div>
      </div>

      <div className="grid gap-2 mb-4">
        <input
          type="text"
          placeholder="Địa Chỉ"
          className={`p-2 border rounded w-full ${
            errors.address ? "border-red-500" : ""
          }`}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required={!localStorage.getItem("currentUser")}
        />
        {errors.address && (
          <p className="text-red-500 text-sm">Địa chỉ không được để trống</p>
        )}
      </div>

      <textarea
        placeholder="Nội dung"
        className="p-2 border rounded w-full mb-4"
      ></textarea>
    </div>
  );
};

// Component tóm tắt đơn hàng
const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  shippingFee,
  appliedDiscount,
  selectedDiscountCode,
  handleDiscountCode,
  userId,
}) => {
  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const discountedAmount = appliedDiscount;

  const finalAmount = totalAmount + shippingFee - discountedAmount;

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Hóa đơn
        </h2>

        {/* Danh sách sản phẩm */}
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.quantity}-${item.color}`}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 flex items-center mb-4 p-3 border-b border-gray-200"
          >
            <img
              src={item.image || "https://placehold.co/50x50"}
              alt={item.name}
              className="w-16 h-16 object-cover mr-4"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-700">{item.name}</p>
              <p className="text-xs text-gray-600">
                {item.color} × {item.size} × {item.quantity}
              </p>
            </div>
            <p className="ml-auto text-sm font-semibold text-gray-800">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(item.price * item.quantity)}
            </p>
          </div>
        ))}

        {/* Mã giảm giá */}
        <div className="border-t pt-4">
          <div className="flex justify-between mb-4">
            <DiscountCodes
              userId={userId ?? 0}
              selectedDiscountCode={selectedDiscountCode}
              handeDiscountCodeSelect={handleDiscountCode}
            />
          </div>

          {/* Tạm tính */}
          <div className="flex justify-between text-sm font-medium mb-2">
            <p>Tạm tính</p>
            <p>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalAmount)}
            </p>
          </div>

          {/* Phí giao hàng */}
          <div className="flex justify-between text-sm font-medium mb-2">
            <p>Phí giao hàng</p>
            <p>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(shippingFee)}
            </p>
          </div>

          {/* Giảm giá */}
          <div className="flex justify-between text-sm font-medium mb-2">
            <p>Giảm giá</p>
            <p>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(discountedAmount)}
            </p>
          </div>

          {/* Tổng cộng */}
          <div className="flex justify-between font-bold mt-4 text-lg sm:text-xl ">
            <p>Tổng cộng</p>
            <p className="text-xl text-primary">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              })
                .format(finalAmount)
                .replace("₫", "")}
              đ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
