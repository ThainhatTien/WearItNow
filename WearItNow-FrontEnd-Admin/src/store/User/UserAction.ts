import { AppDispatch } from "store";
import { UserType } from "../../types/User.type";
import { GetUserMyInfo } from "services/ApiUser";


export const GET_ALL_USER = 'GET_ALL_USER'
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';
export const ADD_USER = 'ADD_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const DELETE_USER = 'DELETE_USER';
export const SET_PAGE_SIZE = 'SET_PAGE_SIZE'
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE'
// UserActionTypes.ts

export const GET_USER_MY_INFO = 'GET_USER_MY_INFO';
export const FETCH_USER_MY_INFO_SUCCESS = 'FETCH_USER_MY_INFO_SUCCESS';
export const FETCH_USER_MY_INFO_FAILURE = 'FETCH_USER_MY_INFO_FAILURE';


export const getAllUser = () => ({
  type: GET_ALL_USER,
});
export const fetchUsersSuccess = (users: UserType[], currentPage: number, pageSize: number, totalElements: number, totalPages:number) => ({
  type: FETCH_USERS_SUCCESS,
  payload: {
    users,
    currentPage,
    pageSize,
    totalElements,
    totalPages
  },
});

export const setCurrentPage = (page: number) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});
export const setPageSize = (size: number) => ({
  type: SET_PAGE_SIZE,
  payload: size,
});
export const fetchUsersFailure = (error: string) => ({
  type: FETCH_USERS_FAILURE,
  payload: error,
});
export const addUser = (user: UserType) => ({
  type: ADD_USER,
  payload: user,
});

export const updateUser = (user: UserType) => ({
  type: UPDATE_USER,
  payload: user,
});

export const deleteUser = (userId: number) => ({
  type: DELETE_USER,
  payload: userId,
});

export const getusermyInfo = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch({ type: GET_USER_MY_INFO });  // Đang trong quá trình gửi request
      const response = await GetUserMyInfo(); // Gọi API lấy thông tin người dùng
      dispatch({
        type: FETCH_USER_MY_INFO_SUCCESS,
        payload: response.data.result, // Dữ liệu trả về từ API
      });
    } catch (error: any) {
      dispatch({
        type: FETCH_USER_MY_INFO_FAILURE,
        payload: error.message || 'Có lỗi khi tải thông tin người dùng.',
      });
    }
  };
};