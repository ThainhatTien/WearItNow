import { CategoryWithId } from "./CategoryType";

// types.ts
export interface Inventory {
  inventoryId?: number,
  color: string;
  size: string;
  quantity: number;
  productId: number;
  purchasePrice: number;
}

export interface Product {
  productId: number;
  name?: string;
  description?: string;
  price?: number;
  images: ProductImage[];
  image?: string;
  originalPrice: number;
  category?: CategoryWithId;
  categoryId:number;
  isActive?: boolean;
  inventories:Inventory[]
}
export interface ProductImage {
  imageId: number;
  imageUrl: string;

}
