import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OtpVerificationModel, UserModel } from "../stores/UserModel";
import AuthService from "../services/AuthApi";
import { toast, ToastContainer } from "react-toastify";

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();

  // State cho thông tin người dùng, lỗi và OTP
  const [user, setUser] = useState<UserModel>({
    email: "",
    username: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // State cho xác nhận mật khẩu
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [otp, setOtp] = useState<string>("");
  const [otpPopup, setOtpPopup] = useState<boolean>(false); // Popup cho OTP
  const [timer, setTimer] = useState<number>(60); // Timer cho OTP
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Thêm state cho việc kiểm soát nút đăng ký
  const [isOtpVerified, setIsOtpVerified] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/userdashboard");
    }
  }, [navigate]);

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Xử lý thay đổi cho ô xác nhận mật khẩu
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  // Xử lý thay đổi cho OTP
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  // Hàm xử lý khi nhấn đăng ký
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra nếu mật khẩu và xác nhận mật khẩu khớp nhau
    if (user.password !== confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Mật khẩu không khớp.",
      }));
      return;
    }

    // Reset lỗi khi bắt đầu đăng ký
    setErrors({});

    // Ngăn không cho người dùng đăng ký nhiều lần
    setIsSubmitting(true); // Vô hiệu hóa nút đăng ký khi đang xử lý

    try {
      const response = await AuthService.registerUser(user);
      if (response) {
        setOtpPopup(true); // Hiển thị popup nhập OTP
        startTimer(); // Bắt đầu đếm ngược 60 giây
      }
    } catch (error: any) {
      try {
        // Check if the error message is a stringified JSON
        const errorData = error.response?.data || JSON.parse(error.message);
        // Handle specific error codes
        if (errorData.code === 1002) {
          // Set error for username
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: "Tên đăng nhập đã tồn tại.",
          }));
          return;
        } else if (errorData.code === 1009) {
          // Set error for email
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "Email đã được sử dụng.",
          }));
          return;
        } else if (errorData.errors) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            ...errorData.errors, // Kết hợp các lỗi mới vào state hiện tại
          }));
        } else if (errorData.message) {
          setErrors({ general: errorData.message });
        }
      } catch (parseError) {
        console.error("Failed to parse error message:", parseError);
        setErrors({ general: "Đã xảy ra lỗi. Vui lòng thử lại sau." });
      }
    } finally {
      setIsSubmitting(false); // Bật lại nút đăng ký sau khi xử lý xong
    }
  };

  // Xử lý gửi OTP
  const handleOtpSubmit = async () => {
    try {
      // Create the OTP verification data object
      const otpVerificationData: OtpVerificationModel = {
        email: user.email,
        otp: otp,
      };
  
      // Call the AuthService with the correct object structure
      const response = await AuthService.verifyOtp(otpVerificationData);
  
      if (response) {
        setIsOtpVerified(true); // Mark OTP as verified
        toast.success("Xác thực tài khoản thành công!");
  
        // Delay the navigation by 2 seconds
        setTimeout(() => {
          navigate("/login"); // Điều hướng đến trang đăng nhập
        }, 2000); 
      }
    } catch (error) {
      toast.error("OTP không hợp lệ. Vui lòng thử lại.");
    }
  };
  

  // Hàm đếm ngược thời gian
  const startTimer = () => {
    let countdown = 60;
    const interval = setInterval(() => {
      countdown -= 1;
      setTimer(countdown);
  
      // Check if OTP is verified, if so stop the countdown and prevent the alert
      if (countdown <= 0 && !isOtpVerified) {
        clearInterval(interval);
        toast.error("OTP đã hết hạn! Vui lòng yêu cầu mã mới.");
        setOtpPopup(false);
      }
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-5 bg-gray-100">
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              closeOnClick
            />
      <div className="bg-white rounded-lg shadow-lg flex w-full max-w-lg">
        <div className="p-8 w-full">
          <h2 className="text-2xl font-bold text-center text-red-500 mb-6">
            Tạo tài khoản
          </h2>
          <form className="w-full" onSubmit={handleSignUp}>
            {/* Input Tên đăng nhập */}
            <div className="mb-4">
              <input
                type="text"
                name="username"
                placeholder="Tên đăng nhập"
                className="w-full p-3 mb-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={user.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>

            {/* Input Mật khẩu */}
            <div className="mb-4">
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                className="w-full p-3 mb-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={user.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Input Xác nhận mật khẩu */}
            <div className="mb-4">
              <input
                type="password"
                placeholder="Xác nhận mật khẩu"
                className="w-full p-3 mb-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Input Email */}
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-3 mb-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={user.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
              {errors.general && (
                <p className="text-red-500 text-sm">{errors.general}</p>
              )}
            </div>

            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4 mb-4">
              <button
                type="submit"
                className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                disabled={isSubmitting} // Vô hiệu hóa nút khi đang xử lý
              >
                {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
              </button>

              <button
                type="button"
                className="w-full py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
                onClick={handleSignIn}
              >
                Đăng nhập
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Popup OTP */}
      {otpPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Nhập OTP</h3>
            <p className="text-sm text-gray-500 mb-4">
              Bạn có {timer} giây để nhập OTP.
            </p>
            <input
              type="text"
              placeholder="Nhập OTP"
              value={otp}
              onChange={handleOtpChange}
              className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
            <button
              onClick={handleOtpSubmit}
              className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Xác thực OTP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;
