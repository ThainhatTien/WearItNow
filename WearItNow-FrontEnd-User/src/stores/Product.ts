import {Result} from "../result/Result";
import {Response} from "../response/Response";
import {Category} from "./Category";
import {Inventories} from "./Inventories";

export interface Product {
    productId: number;         // bigint
    description?: string;      // varchar(255)
    images: {
        imageId: number;
        imageUrl: string
    }[];
    image?: string;            // varchar(255)
    isActive?: boolean;        // bit(1)
    name?: string;             // varchar(255)
    price?: number;            // decimal(38,2)
    category: Category
    inventories: Inventories[];
    averageRate: number;
    discountRate: number;
    originalPrice: number;
}

export interface ProductFilter {
    minPrice?: number | null;
    maxPrice?: number | null;
    color?: string | string[] | null;
    productSize?: number[];
    brand?: string | string[] | null;
}


export type ProductsResult = Response<Result<Product[]>>;
export type ProductsResponse = Response<Product[]>;
export type ProductResponse = Response<Product>;


