import React from "react";
import nam from "../../assets/images/nam_spmoi-04Oct.webp";
import nu from "../../assets/images/nu_spmoi-04Oct.webp";
import trai from "../../assets/images/boy_spmoi-04Oct.webp";
import gai from "../../assets/images/girl_spmoi-04Oct.webp";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";

const Categoris = () => {
    const products = [
        {
            id: 1,
            image: nam,
            slug: "thoi-trang-nam",
        },
        {
            id: 2,
            image: nu,
            slug: "thoi-trang-nu",
        },
        {
            id: 3,
            image: trai,
            slug: "thoi-trang-be-trai",
        },
        {
            id: 4,
            image: gai,
            slug: "thoi-trang-be-gai",
        },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-xl font-bold mb-6">
                <FontAwesomeIcon icon={faFolder} className="mr-1" style={{ color: "#e4e70d" }} />
                Danh Mục
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div className="relative" key={product.id}>
                        <Link to={`/category/${product.slug}`}>
                            <img
                                alt={product.slug}
                                className="w-full h-auto rounded-2xl object-cover"
                                src={product.image}
                            />
                        </Link>
                    </div>
                ))}
            </div>
            <div className="fixed bottom-4 right-4">
                <button className="bg-gray-800 text-white p-3 rounded-full shadow-lg">
                    <i className="fas fa-comments"></i>
                </button>
            </div>
        </div>
    );
};

export default Categoris;
