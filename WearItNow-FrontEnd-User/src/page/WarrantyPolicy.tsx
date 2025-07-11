import React from "react";

const WarrantyPolicy = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-lg font-bold mb-4">
        QUY ĐỊNH VỀ VIỆC BẢO HÀNH SẢN PHẨM
      </h1>
      <h2 className="text-md font-semibold mb-2">
        ĐỐI TƯỢNG ÁP DỤNG:{" "}
        <span className="font-normal">
          Tất cả các đối tác mua sản phẩm tại công ty.
        </span>
      </h2>
      <h2 className="text-md font-semibold mb-4">
        PHẠM VI ÁP DỤNG: <span className="font-normal">Trên toàn cầu.</span>
      </h2>
      <h2 className="text-md font-semibold mb-2">
        CÁC TRƯỜNG HỢP ĐƯỢC BẢO HÀNH:
      </h2>
      <ul className="list-decimal list-inside">
        <li>Bể, vỡ, tràn, rách bao bì ảnh hưởng đến chất lượng sản phẩm.</li>
        <li>
          Lỗi kỹ thuật, lắp sai nguyên vật liệu, sai quy cách đóng gói, sản phẩm
          không hoạt động, cấu trúc sản phẩm, thông tin sản phẩm không đúng,…
        </li>
        <li>Lỗi chất lượng (mốc, hỏng, hết hạn sử dụng,…).</li>
        <li>
          Sản phẩm ảnh hưởng nghiêm trọng đến sức khỏe của khách hàng, cần thu
          hồi để kiểm tra chất lượng.
        </li>
        <li>
          Sản phẩm mua không đúng với mã mẫu mã, chủng loại khách hàng đã đặt.
        </li>
      </ul>
    </div>
  );
};

export default WarrantyPolicy;
