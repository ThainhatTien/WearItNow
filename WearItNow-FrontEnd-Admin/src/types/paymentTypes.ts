
import { PaymentTypes } from "types/paymentTypeTypes";
import { Order } from "./orderTypes";



export interface Payment {
    paymentId: number;
    amount: number;
    paymentStatus: string;
    expected_delivery_time: string;  // Định dạng ISO 8601 (ví dụ: "2024-11-11T23:59:59Z")
    order: Order;
    payment_status: string;
    paymentType: PaymentTypes;
    // payment_status: string;
}