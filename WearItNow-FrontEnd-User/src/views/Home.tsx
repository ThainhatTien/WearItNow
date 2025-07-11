import React from "react";
import { Carousel } from "antd";
import "../styles/slider.css";

const Home = () => {
  const images = [
    "https://via.placeholder.com/800x400?text=Slide+1",
    "https://via.placeholder.com/800x400?text=Slide+2",
    "https://via.placeholder.com/800x400?text=Slide+3",
  ];
  // test
  return (
    <Carousel autoplay>
      {images.map((image, index) => (
        <div key={index}>
          <img
            src={image}
            alt={`Slide ${index + 1}`}
            className="slider-image"
          />
        </div>
      ))}
    </Carousel>
  );
};
export default Home;
