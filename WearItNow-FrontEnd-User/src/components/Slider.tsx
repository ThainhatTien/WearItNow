import React, { useState } from "react";
import banner1 from "../assets/images/banner/banner.webp";
import banner2 from "../assets/images/banner/spmoi_topbanner_desktop-30sep.webp";
import banner3 from "../assets/images/banner/hw_topbanner_desktop-18.09.webp";
import banner4 from "../assets/images/banner/giatot_topbanner_desktop-12aug.webp";

const Slider = () => {
  const images = [banner1, banner2, banner3, banner4];
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full">
      <div className="overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-auto transition-transform duration-500 ease-in-out"
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center space-x-2 bg-black bg-opacity-50 p-2 rounded-full">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ease-in-out ${
                currentIndex === index ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-300 ease-in-out"
      >
        &#10094; {/* Left arrow */}
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-300 ease-in-out"
      >
        &#10095; {/* Right arrow */}
      </button>
    </div>
  );
};

export default Slider;
