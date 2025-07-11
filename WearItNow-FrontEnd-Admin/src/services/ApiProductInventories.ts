import { Inventory } from "types/ProductTypes";
import axiosInstance from "./api.service"

export const GET_API = 'inventories'


export const  getProductInventoriesService = (productId: number) => axiosInstance.get(GET_API+'/product/'+productId);

export const getAllInventoriesService = () => axiosInstance.get(GET_API)

export const getInventoriesService = (inventoryId: number) => axiosInstance.get(GET_API+'/'+inventoryId);

export const putInventoriesService = (inventoryId: number, inventory: Inventory) => axiosInstance.put(GET_API+'/'+inventoryId, inventory);

export const postInventoriesService = (inventory: Inventory) => axiosInstance.post(GET_API, inventory);
