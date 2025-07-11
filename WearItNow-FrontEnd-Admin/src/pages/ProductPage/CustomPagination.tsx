import React from 'react';
import { Pagination } from '@mui/material';

interface CustomPaginationProps {
    page: number; // Trang hiện tại (zero-based)
    totalPages: number; // Tổng số trang
    onPageChange: (newPage: number) => void; // Hàm gọi lại khi thay đổi trang
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ page, totalPages, onPageChange }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
            <Pagination
                count={totalPages} // Tổng số trang
                page={page} // Chuyển đổi từ zero-based index sang one-based index
                onChange={(_, newPage: number) => onPageChange(newPage - 1)}
                siblingCount={1} // Hiển thị 1 số liền kề bên trái và phải
                boundaryCount={1} // Hiển thị 1 số ở rìa ngoài cùng
            />
            <span>{`Page ${page} of ${totalPages}`}</span>
        </div>
    );
};

export default CustomPagination;
