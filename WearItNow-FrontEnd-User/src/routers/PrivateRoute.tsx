import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  isAuthenticated: boolean; // Kiểm tra xem người dùng đã xác thực hay chưa
  element: React.ReactNode; // Phần tử React muốn render nếu đã xác thực
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  isAuthenticated,
  element,
}) => {
  return isAuthenticated ? <>{element}</> : <Navigate to="/login" />; // Nếu đã xác thực, render element; nếu không, điều hướng đến trang đăng nhập
};

export default PrivateRoute;
