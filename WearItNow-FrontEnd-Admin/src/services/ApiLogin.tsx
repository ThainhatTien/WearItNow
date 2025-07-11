import axios from 'axios'
import { LoginCredentials } from '../types/User.type'
import axiosInstance from './api.service'
import { ApiResponse, ForgotPasswordRequest, OtpForgotPasswordRequest } from '../types/Email.type'

const GET_API_LOGIN = '/auth'
// const GET_API ='http://localhost:8080/api/auth'
const GET_API ='https://api.wearltnow.online/api/auth'
export const LoginApi = ({username, password}:LoginCredentials) => axios.post(GET_API +'/login', {username,password})

export const LogoutApi = (token: string | null) => axiosInstance.post(GET_API_LOGIN +'/logout', {token})

export const RefreshTokenApi = (token:string | null) => axios.post(GET_API +'/refresh', {token})

export const AuthService = {
    // Hàm quên mật khẩu
    forgotPassword: async (request: ForgotPasswordRequest): Promise<ApiResponse<void>> => {
     const response = await axios.post(`${GET_API}/forgot-password`, request);
     return response.data;
   },
   
   // Hàm Nhận OTP
   verifyForgotPasswordOtp: async (request: OtpForgotPasswordRequest): Promise<ApiResponse<void>> => {
     const response = await axios.post(`${GET_API}/verify-forgot-password-otp`, request);
     return response.data;
   },
};
