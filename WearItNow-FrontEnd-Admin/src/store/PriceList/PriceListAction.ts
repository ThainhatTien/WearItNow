import { AppDispatch } from "store";
import { PriceList, ProductPrice } from "types/PriceList";
import { getAllPriceLists, createPriceList, removePriceList, removeProductPrice, updateProductPrice, createProductPrice, getOneProductPrice, getAllProductPrice } from "services/ApiPriceList";
import { enqueueSnackbar } from "notistack";
// Action constants
export const PRICE_LIST_REQUEST = "PRICE_LIST_REQUEST";
export const PRICE_LIST_SUCCESS = "PRICE_LIST_SUCCESS";
export const PRICE_LIST_FAILURE = "PRICE_LIST_FAILURE";

// Action constants for ProductPrice
export const PRODUCT_PRICE_REQUEST = "PRODUCT_PRICE_REQUEST";
export const PRODUCT_PRICE_SUCCESS = "PRODUCT_PRICE_SUCCESS";
export const PRODUCT_PRICE_FAILURE = "PRODUCT_PRICE_FAILURE";

export const PRODUCT_PRICE_ADD_SUCCESS = "PRODUCT_PRICE_ADD_SUCCESS";
export const PRODUCT_PRICE_UPDATE_SUCCESS = "PRODUCT_PRICE_UPDATE_SUCCESS";
export const PRODUCT_PRICE_DELETE_SUCCESS = "PRODUCT_PRICE_DELETE_SUCCESS";
// General actions
const priceListRequest = () => ({ type: PRICE_LIST_REQUEST });
const priceListSuccess = (priceLists: PriceList[]) => ({
  type: PRICE_LIST_SUCCESS,
  payload: priceLists,
});
const priceListFailure = (error: string) => ({
  type: PRICE_LIST_FAILURE,
  payload: error,
});

// Fetch price lists
export const fetchPriceLists = () => async (dispatch: AppDispatch) => {
  dispatch(priceListRequest());
  try {
    const { data } = await getAllPriceLists();
    dispatch(priceListSuccess(data.result));
  } catch (error: any) {
    dispatch(priceListFailure(error.message));
  }
};

// Add price list
export const addPriceList = (newPriceList: PriceList) => async (dispatch: AppDispatch) => {
  dispatch(priceListRequest());
  try {
    await createPriceList(newPriceList);
    dispatch(fetchPriceLists()); // Refetch after success
    enqueueSnackbar('Thêm bảng giá thành công.', { variant: 'success' });
  } catch (error: any) {
    dispatch(priceListFailure(error.message));
    enqueueSnackbar('Thêm bảng giá thất bại.', { variant: 'error' });
  }
};

// Delete price list
export const deletePriceList = (priceListId: number) => async (dispatch: AppDispatch) => {
  dispatch(priceListRequest());
  try {
    await removePriceList(priceListId);
    dispatch(fetchPriceLists()); // Refetch after success
    enqueueSnackbar('Xóa bảng giá thành công.', { variant: 'success' });
  } catch (error: any) {
    dispatch(priceListFailure(error.message));
    enqueueSnackbar('Xóa sản phẩm thất bại.', { variant: 'error' });
  }
};


// General actions
const productPriceRequest = () => ({ type: PRODUCT_PRICE_REQUEST });
const productPriceFailure = (error: string) => ({
  type: PRODUCT_PRICE_FAILURE,
  payload: error,
});

// Fetch all ProductPrices
export const fetchProductPrices = () => async (dispatch: AppDispatch) => {
  dispatch(productPriceRequest());
  try {
    const { data } = await getAllProductPrice();
    dispatch({
      type: PRODUCT_PRICE_SUCCESS,
      payload: data.result,
    });
  } catch (error: any) {
    dispatch(productPriceFailure(error.message));
  }
};

// Fetch one ProductPrice
export const fetchOneProductPrice = (productPriceId: number) => async (dispatch: AppDispatch) => {
  dispatch(productPriceRequest());
  try {
    const { data } = await getOneProductPrice(productPriceId);
    dispatch({
      type: PRODUCT_PRICE_SUCCESS,
      payload: data.result, // Đưa vào mảng nếu cần
    });
  } catch (error: any) {
    dispatch(productPriceFailure(error.message));
  }
};

// Add a ProductPrice
export const addProductPrice = (newProductPrice: ProductPrice[], productPriceId: number) => async (dispatch: AppDispatch) => {
  dispatch(productPriceRequest());
  try {
    await createProductPrice(newProductPrice);
    dispatch(fetchOneProductPrice(productPriceId));
    dispatch({ type: PRODUCT_PRICE_ADD_SUCCESS });
    enqueueSnackbar('Thêm sản phẩm vào bảng giá thành công.', { variant: 'success' });
  } catch (error: any) {
    dispatch(productPriceFailure(error.message));
    enqueueSnackbar('Thêm sản phẩm vào bảng giá thất bại.', { variant: 'error' });
  }
};

// Update a ProductPrice
export const updateProductPriceAction = (id: number, productPriceId: number ,updatedProductPrice: ProductPrice) => async (
  dispatch: AppDispatch
) => {
  dispatch(productPriceRequest());
  try {
    await updateProductPrice(productPriceId, updatedProductPrice);
    dispatch(fetchOneProductPrice(id));
    dispatch({ type: PRODUCT_PRICE_UPDATE_SUCCESS });
    enqueueSnackbar('Cập nhật bảng giá sản phẩm thành công.', { variant: 'success' });
  } catch (error: any) {
    dispatch(productPriceFailure(error.message));
    enqueueSnackbar('Cập nhật bảng giá sản phẩm thất bại.', { variant: 'error' });
  }
};

// Delete a ProductPrice
export const deleteProductPrice = (id:number, productPriceId: number) => async (dispatch: AppDispatch) => {
  dispatch(productPriceRequest());
  try {
    await removeProductPrice(id);
    dispatch(fetchOneProductPrice(productPriceId));
    dispatch({ type: PRODUCT_PRICE_DELETE_SUCCESS });
    enqueueSnackbar('Xóa bảng giá thành công.', { variant: 'success' });
  } catch (error: any) {
    dispatch(productPriceFailure(error.message));
    enqueueSnackbar('Xóa bảng giá thất bại.', { variant: 'error' });
  }
};