import { Notification } from 'types/Notification';
import axiosInstance from './api.service';

export const GET_API = 'notifications';
export const GET_ORDER_API='orders'
export const getAllNotifications = (userId: number) => {
  // Truyền userId vào trong params của request
  return axiosInstance.get(GET_API+"/all", { params: { userId } });
};

export const putNotifications = (id: number, updatedData: Notification) => {

  return axiosInstance.put(GET_API+ "/" +id, updatedData)
};
export const getApiByOrderCode =(orderCode: string)=>{
  return axiosInstance.get(GET_ORDER_API, {params: {orderCode}})
} 
export const putApiByOrderCode =(orderId: number, newStatus:string)=>{
  return axiosInstance.put(`${GET_ORDER_API}/${orderId}/status`, null, { 
    params: { newStatus }
  });
} 
