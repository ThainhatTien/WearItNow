// src/services/AuthService.ts
import { AccountModel, OtpVerificationModel, PasswordResetModel, UserModel } from "../stores/UserModel";
import axios from 'axios';

class AuthService {
  private apiUrl = "https://api.wearltnow.online/api";

  async login(user: AccountModel): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/auth/login`, user);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async registerUser(user: UserModel): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/auth/register`, {
        email: user.email,
        username: user.username,
        password: user.password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp(data: OtpVerificationModel): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/auth/verify-otp`, {
        email: data.email,
        otp: data.otp,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async sendOtp(email: string): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/auth/forgot-password`, { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async verifyOtpForgotpassword(data: PasswordResetModel): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/auth/verify-forgot-password-otp`, {
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(token: string): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/auth/refresh`, { token });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();
