import React from "react";
import { Link, useNavigate } from "react-router-dom";

// Định nghĩa kiểu cho props
interface VoucherCardProps {
  title: string;
  description: string;
  code: string;
  expiration: string;
}

const VoucherCard: React.FC<VoucherCardProps> = ({
  title,
  description,
  code,
  expiration,
}) => {
  const navigate = useNavigate(); 

  const handleBuyNow = () => {
    navigate("/product"); 
  };

  return (
    <div className="w-1/2 bg-white border rounded-lg p-4 shadow">
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-gray-500 mb-2">{description}</p>
      <p className="text-red-500 mb-2">{code}</p>
      <p className="text-red-500 mb-4">Sắp hết hạn: {expiration}</p>
      <div className="flex justify-end items-center">
        <button
          onClick={handleBuyNow} // Thêm sự kiện onClick để điều hướng
          className="bg-white border border-blue-500 text-blue-500 px-4 py-2 rounded"
        >
          Mua ngay
        </button>
      </div>
    </div>
  );
};

export default VoucherCard;
