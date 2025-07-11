import { Inventory } from 'types/ProductTypes';
import {
  ADD_INVENTORY,
  DELETE_INVENTORY,
  FETCH_ALL_INVENTORIES_FAILURE,
  FETCH_ALl_INVENTORIES_SUCCESS,
  FETCH_INVENTORIES_FAILURE,
  FETCH_INVENTORIES_SUCCESS,
  GET_ALL_INVENTORIES,
  UPDATE_INVENTORY,
} from './InventoryAction';

// State ban đầu
interface InventoryState {
  inventories: Inventory[];
  inventoriesProduct: Inventory[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  inventories: [],
  inventoriesProduct: [],
  loading: false,
  error: null,
};

// Reducer
export const inventoryReducer = (state = initialState, action: any): InventoryState => {
  switch (action.type) {
    case GET_ALL_INVENTORIES:
      return { ...state, loading: true };

    case FETCH_ALl_INVENTORIES_SUCCESS:
      return { ...state, loading: false, inventories: action.payload };

    case FETCH_ALL_INVENTORIES_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case FETCH_INVENTORIES_SUCCESS:
      return { ...state, loading: false, inventoriesProduct: action.payload };

    case FETCH_INVENTORIES_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case ADD_INVENTORY:
      return { ...state, inventories: [action.payload, ...state.inventories] };

    case UPDATE_INVENTORY:
      return {
        ...state,
        inventories: state.inventories.map((inventory) =>
          inventory.inventoryId === action.payload.id ? action.payload : inventory,
        ),
      };

    case DELETE_INVENTORY:
      return {
        ...state,
        inventories: state.inventories.filter(
          (inventory) => inventory.inventoryId !== action.payload,
        ),
      };

    default:
      return state;
  }
};
