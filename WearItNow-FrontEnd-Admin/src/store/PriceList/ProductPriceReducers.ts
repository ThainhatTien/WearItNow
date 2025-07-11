import { ProductPrice } from "types/PriceList";
import {
    PRODUCT_PRICE_REQUEST,
    PRODUCT_PRICE_SUCCESS,
    PRODUCT_PRICE_FAILURE,
    PRODUCT_PRICE_ADD_SUCCESS,
    PRODUCT_PRICE_UPDATE_SUCCESS,
    PRODUCT_PRICE_DELETE_SUCCESS,
  } from "./PriceListAction";

  
  interface ProductPriceState {
    productPrices: ProductPrice[];
    loading: boolean;
    error: string | null;
  }
  
  const initialState: ProductPriceState = {
    productPrices: [],
    loading: false,
    error: null,
  };
  
  const productPriceReducer = (state = initialState, action: any): ProductPriceState => {
    switch (action.type) {
      case PRODUCT_PRICE_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
  
      case PRODUCT_PRICE_SUCCESS:
        return {
          ...state,
          loading: false,
          productPrices: action.payload,
        };
  
      case PRODUCT_PRICE_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
  
      case PRODUCT_PRICE_ADD_SUCCESS:
      case PRODUCT_PRICE_UPDATE_SUCCESS:
      case PRODUCT_PRICE_DELETE_SUCCESS:
        return {
          ...state,
          loading: false,
        };
  
      default:
        return state;
    }
  };
  
  export default productPriceReducer;
  