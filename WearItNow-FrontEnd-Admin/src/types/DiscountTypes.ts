// src/types/DiscountTypes.ts

export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",  
  FIXED = "FIXED",           
}

export enum DiscountStatus {
  ACTIVE = "ACTIVE",  
  INACTIVE = "INACTIVE", 
}

// Định nghĩa giao diện Role
export interface Role {
  name: string;
  description: string | null;
  permissions: any[]; // Điều chỉnh nếu permissions có cấu trúc cụ thể
}

// Định nghĩa giao diện User
export interface User {
  userId: number;
  username: string;
  lastname: string | null;
  firstname: string | null;
  phone: string | null;
  email: string | null;
  gender: boolean | null;
  address: string | null;
  dob: string | null;
  roles: Role[] | null; // Giữ nguyên nếu `roles` có thể null
}


// Định nghĩa giao diện UserGroup
export interface UserGroup {
  id: number;
  name: string;
  users: User[]; // Danh sách người dùng, sử dụng kiểu User đã cập nhật
}


// Giao diện Discount được điều chỉnh
export interface Discount {
  id: number;  
  code: string;  
  type: DiscountType;  
  amount: number;  
  minOrderValue?: number;  
  startDate: string;  
  endDate: string;  
  status: DiscountStatus; 
  usageLimit?: number;  
  userGroupResponse?: UserGroup; // Phản ánh cấu trúc userGroupResponse lồng nhau
}

// Kiểu DiscountWithUserGroupId được cập nhật để chỉ chứa id của UserGroup
export interface DiscountWithUserGroupId extends Omit<Discount, 'userGroupResponse'> {
  userGroupResponse?: { id: number }; // userGroupResponse chỉ chứa id của group
}
// src/types/UserGroupApiResponse.ts
// src/types/UserGroupApiResponse.ts
export interface UserGroupApiResponse<T> {
  code: number;
  message: string;
  result: T; // T có thể là UserGroup hoặc UserGroup[]
}


