import React from "react";
import Promotion from "../views/Home/Promotion";
import Slider from "../components/Slider";
import Categoris from "../views/Home/Categoris";
import Banner from "../views/Home/Banner";
import ProductCollection from "../views/Home/ProductCollection";

const Home: React.FC = () => {
  return (
    <>
      <main className="home-container">
        <div className="slider-container mb-8">
          {/* Slider hiển thị các hình ảnh hoặc nội dung nổi bật */}
          <Slider />
        </div>
        <div className="px-4 sm:px-6 md:px-8 lg:px-20">
          <Banner />
          {/* Phần hiển thị danh mục */}
          <Categoris />
          {/* Phần quảng cáo hoặc khuyến mãi */}
          <Promotion />
        </div>
        <div className="px-4 sm:px-6 md:px-8 lg:px-20 mt-8">
          {/* Sản phẩm, người bán hàng hàng đầu*/}
          <ProductCollection />
        </div>
        {/* <div className="px-4 sm:px-6 md:px-8 lg:px-20 mt-8">
          <NewsletterSubscription />
        </div> */}
      </main>
    </>
  );
};

export default Home;
