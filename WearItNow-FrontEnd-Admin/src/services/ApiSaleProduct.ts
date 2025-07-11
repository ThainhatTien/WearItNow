
import { SaleProduct } from "types/SaleProduct"
import axiosInstance from "./api.service"

const GET_API = 'discount-price';

export const getAllDiscountPrices = () => axiosInstance.get(GET_API);

export const getDiscountPriceById = (id: number) => axiosInstance.get(`${GET_API}/${id}`);

export const createDiscountPrice = (saleProduct: SaleProduct) => axiosInstance.post(GET_API, saleProduct);

export const updateDiscountPrice = (id: number, saleProduct: SaleProduct) => axiosInstance.put(GET_API+'/'+id, saleProduct);

export const removeDiscountPrice = (id: number) => axiosInstance.delete(`${GET_API}/${id}`);


