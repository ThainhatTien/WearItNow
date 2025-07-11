export interface LoginCredentials {
    username: string; // Username
    password: string; // Mật khẩu
}
export const ROLE_DIRECTOR_STAFF = ['ROLE_DIRECTOR', 'ROLE_STAFF']


export interface Permission {
   name: string 
   description?: string;
}

export interface Role {
    name: string;
    description?: string;
    permissions: Permission[];
}
export interface UserWithId extends UserType {
    userId: number;
}

export interface UserType {
    firstname?: string; 
    lastname: string;
    username?: string;
    password: string; 
    phone?: string;
    email?: string;
    gender?: boolean;
    address?: string;
    dob?: Date;
    roles: Role[] | string[];
} 

export interface ApiResponse {
    result: UserWithId;
}