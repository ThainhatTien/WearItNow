import React, { useState, useEffect } from "react";
import iconVanChuyen from "../../assets/images/icon/ser_1.webp";
import iconTichDiem from "../../assets/images/icon/ser_2.webp";
import iconThanhToan from "../../assets/images/icon/ser_3.webp";
import iconHoanTien from "../../assets/images/icon/ser_4.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift } from "@fortawesome/free-solid-svg-icons";

const Banner: React.FC = () => {
  return (
    <>
      <div className="my-8">
        <h2 className="font-bold text-lg mb-6 px-4">
          <FontAwesomeIcon
            icon={faGift}
            className="mr-1"
            style={{ color: "#d90d0d" }}
          />
          Ưa Đãi Dành Cho Người Dùng Có Tài Khoản
        </h2>
        <div className="grid gap-4 mt-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-lg shadow-md flex flex-col md:flex-row">
            <div className="bg-yellow-400 px-8 rounded-t-lg md:rounded-l-lg flex items-center">
              <p className="font-bold">WIN10</p>
            </div>
            <div className="p-4 flex-1">
              <p className="font-bold">GIẢM 11%</p>
              <p className="text-sm">Mã: WIN10</p>
              <p className="text-sm">HSD: 30/01/2025</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md flex flex-col md:flex-row">
            <div className="bg-yellow-400 px-8 rounded-t-lg md:rounded-l-lg flex items-center">
              <p className="font-bold">WIN50</p>
            </div>
            <div className="p-4 flex-1">
              <p className="font-bold">GIẢM 50K</p>
              <p className="text-sm">Mã: WIN50</p>
              <p className="text-sm">HSD: 30/01/2025</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md flex flex-col md:flex-row">
            <div className="bg-yellow-400 px-8 rounded-t-lg md:rounded-l-lg flex items-center">
              <p className="font-bold">WIN80</p>
            </div>
            <div className="p-4 flex-1">
              <p className="font-bold">GIẢM 80K</p>
              <p className="text-sm">Mã: WIN80</p>
              <p className="text-sm">HSD: 30/01/2025</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md flex flex-col md:flex-row">
            <div className="bg-yellow-400 px-8 rounded-t-lg md:rounded-l-lg flex items-center">
              <p className="font-bold">WIN80</p>
            </div>
            <div className="p-4 flex-1">
              <p className="font-bold">GIẢM 80K</p>
              <p className="text-sm">Mã: WIN80</p>
              <p className="text-sm">HSD: 30/01/2025</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div className="flex items-center border rounded-lg p-4 bg-white shadow-lg">
          <img src={iconVanChuyen} className="h-16 mr-2" alt="Vận chuyển" />
          <p className="text-sm">
            Vận chuyển <b>MIỄN PHÍ</b> trong khu vực <b>TP.HCM</b>
          </p>
        </div>
        <div className="flex items-center border rounded-lg p-4 bg-white shadow-lg">
          <img src={iconTichDiem} className="h-16 mr-2" alt="Tích điểm" />
          <p className="text-sm">
            Tích điểm Nâng hạng <b>THẺ THÀNH VIÊN</b>
          </p>
        </div>
        <div className="flex items-center border rounded-lg p-4 bg-white shadow-lg">
          <img src={iconThanhToan} className="h-16 mr-2" alt="Thanh toán" />
          <p className="text-sm">
            Tiến hành <b>THANH TOÁN</b> với nhiều <b>PHƯƠNG THỨC</b>
          </p>
        </div>
        <div className="flex items-center border rounded-lg p-4 bg-white shadow-lg">
          <img src={iconHoanTien} className="h-16 mr-2" alt="Hoàn tiền" />
          <p className="text-sm">
            100% <b>HOÀN TIỀN</b> nếu sản phẩm lỗi
          </p>
        </div>
      </div>
    </>
  );
};

export default Banner;
