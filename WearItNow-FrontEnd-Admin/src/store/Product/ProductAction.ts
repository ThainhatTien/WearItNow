import { DeleteProductService, getAllProductService, getOneProductService, postProductService, putProductService } from "services/ApiProducts";
import { Product } from "types/ProductTypes";
import { AppDispatch } from 'store'; // Import AppDispatch
import { enqueueSnackbar } from "notistack";

// Action Types
export const GET_ALL_PRODUCTS = 'GET_ALL_PRODUCTS';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

export const ADD_PRODUCT = 'ADD_PRODUCT';
export const ADD_PRODUCT_SUCCESS = 'ADD_PRODUCT_SUCCESS';
export const ADD_PRODUCT_FAILURE = 'ADD_PRODUCT_FAILURE';

export const GET_ONE_PRODUCT = 'GET_ONE_PRODUCT';
export const FETCH_ONE_PRODUCT_SUCCESS = 'FETCH_ONE_PRODUCT_SUCCESS';
export const FETCH_ONE_PRODUCT_FAILURE = 'FETCH_ONE_PRODUCT_FAILURE';

export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const UPDATE_PRODUCT_SUCCESS = 'UPDATE_PRODUCT_SUCCESS';
export const UPDATE_PRODUCT_FAILURE = 'UPDATE_PRODUCT_FAILURE';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const DELETE_PRODUCT_SUCCESS = 'DELETE_PRODUCT_SUCCESS';
export const DELETE_PRODUCT_FAILURE = 'DELETE_PRODUCT_FAILURE';

export const SET_PAGE_SIZE = 'SET_PAGE_SIZE';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';


// Fetch Products
export const getAllProducts = () => ({
  type: GET_ALL_PRODUCTS,
});

// Fetch Products Success
export const fetchProductsSuccess = (
  products: Product[],                                                                                        
  productCurrentPage: number,
  productPageSize: number,
  totalElements: number,
  totalProductPages: number
) => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: {
    products,
    productCurrentPage,
    productPageSize,
    totalElements,
    totalProductPages,
  },
});

// Fetch Products Failure
export const fetchProductsFailure = (error: string) => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: error,
});

// Get One Product
export const getOneProduct = (productId: number) => ({
  type: GET_ONE_PRODUCT,
  payload: productId,
});

// Get One Product Success
export const fetchOneProductSuccess = (product: Product) => ({
  type: FETCH_ONE_PRODUCT_SUCCESS,
  payload: product,
});

// Get One Product Failure
export const fetchOneProductFailure = (error: string) => ({
  type: FETCH_ONE_PRODUCT_FAILURE,
  payload: error,
});

// Fetch One Product
export const fetchOneProduct = (productId: number) => {
  return async (dispatch: AppDispatch) => {
    dispatch(getOneProduct(productId)); // Bắt đầu quá trình lấy dữ liệu sản phẩm
    try {
      const response = await getOneProductService(productId);
      dispatch(fetchOneProductSuccess(response.data.result)); 
    } catch (error: any) {
      dispatch(fetchOneProductFailure(error.message));
    }
  };
};

// Add Product
export const handleAddProducts = (formData: FormData, searchParams: { 
  productName: string; 
  categoryId?: number; 
  color: string; 
  productSize: string; 
  size: number; 
  page: number 
}) => {
  return async (dispatch: AppDispatch) => {
    try {
      await postProductService(formData); // Gọi API thêm sản phẩm
      dispatch({ type: ADD_PRODUCT_SUCCESS }); // Thêm sản phẩm thành công
      enqueueSnackbar('Thêm sản phẩm thành công.', { variant: 'success' });
      dispatch(fetchProductsBySearch(searchParams)); // Fetch lại danh sách sản phẩm
    } catch (error: any) {
      enqueueSnackbar('Thêm sản phẩm thất bại.', { variant: 'error' });
      dispatch({ type: ADD_PRODUCT_FAILURE, payload: error.message }); // Thêm sản phẩm thất bại
    }
  };
};

// Update Product
export const handleUpdateProduct = (productId: number, formData: FormData, searchParams: { 
  productName: string; 
  categoryId?: number; 
  color: string; 
  productSize: string; 
  size: number; 
  page: number 
}) => {
  return async (dispatch: AppDispatch) => {
    try {
      await putProductService(productId, formData); // Gọi API cập nhật sản phẩm
      dispatch({ type: UPDATE_PRODUCT_SUCCESS }); // Cập nhật sản phẩm thành công
      enqueueSnackbar('Cập nhật sản phẩm thành công.', { variant: 'success' });
      dispatch(fetchProductsBySearch(searchParams)); // Fetch lại danh sách sản phẩm
    } catch (error: any) {
      enqueueSnackbar('cập nhật sản phẩm thất bại.', { variant: 'error' });
      dispatch({ type: UPDATE_PRODUCT_FAILURE, payload: error.message }); // Cập nhật sản phẩm thất bại
    }
  };
};

// Delete Product
export const deleteProduct = (productId: number, searchParams: { 
  productName: string; 
  categoryId?: number; 
  color: string; 
  productSize: string; 
  size: number; 
  page: number }) => {
  return async (dispatch: AppDispatch) => {
    try {
      await DeleteProductService(productId); // Gọi API xóa sản phẩm
      dispatch(fetchProductsBySearch(searchParams));
      enqueueSnackbar('Xóa sản phẩm thành công.', { variant: 'success' });
      dispatch({ type: DELETE_PRODUCT_SUCCESS, payload: productId }); // Xóa sản phẩm thành công
    } catch (error: any) {
      enqueueSnackbar('Xóa sản phẩm thất bại.', { variant: 'error' });
      dispatch({ type: DELETE_PRODUCT_FAILURE, payload: error.message }); // Xóa sản phẩm thất bại
    }
  };
};

// Fetch Products by Search Params
export const fetchProductsBySearch = (searchParams: { 
  productName: string; 
  categoryId?: number; 
  size: number; 
  page: number; 
  color?: string; 
  productSize?: string 
}) => {
  return async (dispatch: AppDispatch) => {
    dispatch(getAllProducts()); // Bắt đầu quá trình lấy dữ liệu sản phẩm
    try {
      // Gọi API với các tham số tìm kiếm đã được chuẩn bị
      const response = await getAllProductService(searchParams.page, searchParams.size, {
        productName: searchParams.productName || undefined,  
        categoryId: searchParams.categoryId || undefined,    
        color: searchParams.color || undefined,             
        productSize: searchParams.productSize || undefined,  
      });

      // Kiểm tra và lấy dữ liệu trả về từ response
      const { currentPage, totalPages, totalElements, pageSize, data } = response.data.result;
      
      // Dispatch hành động thành công với dữ liệu nhận được
      dispatch(fetchProductsSuccess(data, currentPage, pageSize, totalElements, totalPages)); 
    } catch (error: any) {
      dispatch(fetchProductsFailure(error.message)); // Fetch thất bại
    }
  };
};

// Set Page Size
export const setProductPageSize = (size: number) => ({
  type: SET_PAGE_SIZE,
  payload: size,
});

// Set Current Page
export const setProductCurrentPage = (page: number) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});
