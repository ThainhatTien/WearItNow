import {
  GET_DISCOUNT_PRICES_REQUEST,
  GET_DISCOUNT_PRICES_SUCCESS,
  GET_DISCOUNT_PRICES_FAILURE,
  GET_DISCOUNT_PRICE_BY_ID_REQUEST,
  GET_DISCOUNT_PRICE_BY_ID_SUCCESS,
  GET_DISCOUNT_PRICE_BY_ID_FAILURE,
  CREATE_DISCOUNT_PRICE_REQUEST,
  CREATE_DISCOUNT_PRICE_SUCCESS,
  CREATE_DISCOUNT_PRICE_FAILURE,
  REMOVE_DISCOUNT_PRICE_REQUEST,
  REMOVE_DISCOUNT_PRICE_SUCCESS,
  REMOVE_DISCOUNT_PRICE_FAILURE,
} from './SaleProductAction';

const initialState = {
  discountProducts: [],
  currentPagediscountProducts: 1,
  totalPagesdiscountProducts: 0,
  pageSizediscountProducts: 10,
  totalElementsdiscountProducts: 0,
  loading: false,
  error: null,
  selectedDiscountPrice: null,
};

const saleProductReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_DISCOUNT_PRICES_REQUEST:
    case GET_DISCOUNT_PRICE_BY_ID_REQUEST:
    case CREATE_DISCOUNT_PRICE_REQUEST:
    case REMOVE_DISCOUNT_PRICE_REQUEST:
      return { ...state, loading: true };

    case GET_DISCOUNT_PRICES_SUCCESS:
      return {
        ...state,
        loading: false,
        discountProducts: action.payload.discountProducts,
        currentPagediscountProducts: action.payload.currentPagediscountProducts,
        totalPagesdiscountProducts: action.payload.totalPagesdiscountProducts,
        pageSizediscountProducts: action.payload.pageSizediscountProducts,
        totalElementsdiscountProducts: action.payload.totalElementsdiscountProducts,
      };

    case GET_DISCOUNT_PRICE_BY_ID_SUCCESS:
      return { ...state, loading: false, selectedDiscountPrice: action.payload };

    case CREATE_DISCOUNT_PRICE_SUCCESS:
      return {
        ...state,
        loading: false,
        discountPrices: [...state.discountProducts, action.payload],
      };

    case REMOVE_DISCOUNT_PRICE_SUCCESS:
      return {
        ...state,
        loading: false,
        discountPrices: state.discountProducts.filter((price: any) => price.id !== action.payload),
      };

    case GET_DISCOUNT_PRICES_FAILURE:
    case GET_DISCOUNT_PRICE_BY_ID_FAILURE:
    case CREATE_DISCOUNT_PRICE_FAILURE:
    case REMOVE_DISCOUNT_PRICE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default saleProductReducer;
