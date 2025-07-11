
import { Order } from "types/orderTypes";
import { 
    ADD_ORDER, 
    DELETE_ORDER, 
    FETCH_ORDERS_FAILURE, 
    FETCH_ORDERS_SUCCESS, 
    GET_ALL_ORDERS, 
    SET_CURRENT_ORDER_PAGE, 
    SET_ORDER_PAGE_SIZE, 
    UPDATE_ORDER 
} from "./orderActionTypes";

interface OrderState {
    orderCurrentPage: number;
    orderPageSize: number;
    totalElements: number;
    loading: boolean;
    orders: Order[];
    error: string | null;
}

const initialState: OrderState = {
    orderPageSize: 10,
    orderCurrentPage: 1,
    totalElements: 0,
    loading: false,
    orders: [],
    error: null,
};

const orderReducer = (state = initialState, action: any): OrderState => {
    switch (action.type) {
        case GET_ALL_ORDERS:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_ORDERS_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: action.payload.orders,
                orderCurrentPage: action.payload.currentPage,
                orderPageSize: action.payload.pageSize,
                totalElements: action.payload.totalElements,
            };
        case SET_CURRENT_ORDER_PAGE:
            return {
                ...state,
                orderCurrentPage: action.payload,
            };
        case SET_ORDER_PAGE_SIZE:
            return {
                ...state,
                orderPageSize: action.payload,
            };
        case FETCH_ORDERS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case ADD_ORDER:
            return {
                ...state,
                orders: [...state.orders, action.payload],
            };
        case UPDATE_ORDER:
            return {
                ...state,
                orders: state.orders.map(order =>
                    order.orderId === action.payload.orderId ? action.payload : order
                ),
            };
        case DELETE_ORDER:
            return {
                ...state,
                orders: state.orders.filter(order => order.orderId !== action.payload),
            };
        default:
            return state;
    }
};

export default orderReducer;
