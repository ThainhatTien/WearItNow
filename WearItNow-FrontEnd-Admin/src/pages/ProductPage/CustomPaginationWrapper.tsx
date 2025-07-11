import CustomPagination from "./CustomPagination";

interface CustomPaginationWrapperProps {
    page: number; // Trang hiện tại
    totalPages: number; // Tổng số trang
    onPageChange: (newPage: number) => void; // Hàm gọi lại khi thay đổi trang
}

const CustomPaginationWrapper: React.FC<CustomPaginationWrapperProps> = (props) => {
    return <CustomPagination {...props} />; // Truyền các props trực tiếp xuống CustomPagination
};

export default CustomPaginationWrapper;