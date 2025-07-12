import React, { useState, useEffect } from "react";
import AuthService from "../services/AuthApi";
import { useNavigate } from "react-router-dom";
import { PasswordResetModel } from "../stores/UserModel";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [timer, setTimer] = useState<number>(60);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false); // State cho popup
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false); // Trạng thái vô hiệu hóa nút
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/userdashboard");
    }
  }, [navigate]);

  // Gửi OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Reset lỗi trước khi gửi

    // Reset các trường OTP và mật khẩu khi gửi lại mã OTP
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");

    setIsButtonDisabled(true); // Vô hiệu hóa nút gửi khi đang gửi OTP

    try {
      await AuthService.sendOtp(email); // Gọi API gửi OTP
      setOtpSent(true); // Đánh dấu đã gửi OTP
      startTimer(); // Bắt đầu đếm ngược
    } catch (error) {
      setErrors({ email: "Gửi OTP thất bại. Vui lòng kiểm tra lại email." });
    } finally {
      setIsButtonDisabled(false); // Kích hoạt lại nút gửi khi hoàn thành
    }
  };

  // Hàm đếm ngược thời gian
  const startTimer = () => {
    let countdown = 60;
    const interval = setInterval(() => {
      countdown -= 1;
      setTimer(countdown);
      if (countdown <= 0) {
        clearInterval(interval);
        setOtpSent(false); // Reset lại trạng thái gửi OTP
        // Xóa nội dung các trường OTP và mật khẩu khi hết hạn
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
      }
    }, 1000);
  };

  // Đặt lại mật khẩu với OTP
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Reset lỗi trước khi đặt lại mật khẩu

    // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp nhau không
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: "Mật khẩu không khớp." });
      return;
    }
    const data: PasswordResetModel = {
      otp: otp,
      email: email,
      newPassword: newPassword,
    };
    try {
      // Gọi API đặt lại mật khẩu và xác thực OTP cùng lúc
      await AuthService.verifyOtpForgotpassword(data);
      setShowSuccessPopup(true); // Hiển thị popup khi thành công
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: "Đặt lại mật khẩu thất bại. Vui lòng thử lại." });
      }
    }
  };

  // Đóng popup và chuyển hướng đến trang đăng nhập
  const closePopup = () => {
    setShowSuccessPopup(false);
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-5 bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg flex w-full max-w-md p-8">
        <form
          onSubmit={otpSent ? handleResetPassword : handleSendOtp}
          className="w-full"
        >
          <h2 className="text-2xl font-bold text-center text-red-500 mb-6">
            Quên Mật Khẩu
          </h2>

          {/* Input Email */}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Nhập Email"
              className="w-full p-3 mb-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Nếu OTP đã được gửi */}
          {otpSent && (
            <>
              {/* Input Mã OTP */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Nhập Mã OTP"
                  className="w-full p-3 mb-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                {errors.otp && (
                  <p className="text-red-500 text-sm">{errors.otp}</p>
                )}
              </div>
              <p className="text-gray-500 mb-4">OTP còn {timer} giây.</p>

              {/* Input Mật khẩu mới */}
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Mật khẩu mới"
                  className="w-full p-3 mb-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              {/* Input Xác nhận mật khẩu */}
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  className="w-full p-3 mb-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              className={`w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 ${
                isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isButtonDisabled} // Vô hiệu hóa nút nếu đang gửi
            >
              {otpSent ? "Đặt lại mật khẩu" : "Gửi mã OTP"}
            </button>
          </div>

          {errors.general && (
            <p className="text-red-500 text-sm text-center">{errors.general}</p>
          )}
        </form>
      </div>

      {/* Popup thông báo thành công */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-green-500 mb-4 text-center">
              Đặt lại mật khẩu thành công!
            </h2>
            <button
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 w-full"
              onClick={closePopup}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
