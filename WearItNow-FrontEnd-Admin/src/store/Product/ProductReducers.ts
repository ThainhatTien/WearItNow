import { Product } from "types/ProductTypes";
import { 
  GET_ALL_PRODUCTS, 
  FETCH_PRODUCTS_SUCCESS, 
  FETCH_PRODUCTS_FAILURE, 
  ADD_PRODUCT, 
  UPDATE_PRODUCT, 
  DELETE_PRODUCT, 
  SET_CURRENT_PAGE, 
  SET_PAGE_SIZE, 
  GET_ONE_PRODUCT,
  FETCH_ONE_PRODUCT_FAILURE,
  FETCH_ONE_PRODUCT_SUCCESS
} from './ProductAction';

interface ProductState {
  product:Product | null;
  products: Product[]; 
  productCurrentPage: number;
  productPageSize: number;
  totalElements: number;
  totalProductPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  product: null,
  products: [],
  productCurrentPage: 1,
  productPageSize: 10,
  totalProductPages: 0,
  totalElements: 0,
  loading: false,
  error: null,
};

const productReducer = (state = initialState, action: any): ProductState => {
  switch (action.type) {
    case GET_ALL_PRODUCTS:
    case GET_ONE_PRODUCT:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        productCurrentPage: action.payload.productCurrentPage,
        productPageSize: action.payload.productPageSize,
        totalElements: action.payload.totalElements,
        totalProductPages: action.payload.totalProductPages,
      };
      case FETCH_ONE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        product: action.payload,
      };
    case FETCH_PRODUCTS_FAILURE:
    case FETCH_ONE_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      
    case SET_CURRENT_PAGE:
      return {
        ...state,
        productCurrentPage: action.payload,
      };

    case SET_PAGE_SIZE:
      return {
        ...state,
        productPageSize: action.payload,
      };

    case ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, action.payload], // Thêm sản phẩm mới
      };

    case UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map(product =>
          product.productId === action.payload.id ? action.payload : product
        ), // Cập nhật sản phẩm
      };

    case DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(product => product.productId !== action.payload), // Xóa sản phẩm
      };

    default:
      return state;
  }
};

export default productReducer;
