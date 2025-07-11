import {SubCategory} from "./SubCategory";
import {Response} from "../response/Response";
import {Result} from "../result/Result";

export interface Category {
    categoryId: number;
    name: string;
    image: string;
    description: string;
    status: boolean;
    slug: string;
    parentId: number | null;
    subCategories: SubCategory[];
}

export type CategoriesResult = Response<Result<Category[]>>;
export type CategoriesResponse = Response<Category[]>;

