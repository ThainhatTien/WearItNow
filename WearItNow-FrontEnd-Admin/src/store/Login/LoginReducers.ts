// reducer.js
import { 
    LOGIN_SUCCESS, 
    LOGIN_FAILURE, 
    FORGOT_PASSWORD_SUCCESS, 
    FORGOT_PASSWORD_FAILURE,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILURE,
    RESET_OTP, 
    SET_ERROR_MESSAGE
  } from './LoginAction';
  
  const initialState = {
    token: null,
    error: '',
    otpExpired: false,
    isLoading: false,
  };
  
  const LoginReducer = (state = initialState, action:any) => {
    switch (action.type) {
      case LOGIN_SUCCESS:
        return {
          ...state,
          token: action.payload,
          error: '',
        };
      case LOGIN_FAILURE:
        return {
          ...state,
          error: action.payload,
        };
      case FORGOT_PASSWORD_SUCCESS:
        return {
          ...state,
          error: '',
        };
      case FORGOT_PASSWORD_FAILURE:
        return {
          ...state,
          error: action.payload,
        };
      case RESET_PASSWORD_SUCCESS:
        return {
          ...state,
          error: '',
        };
      case RESET_PASSWORD_FAILURE:
        return {
          ...state,
          error: action.payload,
        };
      case RESET_OTP:
        return {
          ...state,
          otpExpired: false,
        };
      case SET_ERROR_MESSAGE: // Xử lý thông báo lỗi
        return {
            ...state,
            error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default LoginReducer;
  