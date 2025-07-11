import { jwtDecode, JwtPayload } from 'jwt-decode';
import { RefreshTokenApi } from '../../services/ApiLogin';

export const refreshToken = async () => {
  try {
    const token = localStorage.getItem('token');
    const tokenExpiryTimeString = localStorage.getItem('tokenExpiryTime');

    const tokenExpiryTime = tokenExpiryTimeString ? parseInt(tokenExpiryTimeString, 10) : 0;
    const currentTime = Math.floor(Date.now() / 1000);

    // Kiểm tra xem token đã hết hạn chưa
    if (!token || currentTime >= tokenExpiryTime) {
      console.warn('Token đã hết hạn hoặc không có token.');
    }

    const response = await RefreshTokenApi(token);
    const newAccessToken = response.data.result.token;
    const decodedToken = jwtDecode<JwtPayload & { exp?: number; iat?: number }>(newAccessToken);
    const expiryTime = decodedToken?.exp;
    const creationTime = decodedToken?.iat;

    if (expiryTime && creationTime) {
      localStorage.setItem('tokenExpiryTime', expiryTime.toString());
      localStorage.setItem('tokenCreationTime', creationTime.toString());
    }

    localStorage.setItem('token', newAccessToken);
    return newAccessToken;
  } catch (error) {
    // console.error('Lỗi khi refresh token:', error);
    console.error('Lỗi khi refresh token:', error);
    localStorage.clear();
    window.location.href = '/authentication/login';
  }
};