import React, {useEffect, useRef, useState} from 'react';
import {CSSTransition} from 'react-transition-group';
import '../styles/FadeInSlideUp.css';

interface FadeInSlideUpProps {
    children: React.ReactNode; // Kiểu cho children
}

const FadeInSlideUp: React.FC<FadeInSlideUpProps> = ({children}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    const handleScroll = () => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            // Kiểm tra nếu phần tử nằm trong màn hình
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                setIsVisible(true);
                window.removeEventListener('scroll', handleScroll); // Ngăn thêm sự kiện khi đã có hiệu ứng
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        // Đảm bảo xóa sự kiện khi component bị unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div ref={ref}>
            <CSSTransition
                in={isVisible}
                timeout={1000}
                classNames="fade-slide"
                unmountOnExit
            >
                <div className="fade-slide-content">
                    {children}
                </div>
            </CSSTransition>
        </div>
    );
};

export default FadeInSlideUp;