import React, { useEffect, useState } from "react";
import DiscountService from "../../services/DiscountApi";
import VoucherCard from "./VoucherCard";
import { DiscountCode } from "../../stores/DiscountModel";

const MainContent: React.FC = () => {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"ALL" | "EXPIRING_SOON">("ALL");

  // State để theo dõi việc xem thêm / rút gọn
  const [showAll, setShowAll] = useState<boolean>(false);

  useEffect(() => {
    const fetchDiscountCodes = async () => {
      try {
        const userId = parseInt(localStorage.getItem("userId") || "0", 10);
        if (userId) {
          const codes = await DiscountService.getDiscountCodesByUser(userId);
          setDiscountCodes(codes);
        } else {
          setError("User ID is not available.");
        }
      } catch (error) {
        setError("Failed to fetch discount codes.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountCodes();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Lọc các mã ưu đãi dựa trên viewMode
  const filteredCodes =
    viewMode === "ALL"
      ? discountCodes.filter((code) => {
          const daysLeft = Math.floor(
            (new Date(code.endDate).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          );
          return daysLeft > 0; // Lọc voucher có thời gian còn lại > 0 ngày
        })
      : discountCodes.filter((code) => {
          const daysLeft = Math.floor(
            (new Date(code.endDate).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          );
          return daysLeft <= 7 && daysLeft > 0; // Lọc voucher hết hạn trong 7 ngày và còn thời gian
        });

  // Chia mã ưu đãi thành các nhóm 2 thẻ cho mỗi hàng
  const groupedCodes = [];
  for (let i = 0; i < filteredCodes.length; i += 2) {
    groupedCodes.push(filteredCodes.slice(i, i + 2));
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <h2 className="text-xl font-semibold mb-4">Mã ưu đãi</h2>
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 text-gray-700 border-b-2 ${
            viewMode === "ALL" ? "border-red-500" : "border-transparent"
          } focus:outline-none`}
          onClick={() => setViewMode("ALL")}
        >
          Tất cả (
          {
            discountCodes.filter((code) => {
              const daysLeft = Math.floor(
                (new Date(code.endDate).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              return daysLeft > 0; // Chỉ tính các voucher chưa hết hạn
            }).length
          }
          )
        </button>

        <button
          className={`px-4 py-2 text-gray-700 border-b-2 ${
            viewMode === "EXPIRING_SOON"
              ? "border-red-500"
              : "border-transparent"
          } focus:outline-none`}
          onClick={() => setViewMode("EXPIRING_SOON")}
        >
          Sắp hết hạn (
          {
            discountCodes.filter((code) => {
              const daysLeft = Math.floor(
                (new Date(code.endDate).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              return daysLeft > 0 && daysLeft <= 7; // Lọc voucher hết hạn trong vòng 7 ngày
            }).length
          }
          )
        </button>
      </div>
      <h3 className="text-lg font-semibold mb-4">Mã ưu đãi của bạn:</h3>

      {/* Hiển thị các thẻ voucher theo nhóm 2 thẻ mỗi hàng */}
      <div className="space-y-4">
        {groupedCodes
          .slice(0, showAll ? groupedCodes.length : 1) // Nếu showAll là true, hiển thị tất cả nhóm, nếu không thì chỉ hiển thị 1 nhóm
          .map((group, index) => (
            <div key={index} className="flex space-x-4">
              {group.map((code) => (
                <VoucherCard
                  key={code.id}
                  title={`Voucher - ${code.code}`}
                  description={`Giảm ${code.amount}${
                    code.type === "PERCENTAGE" ? "%" : "đ"
                  } cho đơn từ ${
                    code.minOrderValue
                      ? new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(code.minOrderValue)
                      : "không có yêu cầu"
                  }`}
                  code={code.code} // Mã giảm giá
                  expiration={`Còn ${Math.floor(
                    (new Date(code.endDate).getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )} ngày`} // Hiển thị số ngày còn lại trước khi mã hết hạn
                />
              ))}
            </div>
          ))}
      </div>

      {/* Thêm nút Xem thêm / Rút gọn chỉ khi có hơn 2 voucher */}
      {groupedCodes.length > 1 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-500"
          >
            {showAll ? "Rút gọn" : "Xem thêm"}
          </button>
        </div>
      )}
    </div>
  );
};

export default MainContent;
