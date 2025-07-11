import {Response} from "../response/Response";

export interface Comment {
    commentId: number;
    productId: number;
    userId: number;
    content: string;
    rate: number;
    createdAt: string;
    comments: Comment[]; // Bình luận con
    parentId?: number; // Chỉ có trong bình luận con
    created?: string; // Chỉ có trong bình luận con, ví dụ như "6 ngày trước"
}

export interface ProductComment {
    productId: number;
    comments: Comment[];
    averageRate: number;
}

export interface CommentData {
    productId: number,
    userId: number,
    rate: number,
    content: string,
}
    
    

export type ProductCommentsResponse = Response<ProductComment>;

