import {CartItem} from "./Cart";

export interface Order {
    orderId: number,
    order_code: string,
    shippingFee: number,
    status: string,
    payment_status: string,
    totalAmount: number,
    totalOrder: number,
    userId: number | null,
    orderDetails: [CartItem],
    expected_delivery_time: string,
}