import { UserType } from '../types/User.type'
import axiosInstance from './api.service'

const GET_API_USER_URL = '/users'
// const GET_API ='http://localhost:8080/api/users'
// export const ListUserService = (token: string) => {
//     return axios.get(GET_API, {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     });
// }
export const UserService = (currentPage: number, pageSize: number) => axiosInstance.get(GET_API_USER_URL,{
    params: {
    page: currentPage, // Tham số cho trang hiện tại
    size: pageSize,    // Tham số cho kích thước trang
}}
,) 
// gọi dữ liệu theo id
export const UserIdService = (userId: number) => axiosInstance.get(GET_API_USER_URL + '/' + userId) 
// thêm mới đối tượng
export const CreateUserService = (user: UserType) => axiosInstance.post(GET_API_USER_URL, user) 
// cập nhật đối tượng
export const UpdateUserService = (userId: number, user: UserType) => axiosInstance.put(GET_API_USER_URL + '/' + userId, user) 
// xóa đối tượng
export const DeleteUserService = (userId: number) => axiosInstance.delete(GET_API_USER_URL + '/' + userId) 
// user my info
export const GetUserMyInfo =()=> axiosInstance.get(GET_API_USER_URL+'/myInfo')