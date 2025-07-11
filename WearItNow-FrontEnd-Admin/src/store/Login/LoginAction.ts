export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const FORGOT_PASSWORD_SUCCESS = 'FORGOT_PASSWORD_SUCCESS';
export const FORGOT_PASSWORD_FAILURE = 'FORGOT_PASSWORD_FAILURE';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAILURE = 'RESET_PASSWORD_FAILURE';
export const RESET_OTP = 'RESET_OTP';
export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';



export const loginSuccess = (token:string) => ({
  type: LOGIN_SUCCESS,
  payload: token,
});

export const loginFailure = (error:string) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const forgotPasswordSuccess = () => ({
  type: FORGOT_PASSWORD_SUCCESS,
});

export const forgotPasswordFailure = (error:string) => ({
  type: FORGOT_PASSWORD_FAILURE,
  payload: error,
});

export const resetPasswordSuccess = () => ({
  type: RESET_PASSWORD_SUCCESS,
});

export const resetPasswordFailure = (error:string) => ({
  type: RESET_PASSWORD_FAILURE,
  payload: error,
});
export const setErrorMessage = (message: string) => ({
  type: SET_ERROR_MESSAGE,
  payload: message,
});
export const resetOtp = () => ({
  type: RESET_OTP,
});
