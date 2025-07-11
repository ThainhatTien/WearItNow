import { PriceList, ProductPrice } from "types/PriceList"
import axiosInstance from "./api.service"

const GET_API = 'prices'

export const getAllPriceLists = () => axiosInstance.get(GET_API)

export const getOnePriceList = (priceId: number) => axiosInstance.get(GET_API+'/'+priceId)

export const createPriceList = (priceList : PriceList) => axiosInstance.post(GET_API, priceList)

export const removePriceList = (priceId: number) => axiosInstance.delete(GET_API+'/'+priceId)


const GET_API_PRODUCT_PRICE = 'product-prices'

export const getAllProductPrice = () => axiosInstance.get(GET_API_PRODUCT_PRICE)

export const getOneProductPrice = (productPriceId: number) => axiosInstance.get(GET_API_PRODUCT_PRICE+'/by-price-id/'+productPriceId)

export const createProductPrice = (productPrice : ProductPrice[]) => axiosInstance.post(GET_API_PRODUCT_PRICE, productPrice)

export const updateProductPrice = (id: number, productPrice : ProductPrice) =>axiosInstance.put(GET_API_PRODUCT_PRICE+'/'+id,productPrice)

export const removeProductPrice = (productPriceId: number) => axiosInstance.delete(GET_API_PRODUCT_PRICE+'/'+productPriceId)

