import React, { useState, useEffect } from "react";
import {
  getDistricts,
  getProvinces,
  getWards,
} from "../../services/ShippingApi";
import {
  District,
  Province,
  UserAddress,
  Ward,
} from "../../stores/UserAddress";
import {
  createUserAddress,
  getUserAddress,
  deleteUserAddress,
  updateAddress,
} from "../../services/UserAddressApi";
import { toast, ToastContainer } from "react-toastify";

const Popup: React.FC<{
  onClose: () => void;
  onAddressUpdated: () => void;
  address: UserAddress | null;
}> = ({ onClose, onAddressUpdated, address }) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedTowardCode, setSelectedTowardCode] = useState<string | null>(
    null
  );
  const [isActive, setIsActive] = useState(address?.isActive || false);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [toName, setToName] = useState(address?.toName || "");
  const [toPhone, setToPhone] = useState(address?.toPhone || "");
  const [toWardCode, setToWardCode] = useState(address?.toWardCode || "");
  const [toAddress, setToAddress] = useState(address?.toAddress || "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const provinceData = await getProvinces();
        setProvinces(provinceData);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (address) {
      setAddressId(address.addressId);
      setSelectedProvince(null);
      setSelectedDistrict(null);
      setSelectedTowardCode(null);
      setToName(address.toName);
      setToPhone(address.toPhone);
      setToWardCode(address.toWardCode);
      setToAddress("");
    }
  }, [address]);

  const handleProvinceChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const provinceId = parseInt(e.target.value);
    setSelectedProvince(provinceId);
    setSelectedDistrict(null);
    setWards([]);
    if (!isNaN(provinceId)) {
      try {
        const districtData = await getDistricts(provinceId);
        setDistricts(districtData);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    }
  };

  const handleDistrictChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const districtId = parseInt(e.target.value);
    setSelectedDistrict(districtId);
    setSelectedTowardCode(null);
    setToWardCode("");

    if (!isNaN(districtId)) {
      try {
        const wardData = await getWards(districtId);
        setWards(wardData);
      } catch (error) {
        console.error("Error fetching wards:", error);
      }
    }
  };

  const handleWardCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardCode = e.target.value;
    setSelectedTowardCode(wardCode);
    setToWardCode(wardCode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (
      !selectedProvince ||
      !selectedDistrict ||
      !toName ||
      !toPhone ||
      !toAddress
    ) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const userId = Number(localStorage.getItem("userId"));
    if (isNaN(userId)) {
      setErrorMessage("ID người dùng không hợp lệ.");
      return;
    }

    // Tạo đối tượng dữ liệu địa chỉ
    const selectedWard = wards.find(
      (ward) => ward.WardCode === selectedTowardCode
    );
    const selectedDistrictObj = districts.find(
      (district) => district.DistrictID === selectedDistrict
    );
    const selectedProvinceObj = provinces.find(
      (province) => province.ProvinceID === selectedProvince
    );

    const addressData: UserAddress = {
      addressId: addressId ?? 0, // Nếu không có addressId, gán giá trị mặc định là 0
      userId: userId,
      toName: toName,
      toPhone: toPhone,
      toWardCode: toWardCode,
      toAddress: `${toAddress}, ${selectedWard?.WardName || ""}, ${
        selectedDistrictObj?.DistrictName || ""
      }, ${selectedProvinceObj?.ProvinceName || ""}`,
      toDistrictId: selectedDistrict,
      toWardName: selectedWard?.WardName || "",
      toDistrictName: selectedDistrictObj?.DistrictName || "",
      toProvinceId: selectedProvince,
      toProvinceName: selectedProvinceObj?.ProvinceName || "",
      isActive: isActive,
    };

    try {
      if (addressId) {
        // Nếu đã có addressId, gọi API updateAddress để cập nhật
        await updateAddress(addressId, addressData);
        toast.success("Địa chỉ đã được cập nhật thành công!");
      } else {
        // Nếu chưa có addressId, gọi API tạo mới (createUserAddress)
        await createUserAddress(addressData);
        toast.success("Địa chỉ đã được thêm thành công!");
      }
      onAddressUpdated();
      onClose(); // Đóng cửa sổ sau khi xử lý xong
    } catch (error) {
      console.error("Error submitting address:", error);
      toast.error("Đã có lỗi xảy ra khi cập nhật địa chỉ. Vui lòng thử lại!");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Thêm địa chỉ mới</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Họ tên</label>
              <input
                type="text"
                placeholder="Nhập họ và tên"
                className="w-full border rounded px-4 py-2"
                value={toName}
                onChange={(e) => setToName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700">Số điện thoại</label>
              <input
                type="text"
                placeholder="Nhập số điện thoại"
                className="w-full border rounded px-4 py-2"
                value={toPhone}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^\d*$/.test(input)) {
                    setToPhone(input);
                  }
                }}
              />
            </div>
          </div>
          {/* Province, District, Ward Selects */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Tỉnh / Thành phố</label>
              <select
                onChange={handleProvinceChange}
                className="w-full border rounded px-4 py-2"
                value={selectedProvince || ""}
              >
                <option value="">Chọn Tỉnh / Thành phố</option>
                {provinces.map((province) => (
                  <option key={province.ProvinceID} value={province.ProvinceID}>
                    {province.ProvinceName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Quận / Huyện</label>
              <select
                onChange={handleDistrictChange}
                className="w-full border rounded px-4 py-2"
                value={selectedDistrict || ""}
                disabled={!selectedProvince}
              >
                <option value="">Chọn Quận / Huyện</option>
                {districts.map((district) => (
                  <option key={district.DistrictID} value={district.DistrictID}>
                    {district.DistrictName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-gray-700">Phường / Xã</label>
            <select
              onChange={handleWardCodeChange}
              className="w-full border rounded px-4 py-2"
              value={toWardCode}
              disabled={!selectedDistrict}
            >
              <option value="">Chọn Phường / Xã</option>
              {wards.map((ward) => (
                <option key={ward.WardCode} value={ward.WardCode}>
                  {ward.WardName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Địa chỉ</label>
            <input
              type="text"
              placeholder="Nhập địa chỉ"
              className="w-full border rounded px-4 py-2"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
            />
          </div>
          {/* Error message */}
          {errorMessage && (
            <div className="text-red-500 text-center">{errorMessage}</div>
          )}
          {/* Submit button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Lưu địa chỉ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddressBookForm: React.FC = () => {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(
    null
  );
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State to show delete confirmation modal
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null); // Store addressId to delete

  const mapApiToUserAddress = (apiData: any): UserAddress => {
    return {
      addressId: apiData.id,
      userId: apiData.userId,
      toName: apiData.toName,
      toPhone: apiData.toPhone,
      toWardCode: apiData.toWardCode,
      toAddress: apiData.toAddress,
      toDistrictId: apiData.toDistrictId,
      toWardName: apiData.toWardName,
      toDistrictName: apiData.toDistrictName,
      toProvinceId: apiData.toProvinceId,
      toProvinceName: apiData.toProvinceName,
      isActive: apiData.isActive,
    };
  };

  const fetchUserAddresses = async () => {
    const userId = Number(localStorage.getItem("userId"));
    if (isNaN(userId)) {
      console.error("ID người dùng không hợp lệ.");
      return;
    }
    try {
      const data = await getUserAddress(userId);
      const addresses = data.result.map(mapApiToUserAddress);
      setAddresses(addresses);
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ:", error);
    }
  };

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  const handleDelete = async () => {
    if (!addressToDelete) return;
    try {
      await deleteUserAddress(addressToDelete);
      setAddresses((prevAddresses) =>
        prevAddresses.filter((address) => address.addressId !== addressToDelete)
      );
      toast.success("Địa chỉ đã được xóa!");
      setSelectedAddressId(null);
      setShowDeleteConfirm(false); // Close delete confirm modal
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Đã có lỗi xảy ra khi xóa địa chỉ.");
      setShowDeleteConfirm(false); // Close modal if error occurs
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false); // Close delete confirmation modal
    setAddressToDelete(null); // Reset the address to delete
  };

  const handleEdit = (address: UserAddress) => {
    setEditingAddress(address);
    setShowPopup(true);
  };

  const handleSetAsDefault = async (address: UserAddress) => {
    try {
      // Cập nhật địa chỉ được chọn làm mặc định và các địa chỉ còn lại.
      const updatedAddresses = addresses.map((addr) => {
        if (addr.addressId === address.addressId) {
          // Đặt địa chỉ này làm mặc định
          return { ...addr, isActive: true }; // Chỉ địa chỉ này được active
        } else if (addr.isActive) {
          // Đặt địa chỉ cũ không còn là mặc định
          return { ...addr, isActive: false };
        }
        return addr; // Giữ nguyên các địa chỉ còn lại
      });
      const updatePromises = updatedAddresses.map((addr) =>
        addr.isActive !== address.isActive
          ? updateAddress(addr.addressId, addr) // Gửi cập nhật nếu cần
          : Promise.resolve() // Nếu không thay đổi, giữ nguyên
      );
  
      await fetchUserAddresses(); // Gọi lại API để làm mới danh sách địa chỉ
  
      toast.success("Địa chỉ mặc định cập nhật thành công!");
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Đã có lỗi xảy ra khi cập nhật địa chỉ mặc định!");
    }
  };
  
  

  const handleAddressUpdated = () => {
    fetchUserAddresses();
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setEditingAddress(null);
  };

  const handleAddressClick = (addressId: number) => {
    setSelectedAddressId((prevId) => (prevId === addressId ? null : addressId));
  };

  return (
    <div className="bg-white p-6 shadow rounded ml-6 h-full">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
      />
      <h1 className="text-2xl font-bold mb-4">Sổ địa chỉ</h1>
      <button
        onClick={() => {
          setEditingAddress(null);
          setShowPopup(true);
        }}
        className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 mb-4"
      >
        + Thêm địa chỉ mới
      </button>
      <div className="space-y-4 ">
        {addresses.map((address) => (
          <div
            key={address.addressId}
            className={`border rounded p-4 cursor-pointer shadow-sm hover:shadow-xl ${
              selectedAddressId === address.addressId ? "bg-gray-100" : ""
            }`}
            onClick={() => handleAddressClick(address.addressId)}
          >
            <div>
              <div>
                <strong>Name:</strong> {address.toName}
              </div>
              <div>
                <strong>Phone:</strong> {address.toPhone}
              </div>
              <div>
                <strong>Address:</strong> {address.toAddress}
              </div>
              {address.isActive && (
                <div className="text-green-500">Địa chỉ mặc định</div>
              )}
            </div>
            {selectedAddressId === address.addressId && (
              <div className="flex flex-col space-y-2 mt-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="bg-blue-500 text-white flex-1 px-4 py-2 rounded hover:bg-blue-100 hover:text-black"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setAddressToDelete(address.addressId);
                    }}
                    className="bg-red-500 text-white flex-1 px-4 py-2 rounded hover:bg-red-100 hover:text-black"
                  >
                    Xóa
                  </button>
                </div>
                {!address.isActive && (
                  <button
                    onClick={() => handleSetAsDefault(address)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-100 hover:text-black"
                  >
                    Đặt làm địa chỉ mặc định
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal xác nhận xóa địa chỉ */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold">Xác nhận xóa địa chỉ</h2>
            <p>Bạn có chắc chắn muốn xóa địa chỉ này không?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hiển thị Popup chỉnh sửa */}
      {showPopup && (
        <Popup
          onClose={handlePopupClose}
          onAddressUpdated={handleAddressUpdated}
          address={editingAddress}
        />
      )}
    </div>
  );
};

export default AddressBookForm;
