// orderTypes.ts
import { Payment } from "types/paymentTypes";
import { UserType } from "types/User.type";
import { OrderDetail } from "./orderDetailTypes";

// Enum cho trạng thái đơn hàng
export enum OrderStatus {
  ALL = "Tất Cả",
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED"
}

export interface Order  extends Payment{
  orderId: number;
  orderAmount: number;
  orderTotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  order_code: string;
  user: UserType;
  userId: number | null;
  status: OrderStatus;

  orderDetails: OrderDetail[];
}
