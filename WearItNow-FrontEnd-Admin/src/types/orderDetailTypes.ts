import { Order } from "types/orderTypes";
import { Product } from "types/ProductTypes";

export interface OrderDetail extends Product {
  orderDetailId: number;
  price: number;
  order: Order;
  // product: Product;
  color: string;
  size: string;
  quantity: number;
}