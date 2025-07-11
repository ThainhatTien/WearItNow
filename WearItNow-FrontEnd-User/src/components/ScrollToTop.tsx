import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const location = useLocation(); // Lấy thông tin location

    useEffect(() => {
        // Cuộn lên đầu trang khi pathname thay đổi
        window.scrollTo(0, 0);
    }, [location.key]); // Lắng nghe key thay đổi, điều này sẽ kích hoạt khi back button được nhấn

    return null;
};

export default ScrollToTop;
