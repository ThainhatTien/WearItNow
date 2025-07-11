
import axiosInstance from './api.service';
import { UserGroup } from '../types/DiscountTypes';

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
  