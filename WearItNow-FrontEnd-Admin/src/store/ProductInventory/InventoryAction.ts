
import { getAllInventoriesService, getProductInventoriesService, postInventoriesService, putInventoriesService } from 'services/ApiProductInventories';
import { AppDispatch } from 'store'; // Import AppDispatch
import { Inventory } from 'types/ProductTypes';


export const GET_ALL_INVENTORIES = 'GET_ALL_INVENTORIES';
export const FETCH_ALl_INVENTORIES_SUCCESS = 'FETCH_ALl_INVENTORIES_SUCCESS';
export const FETCH_ALL_INVENTORIES_FAILURE = 'FETCH_ALL_INVENTORIES_FAILURE';
export const FETCH_INVENTORIES_SUCCESS = 'FETCH_INVENTORIES_SUCCESS';
export const FETCH_INVENTORIES_FAILURE = 'FETCH_INVENTORIES_FAILURE';
export const ADD_INVENTORY = 'ADD_INVENTORY';
export const UPDATE_INVENTORY = 'UPDATE_INVENTORY';
export const DELETE_INVENTORY = 'DELETE_INVENTORY';


// Action để lấy tất cả inventories
export const getAllInventories = () => ({
  type: GET_ALL_INVENTORIES,
});
export const fetchAllInventoriesSuccess = (inventories: Inventory[]) => ({
  type: FETCH_ALl_INVENTORIES_SUCCESS,
  payload: inventories,
});

// Action để fetch inventories thất bại
export const fetchAllInventoriesFailure = (error: string) => ({
  type: FETCH_ALL_INVENTORIES_FAILURE,
  payload: error,
});
// Action để fetch inventories thành công
export const fetchInventoriesSuccess = (inventories: Inventory[]) => ({
  type: FETCH_INVENTORIES_SUCCESS,
  payload: inventories,
});

// Action để fetch inventories thất bại
export const fetchInventoriesFailure = (error: string) => ({
  type: FETCH_INVENTORIES_FAILURE,
  payload: error,
});

// Action để thêm inventory
export const addInventory = (inventory: Inventory) => ({
  type: ADD_INVENTORY,
  payload: inventory,
});

// Action để cập nhật inventory
export const updateInventory = (inventory: Inventory) => ({
  type: UPDATE_INVENTORY,
  payload: inventory,
});

// Action để xóa inventory
export const deleteInventory = (inventoryId: number) => ({
  type: DELETE_INVENTORY,
  payload: inventoryId,
});

// Thunk to fetch all inventories
export const fetchAllInventory = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(getAllInventories());
    try {
      const response = await getAllInventoriesService(); // Gọi API để lấy tất cả inventories
      dispatch(fetchAllInventoriesSuccess(response.data.result)); // Thành công
    } catch (error: any) {
      dispatch(fetchAllInventoriesFailure(error.message)); // Thất bại
    }
  };
};




// Thunk để fetch inventory theo id sản phẩm từ API
export const fetchInventoryByProductId = (productId: number) => {
  return async (dispatch: AppDispatch) => {
    // dispatch(getAllInventories()); // Bắt đầu quá trình lấy dữ liệu
    try {
      const response = await getProductInventoriesService(productId); // Gọi API với productId
      dispatch(fetchInventoriesSuccess(response.data.result)); // Thành công
    } catch (error: any) {
      dispatch(fetchInventoriesFailure(error.message)); // Thất bại
    }
  };
};


// Thunk để thêm inventory
export const createInventory = (inventory: Inventory) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await postInventoriesService(inventory); // Gọi API thêm mới
      dispatch(addInventory(response.data)); // Thành công
    } catch (error: any) {
      dispatch(fetchInventoriesFailure(error.message)); // Thất bại
    }
  };
};

// Thunk để cập nhật inventory
export const editInventory = (inventoryId: number, inventory: Inventory) => {
  return async (dispatch: AppDispatch) => {
    try {
      await putInventoriesService(inventoryId, inventory); // Gọi API cập nhật
      dispatch(updateInventory({ ...inventory, inventoryId: inventoryId })); // Thành công
    } catch (error: any) {
      dispatch(fetchInventoriesFailure(error.message)); // Thất bại
    }
  };
};
