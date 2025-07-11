export interface PriceList {
    id: number;
    code: string,
    name: string,
    startDate: string;
    endDate: string
}

export interface ProductPrice{
    id?:number;
    productPriceId:number;
    name?:string;
    productId:number;
    priceValue: number;
}