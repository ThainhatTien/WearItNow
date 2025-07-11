
import { Order } from 'types/orderTypes';
import { 
    GET_ALL_ORDERS, 
    FETCH_ORDERS_SUCCESS, 
    FETCH_ORDERS_FAILURE, 
    ADD_ORDER, 
    UPDATE_ORDER, 
    DELETE_ORDER, 
    SET_ORDER_PAGE_SIZE, 
    SET_CURRENT_ORDER_PAGE 
} from './orderActionTypes';

// Action để lấy tất cả đơn hàng
export const getAllOrders = () => ({
    type: GET_ALL_ORDERS,
});

// Action để fetch đơn hàng thành công
export const fetchOrdersSuccess = (
    orders: Order[],
    currentPage: number,
    pageSize: number,
    totalElements: number
) => ({
    type: FETCH_ORDERS_SUCCESS,
    payload: {
        orders,
        currentPage,
        pageSize,
        totalElements,
    },
});

// Action để fetch đơn hàng thất bại
export const fetchOrdersFailure = (error: string) => ({
    type: FETCH_ORDERS_FAILURE,
    payload: error,
});

// Action để thêm đơn hàng
export const addOrder = (order: Order) => ({
    type: ADD_ORDER,
    payload: order,
});

// Action để cập nhật đơn hàng
export const updateOrder = (order: Order) => ({
    type: UPDATE_ORDER,
    payload: order,
});

// Action để xóa đơn hàng
export const deleteOrder = (orderId: string) => ({
    type: DELETE_ORDER,
    payload: orderId,
});

// Action để đặt kích thước trang
export const setOrderPageSize = (size: number) => ({
    type: SET_ORDER_PAGE_SIZE,
    payload: size,
});

// Action để đặt trang hiện tại
export const setCurrentOrderPage = (page: number) => ({
    type: SET_CURRENT_ORDER_PAGE,
    payload: page,
});
