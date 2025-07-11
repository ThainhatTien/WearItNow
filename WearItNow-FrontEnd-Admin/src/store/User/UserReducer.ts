import { UserWithId } from '../../types/User.type';
import { ADD_USER, DELETE_USER, FETCH_USER_MY_INFO_FAILURE, FETCH_USER_MY_INFO_SUCCESS, FETCH_USERS_FAILURE, FETCH_USERS_SUCCESS, GET_ALL_USER, GET_USER_MY_INFO, SET_CURRENT_PAGE, SET_PAGE_SIZE, UPDATE_USER } from './UserAction';

interface UserState {
  currentPage: number,
  pageSize: number,
  totalPages: number,
  totalElements: number,
  loading: boolean;
  users: UserWithId[];
  userMyInfo: UserWithId | null;
  error: string | null;
}

const initialState: UserState = {
  currentPage: 1,
  pageSize: 10,
  totalPages: 0,
  totalElements: 0,
  loading: false,
  users: [],
  userMyInfo: null,
  error: null,
};



const userReducer = (state = initialState, action: any): UserState => {
  switch (action.type) {
    case GET_USER_MY_INFO:
      return { ...state, loading: true, error: null }; // Đang lấy dữ liệu
    case FETCH_USER_MY_INFO_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        userMyInfo: action.payload, // Lưu thông tin người dùng vào state
      };
    case FETCH_USER_MY_INFO_FAILURE:
      return { 
        ...state, 
        loading: false, 
        error: action.payload,
        };
    case GET_ALL_USER:
      return {
        ...state, loading: true, error: null,
      }
    case FETCH_USERS_SUCCESS:
      return { 
        ...state, loading: false, 
        users: action.payload.users,
        currentPage: action.payload.currentPage,
        pageSize: action.payload.pageSize,
        totalElements: action.payload.totalElements,
        totalPages: action.payload.totalPages,
      };
      case SET_CURRENT_PAGE:
        return {
            ...state,
            currentPage: action.payload,
        };
    case SET_PAGE_SIZE:
        return {
            ...state,
            pageSize: action.payload,
        };
    case FETCH_USERS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case ADD_USER:
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    case UPDATE_USER:
      return {
        ...state,
        users: state.users.map(user => user.userId === action.payload.id ? action.payload : user),
      };
    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter(user => user.userId !== action.payload),
      };
    default:
      return state;
  }
};

export default userReducer;
