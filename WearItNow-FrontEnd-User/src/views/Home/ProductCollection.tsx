import React, { useState } from 'react';
import NewProducts from "./NewProducts";
import FeaturedProducts from "./FeaturedProducts";
import TrendingOutfits from "./TrendingOutfits";
import bannerTopProduct from "../../assets/images/banner/BANNER COLLECTION 1800X600px CTA.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTags, faNewspaper } from "@fortawesome/free-solid-svg-icons";

const ProductCollection = () => {
    const [activeTab, setActiveTab] = useState('1'); // Quản lý trạng thái của tab

    const tabs = [
        {
            title: 'Sản Phẩm Mới',
            key: '1',
            content: <NewProducts />,
            icon: faStar,
            color: "#FFD43B"
        },
        {
            title: 'Sản Phẩm Nổi Bật',
            key: '2',
            content: <FeaturedProducts />,
            icon: faNewspaper,
            color: "#74C0FC"
        },
        {
            title: 'Sản Phẩm Xu Hướng',
            key: '3',
            content: <TrendingOutfits />,
            icon: faTags,
            color: "#63E6BE"
        },
    ];

    return (
        <div className="product-collection">
            {/* Banner hình ảnh */}
            <div className="drop-shadow-xl">
                <img src={bannerTopProduct} alt="Top Product Collection" className="w-full h-auto object-cover" />
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation mt-8">
                <div className="flex justify-center items-center border rounded-2xl bg-white">
                    <div className="tab-titles text-center text-xl m-4 font-bold">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-2 transition-colors duration-300 ease-in-out ${
                                    activeTab === tab.key
                                        ? 'text-black border-b-2 border-red-500'
                                        : 'text-black hover:border-b-2 border-red-500'
                                }`}
                            >
                                <FontAwesomeIcon
                                    className="mr-1"
                                    icon={tab.icon}
                                    beat
                                    style={{ color: tab.color }}
                                />
                                {tab.title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="tab-content my-2">
                {tabs.find(tab => tab.key === activeTab)?.content}
            </div>
        </div>
    );
};

export default ProductCollection;
