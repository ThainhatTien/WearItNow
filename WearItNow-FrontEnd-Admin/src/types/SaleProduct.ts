import { Product } from "./ProductTypes"

export interface SaleProduct {
    id:number
    product: Product
    discountRate: number
    productId: number;
    startDate: string
    endDate: string
}