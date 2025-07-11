export interface ForgotPasswordRequest {
    email: string;
  }
  
  export interface ApiResponse<T> {
    message: string;
    result?: T;
  }
  export interface OtpForgotPasswordRequest {
    email: string;
    otp: string;
    newPassword: string; 
  }
