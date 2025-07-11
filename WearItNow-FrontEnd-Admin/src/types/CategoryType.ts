import { Product } from "./ProductTypes";
import { Supplier } from "./supplierTypes";
export interface CategoryWithId extends Category {
  categoryId: number;
}

export interface Category {
    name: string;
    // image: string;
    description: string;
    status: boolean;
    slug: string;
    deleted?: boolean;
    parentId: number | null;
    supplierId: number| null;
    supplier?: Supplier;
    subCategories?: CategoryWithId[];
    products?: Product[];
    // supplierId: number;
  }