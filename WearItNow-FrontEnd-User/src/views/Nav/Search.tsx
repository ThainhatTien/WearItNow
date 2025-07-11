import React, { useEffect, useState } from "react";
import { Input, Button, List, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { fetchProductByProductName } from "../../services/ProductApi";
import { Product, ProductsResult } from "../../stores/Product";
import { Link } from "react-router-dom";
import { encodeId } from "../../utils/crypto";

interface SearchBarProps {
  onClose: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Product[]>([]); // Quản lý danh sách kết quả
  const [error, setError] = useState<string | null>(null); // Thông báo lỗi
  const [loading, setLoading] = useState(false);

  const handleClear = () => {
    setQuery("");
    setResults([]);
  };

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setQuery(value);

    // Tìm kiếm sản phẩm trong thời gian thực
    if (value.length > 1) {
      setLoading(true);
      try {
        const data: ProductsResult = await fetchProductByProductName(value);
        if (data.code === 1000) {
          setResults(data.result.data);
        } else {
          setError("Không thể tải sản phẩm"); // Cập nhật thông báo lỗi
        }
      } catch (error) {
        setError("Có lỗi xảy ra khi tải sản phẩm"); // Cập nhật thông báo lỗi
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-100 bg-opacity-50 z-50">
      <div className="relative w-1/2">
        <Input
          placeholder="Tìm kiếm"
          value={query}
          onChange={handleInputChange}
          suffix={
            <div>
              <Button
                onClick={handleClear}
                type="link"
                style={{ marginRight: 8 }}
              >
                Xóa
              </Button>
              <CloseOutlined onClick={onClose} style={{ cursor: "pointer" }} />
            </div>
          }
          style={{ paddingLeft: 40 }}
        />
      </div>
      {/* Hiển thị kết quả tìm kiếm */}
      <div className="w-2/4 mt-1 bg-white p-4">
        {results.length > 0 ? (
          <List
            style={{ border: "none" }}
            bordered
            dataSource={results}
            renderItem={(item) => (
              <Link
                onClick={(e) => {
                  onClose(); // Đóng SearchBar
                  setTimeout(
                    () =>
                      (window.location.href = `/product/${item.name}/${encodeId(
                        item.productId
                      )}`),
                    0
                  );
                }}
                to={`/product/${item.name}/${encodeId(item.productId)}`}
              >
                <List.Item>
                  {item.image && (
                    <img className="w-8" src={item.image} alt={item.name} />
                  )}
                  <Typography.Text>{item.name}</Typography.Text>
                  <Typography.Text>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.price!)}
                  </Typography.Text>
                </List.Item>{" "}
              </Link>
            )}
          />
        ) : (
          query && (
            <Typography.Text type="secondary">
              Không tìm thấy kết quả nào.
            </Typography.Text>
          )
        )}
      </div>
    </div>
  );
};

export default SearchBar;
