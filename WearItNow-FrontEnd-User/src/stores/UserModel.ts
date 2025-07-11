export interface UserModel {
    email: string;
    username: string;
    password: string;
  }
  
  export interface AccountModel {
    username: string;
    password: string;
  }
  
  export interface OtpVerificationModel {
    email: string;
    otp: string;
  }
  
  export interface PasswordResetModel {
    email: string;
    otp: string;
    newPassword: string;
  }
  
  export interface UserInfo {
    firstname: string;
    lastname: string;
    phone: string;
    roles: string[];
    email: string;
    gender: string; // true/false as string
    dob: string; // Date of birth
  }
  
  export interface User {
    userId: string;
    username: string;
    lastname: string | null;
    firstname: string | null;
    phone: string | null;
    email: string;
    gender: boolean | null;  // true/false as boolean
    address: string | null;
    dob: string | null;
    roles: {
      name: string;
      description: string;
      permissions: string[]; // Assuming it's an array of strings for permissions
    }[];
  }
  