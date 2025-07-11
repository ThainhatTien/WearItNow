export interface Result<T> {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalElements: number;
    total: number;
    data: T; // Danh sách sản phẩm
}

