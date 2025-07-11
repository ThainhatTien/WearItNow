import { Dispatch } from 'redux';
import { getAllDiscountPrices, getDiscountPriceById, createDiscountPrice, removeDiscountPrice, updateDiscountPrice } from 'services/ApiSaleProduct';
import { SaleProduct } from 'types/SaleProduct';
import { enqueueSnackbar } from "notistack";
import { AppDispatch } from 'store';
// Action Types
export const GET_DISCOUNT_PRICES_REQUEST = 'GET_DISCOUNT_PRICES_REQUEST';
export const GET_DISCOUNT_PRICES_SUCCESS = 'GET_DISCOUNT_PRICES_SUCCESS';
export const GET_DISCOUNT_PRICES_FAILURE = 'GET_DISCOUNT_PRICES_FAILURE';

export const GET_DISCOUNT_PRICE_BY_ID_REQUEST = 'GET_DISCOUNT_PRICE_BY_ID_REQUEST';
export const GET_DISCOUNT_PRICE_BY_ID_SUCCESS = 'GET_DISCOUNT_PRICE_BY_ID_SUCCESS';
export const GET_DISCOUNT_PRICE_BY_ID_FAILURE = 'GET_DISCOUNT_PRICE_BY_ID_FAILURE';

export const CREATE_DISCOUNT_PRICE_REQUEST = 'CREATE_DISCOUNT_PRICE_REQUEST';
export const CREATE_DISCOUNT_PRICE_SUCCESS = 'CREATE_DISCOUNT_PRICE_SUCCESS';
export const CREATE_DISCOUNT_PRICE_FAILURE = 'CREATE_DISCOUNT_PRICE_FAILURE';

export const UPDATE_DISCOUNT_PRICE_REQUEST = 'UPDATE_DISCOUNT_PRICE_REQUEST';
export const UPDATE_DISCOUNT_PRICE_SUCCESS = 'UPDATE_DISCOUNT_PRICE_SUCCESS';
export const UPDATE_DISCOUNT_PRICE_FAILURE = 'UPDATE_DISCOUNT_PRICE_FAILURE';

export const REMOVE_DISCOUNT_PRICE_REQUEST = 'REMOVE_DISCOUNT_PRICE_REQUEST';
export const REMOVE_DISCOUNT_PRICE_SUCCESS = 'REMOVE_DISCOUNT_PRICE_SUCCESS';
export const REMOVE_DISCOUNT_PRICE_FAILURE = 'REMOVE_DISCOUNT_PRICE_FAILURE';

export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
// Action Creators

// Get all discount prices
export const getDiscountPrices = () => async (dispatch: Dispatch) => {
  dispatch({ type: GET_DISCOUNT_PRICES_REQUEST });
  try {
    const response = await getAllDiscountPrices();
    const { currentPage, totalPages, totalElements, pageSize, data } = response.data.result;
    dispatch({
      type: GET_DISCOUNT_PRICES_SUCCESS,
      payload: {
        discountProducts: data,
        currentPagediscountProducts: currentPage,
        totalPagesdiscountProducts: totalPages,
        pageSizediscountProducts: pageSize,
        totalElementsdiscountProducts:totalElements ,
      },
    });
  } catch (error: any) {
    dispatch({ type: GET_DISCOUNT_PRICES_FAILURE, payload: error.message });
  }
};

// Get discount price by ID
export const getDiscountPriceByIdAction = (id: number) => async (dispatch: Dispatch) => {
  dispatch({ type: GET_DISCOUNT_PRICE_BY_ID_REQUEST });
  try {
    const response = await getDiscountPriceById(id);
    dispatch({
      type: GET_DISCOUNT_PRICE_BY_ID_SUCCESS,
      payload: response.data,
    });
    getDiscountPrices
  } catch (error: any) {
    dispatch({ type: GET_DISCOUNT_PRICE_BY_ID_FAILURE, payload: error.message });
  }
};

// Create a new discount price
export const createDiscountPriceAction = (saleProduct: SaleProduct) => async (dispatch: AppDispatch) => {
  dispatch({ type: CREATE_DISCOUNT_PRICE_REQUEST });
  try {
    const response = await createDiscountPrice(saleProduct);
    dispatch({
      type: CREATE_DISCOUNT_PRICE_SUCCESS,
      payload: response.data,
    });
    dispatch(getDiscountPrices());
    enqueueSnackbar('Thêm giá sản phẩm thành công.', { variant: 'success' });
  } catch (error: any) {
    dispatch({ type: CREATE_DISCOUNT_PRICE_FAILURE, payload: error.message });
    enqueueSnackbar('Thêm giá sản phẩm thất bại.', { variant: 'error' });
  }
};

export const updateDiscountPriceAction = (id: number, saleProduct: SaleProduct) => async (dispatch: AppDispatch) => {
  dispatch({ type: CREATE_DISCOUNT_PRICE_REQUEST });
  try {
    const response = await updateDiscountPrice(id ,saleProduct);
    dispatch({
      type: CREATE_DISCOUNT_PRICE_SUCCESS,
      payload: response.data,
    });
    dispatch(getDiscountPrices());
    enqueueSnackbar('Sửa giá sản phẩm thành công.', { variant: 'success' });
  } catch (error: any) {
    dispatch({ type: CREATE_DISCOUNT_PRICE_FAILURE, payload: error.message });
    enqueueSnackbar('Sửa giá sản phẩm thất bại.', { variant: 'error' });
  }
};

// Remove discount price
export const removeDiscountPriceAction = (id: number) => async (dispatch: AppDispatch) => {
  dispatch({ type: REMOVE_DISCOUNT_PRICE_REQUEST });
  try {
    await removeDiscountPrice(id);
    dispatch({
      type: REMOVE_DISCOUNT_PRICE_SUCCESS,
      payload: id,
    });
    dispatch(getDiscountPrices());
    enqueueSnackbar('Sửa giá sản phẩm thành công.', { variant: 'success' });
  } catch (error: any) {
    dispatch({ type: REMOVE_DISCOUNT_PRICE_FAILURE, payload: error.message });
  }
  enqueueSnackbar('xóa giá sản phẩm thất bại.', { variant: 'error' });
};
export const setSaleProductCurrentPage = (page: number) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});
