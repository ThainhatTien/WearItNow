import axios from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';


const GET_API ='http://localhost:8080/api/auth'

export const refreshToken = async () => {
  try {
    const token = localStorage.getItem('token');
    const tokenExpiryTimeString = localStorage.getItem('tokenExpiryTime');

    const tokenExpiryTime = tokenExpiryTimeString ? parseInt(tokenExpiryTimeString, 10) : 0;
    const currentTime = Math.floor(Date.now() / 1000);

    // Kiểm tra xem token đã hết hạn chưa
    if (!token || currentTime >= tokenExpiryTime) {
      // Token đã hết hạn hoặc không có token
      throw new Error('Token đã hết hạn hoặc không có token');
    }

    const response = await axios.post(GET_API +'/refresh', {token})
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
    // Xử lý lỗi khi làm mới token
    localStorage.clear();
    window.location.href = '/authentication/login';
    throw new Error('Lỗi khi làm mới token');
  }
};