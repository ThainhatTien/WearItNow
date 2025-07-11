import { PriceList } from "types/PriceList";
import {
  PRICE_LIST_REQUEST,
  PRICE_LIST_SUCCESS,
  PRICE_LIST_FAILURE,
} from "./PriceListAction";

interface PriceListState {
  priceLists: PriceList[];
  loading: boolean;
  error: string | null;
}

const initialState: PriceListState = {
  priceLists: [],
  loading: false,
  error: null,
};

const priceListReducer = (state = initialState, action: any): PriceListState => {
  switch (action.type) {
    case PRICE_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case PRICE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        priceLists: action.payload,
      };

    case PRICE_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default priceListReducer;
