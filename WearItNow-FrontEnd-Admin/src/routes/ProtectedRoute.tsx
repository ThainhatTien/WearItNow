import Splash from 'components/loading/Splash';
import { refreshToken } from 'pages/authentication/RefreshToken';
import { useEffect, useState } from 'react';
import { Navigate  } from 'react-router-dom';
import { rootPaths } from './paths';



interface ProtectedRoute {
  isAuthenticated: boolean;
  element: JSX.Element;
}

export const ProtectedRoute = ({ element }: ProtectedRoute) => {
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [isTokenValid, setIsTokenValid] = useState(true); // Trạng thái token hợp lệ


  useEffect(() => {
    const checkToken = async () => {
      const tokenExpiryTime = localStorage.getItem('tokenExpiryTime');
      const currentTime = new Date().getTime(); // Thời gian hiện tại tính bằng milliseconds
      const isTokenValid = tokenExpiryTime ? (currentTime < Number(tokenExpiryTime) * 1000) : false;
      // Nếu token đã hết hạn, gọi hàm làm mới token
      if (!isTokenValid) {
        try {
          const newToken = await refreshToken(); // Gọi API làm mới token
          if (!newToken) {
            // Nếu không nhận được token mới, điều hướng về trang login
            throw new Error('Không có token mới');
          }
        } catch (error) {
          console.error('Lỗi khi làm mới token:', error);
          // localStorage.clear(); // Xóa dữ liệu cũ
          setIsTokenValid(false); // Đặt trạng thái token không hợp lệ
        }
      }
      setLoading(false); // Dừng trạng thái loading sau khi kiểm tra
    };
    checkToken(); // Kiểm tra token khi component được mount
  }, []);

  // Nếu chưa đăng nhập, điều hướng về trang login

  // Nếu đang kiểm tra token (loading), hiển thị màn hình chờ
  if (loading) {
    return (
      <Splash/>
    );
}


  // Nếu token không hợp lệ, điều hướng về trang login
  if (!isTokenValid) {
    return <Navigate to={rootPaths.authRoot + "/login"} />;
  }

  // Render element nếu tất cả hợp lệ
  return <>{element}</>;
};
