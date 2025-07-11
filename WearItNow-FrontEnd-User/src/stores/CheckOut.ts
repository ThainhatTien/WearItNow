export interface CheckoutItem {
    productId: number;
    quantity: number;
    size: string;
    color: string;
}

export interface CheckoutRequest {
    userId: number | null;
    paymentMethodId: number;
    serviceTypeId: number,
    items: CheckoutItem[];
}

export interface AddressRequest {
    toName: string;
    toPhone: string;
    toWardCode: number;
    toAddress: string;
    toDistrictId: number;
}
  