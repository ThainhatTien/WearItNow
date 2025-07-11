export interface Response<T> {
    products(products: any): unknown;
    code: number;
    result: T;
    total: number;
    totalElements: number; // Tùy chọn, có thể không có trong mọi phản hồi
    totalPages: number; // Tùy chọn, có thể không có trong mọi phản hồi
}