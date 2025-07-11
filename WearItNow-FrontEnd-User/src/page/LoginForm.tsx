import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthApi";
import { AccountModel } from "../stores/UserModel";
import { toast, ToastContainer } from "react-toastify";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Lưu trữ lỗi cho từng trường
  const navigate = useNavigate();

  // Kiểm tra nếu đã có token thì chuyển hướng người dùng sang trang dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/userdashboard");
    }
  }, [navigate]);

  const handleSignUp = () => {
    navigate("/register");
  };

  const handleForgotpassword = () => {
    navigate("/forgotpassword");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset lại lỗi
    setErrors({});

    // Kiểm tra nếu các trường có giá trị
    if (!username) {
      setErrors((prev) => ({
        ...prev,
        username: "Vui lòng nhập tên đăng nhập.",
      }));
      return;
    }
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Vui lòng nhập mật khẩu." }));
      return;
    }

    const user: AccountModel = { username, password };

    try {
      const result = await AuthService.login(user);

      // Lấy token từ result và lưu vào localStorage
      if (result && result.result && result.result.token) {
        localStorage.setItem("token", result.result.token);
        localStorage.setItem("userId", result.result.user.userId);
        // Chuyển hướng đến dashboard hoặc trang chính
        toast.success("Đăng nhập thành công !");
        setTimeout(() => {
          navigate("/userdashboard");
        }, 2000); 
      } else {
        setErrors((prev) => ({
          ...prev,
          apiError: "Không thể lấy token từ phản hồi.",
        }));
      }
    } catch (err: any) {
      // Nếu có lỗi đăng nhập từ API
      setErrors((prev) => ({ ...prev, apiError: err.message }));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              closeOnClick
            />
      <div className="bg-white rounded-lg shadow-lg flex w-full max-w-md md:w-2/3 lg:w-1/3">
        <div className="p-8 w-full">
          <h2 className="text-2xl font-bold text-center text-red-500 mb-6">
            Đăng Nhập
          </h2>
          {/* Hiển thị lỗi API */}
          {errors.apiError && (
            <p className="text-red-500 text-center mb-4">{errors.apiError}</p>
          )}

          {/* Input tên đăng nhập */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {/* Hiển thị lỗi nếu có */}
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>

          {/* Input mật khẩu */}
          <div className="mb-4 relative">
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {/* Hiển thị lỗi nếu có */}
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={handleLogin}
              className="w-full bg-red-500 text-white py-2 rounded-lg"
            >
              Đăng Nhập
            </button>
            <button
              className="w-full border border-red-500 text-red-500 py-2 rounded-lg"
              onClick={handleSignUp}
            >
              Đăng Ký
            </button>
          </div>

          <p
            className="text-center text-red-500 cursor-pointer mb-4"
            onClick={handleForgotpassword}
          >
            Quên mật khẩu?
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
