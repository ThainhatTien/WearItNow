import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Header: React.FC = () => {
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
    };

    const texts = [
        "Chào mừng bạn đến với cửa hàng của chúng tôi!",
        "Khám phá bộ sưu tập sản phẩm mới nhất.",
        "Giảm giá lên đến 50% cho các sản phẩm chọn lọc!",
        "Đặt hàng ngay hôm nay để nhận ưu đãi đặc biệt.",
    ];

    return (
        <div>
            <div className="bg-red-500">
                <Slider {...settings} className="flex items-center justify-center">
                    {texts.map((text, index) => (
                        <div key={index} className="flex items-center justify-center">
                            <div className="flex items-center justify-center">
                                <span className="text-center p-2.5 text-xl text-white rounded-lg font-mono font-semibold leading-6">
                                    {text}
                                </span>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default Header;