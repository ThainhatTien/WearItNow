import React, { useEffect, useState } from "react";
import FlastSaleProducts from "./FlastSale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";
import bannerSale from "../../assets/images/banner/Flash Sale Banner 5-20.webp";
import { useNavigate } from "react-router-dom";

const Promotion = () => {
  const navigate = useNavigate();

  // Hàm tính toán thời gian còn lại
  const calculateTimeLeft = () => {
    const targetDate = new Date("2025-01-30T00:00:00");
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // Dọn dẹp khi component unmount
  }, []);

  return (
    <>
      <div className="drop-shadow-xl">
        <img
          src={bannerSale}
          alt="Flash Sale Banner"
          className="w-full h-auto object-cover"
        />
      </div>

      <section className="my-2 text-center bg-white rounded-3xl overflow-hidden my-8">
        <div className="py-2 rounded-3xl shadow-xl border border-gray-300">
          <div className="flex flex-col sm:flex-row justify-between items-center mx-5">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-red-500">
              <FontAwesomeIcon icon={faBolt} style={{ color: "#FFD43B" }} />{" "}
              Siêu Ưu Đãi
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center bg-orange-500 text-white py-1 px-10 rounded-full text-lg sm:text-xl md:text-2xl">
              <span className="mr-2">Chỉ còn: </span>
              <div className="flex items-center bg-white text-orange-500 rounded-md py-1 px-3">
                <span className="font-bold text-xl">{timeLeft.hours}</span>
                <span className="mx-1">:</span>
                <span className="font-bold text-xl">{timeLeft.minutes}</span>
                <span className="mx-1">:</span>
                <span className="font-bold text-xl">{timeLeft.seconds}</span>
              </div>
            </div>
          </div>
          <FlastSaleProducts />
        </div>
      </section>
    </>
  );
};

export default Promotion;
