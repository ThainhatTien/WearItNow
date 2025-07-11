
import axiosInstance from './api.service';
import { User, UserGroup } from '../types/DiscountTypes';

interface UserGroupResponse {
  id: number;
  name: string;
  users: User[];
}

interface ApiResult<T> {
  result: T;
  code: number;
  message: string;
}

// Simplified API response handler
const handleError = (error: any) => {
  console.error('API Error:', error);
  throw error;
};

export const getAllUserGroups = async () => {
  try {
    const response = await axiosInstance.get('/user-groups');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Export getUserGroups for backward compatibility
export const getUserGroups = async (): Promise<UserGroup[]> => {
  try {
    const response = await axiosInstance.get<ApiResult<UserGroupResponse[]>>('/user-groups/all');
    if (response.data && Array.isArray(response.data.result)) {
      return response.data.result.map((group: UserGroupResponse) => ({
        id: group.id,
        name: group.name,
        users: group.users.map((user: User) => ({
          userId: user.userId,
          username: user.username,
          email: user.email,
          phone: user.phone,
          lastname: user.lastname,
          firstname: user.firstname,
          gender: user.gender,
          address: user.address,
          dob: user.dob,
          roles: user.roles,
        })),
      }));
    }
    throw new Error("Dữ liệu nhóm người dùng không hợp lệ");
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu nhóm người dùng:", error);
    throw error;
  }
};

export const getUserGroupById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/user-groups/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const createUserGroup = async (name: string) => {
  try {
    const response = await axiosInstance.post('/user-groups', { name });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Export addUserGroup for backward compatibility
export const addUserGroup = async (name: string): Promise<UserGroup> => {
  try {
    const response = await axiosInstance.post('/user-groups/create', null, { params: { name } });
    if (response.data && response.data.result) {
      return response.data.result;
    }
    throw new Error("Không thể thêm nhóm người dùng");
  } catch (error) {
    console.error("Lỗi khi thêm nhóm người dùng:", error);
    throw error;
  }
};

export const updateUserGroup = async (id: number, name: string) => {
  try {
    const response = await axiosInstance.put(`/user-groups/${id}`, { name });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteUserGroup = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/user-groups/delete/${id}`);
    // Removed console.log statement
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const addUserToGroup = async (groupId: number, userId: number) => {
  try {
    const response = await axiosInstance.post(`/user-groups/${groupId}/users/${userId}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const removeUserFromGroup = async (group: UserGroup, userId: number) => {
  try {
    const response = await axiosInstance.delete(`/user-groups/${group.id}/users/${userId}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getUsersInGroup = async (groupId: number) => {
  try {
    const response = await axiosInstance.get(`/user-groups/${groupId}/users`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const addUserToGroups = async (user: { id: number }, groupIds: number[]) => {
  try {
    const response = await axiosInstance.post(`/users/${user.id}/groups`, { groupIds });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
  