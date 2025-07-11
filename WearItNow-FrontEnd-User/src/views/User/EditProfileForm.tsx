import React, { useState, useEffect } from "react";
import { UserInfo } from "../../stores/UserModel";
import { updateUserInfo } from "../../services/UserApi";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS cho react-toastify

interface EditProfileFormProps {
  userInfo: UserInfo;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ userInfo }) => {
  const [formData, setFormData] = useState<UserInfo>({
    firstname: "",
    lastname: "",
    phone: "",
    roles: ["CUSTOMER"],
    email: "",
    gender: "true",
    dob: "",
  });
  const [errors, setErrors] = useState<any>({}); // State để lưu thông tin lỗi
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      setFormData({
        firstname: userInfo.firstname || "",
        lastname: userInfo.lastname || "",
        phone: userInfo.phone || "",
        roles: userInfo.roles || ["CUSTOMER"],
        email: userInfo.email || "",
        gender: userInfo.gender || "true",
        dob: userInfo.dob || "",
      });
    }
  }, [userInfo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Hàm kiểm tra validation
  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.firstname) {
      newErrors.firstname = "Họ không được để trống!";
    }

    if (!formData.lastname) {
      newErrors.lastname = "Tên không được để trống!";
    }

    if (!formData.phone) {
      newErrors.phone = "Số điện thoại không được để trống!";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ! (10 chữ số)";
    }

    if (!formData.email) {
      newErrors.email = "Email không được để trống!";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ!";
    }

    if (!formData.dob) {
      newErrors.dob = "Ngày sinh không được để trống!";
    }

    if (!formData.gender) {
      newErrors.gender = "Giới tính không được để trống!";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Kiểm tra validation trước khi tiếp tục
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Lưu lỗi vào state
      return; 
    }
  
    try {
      const userId = localStorage.getItem("userId");
      const dataToUpdate = {
        ...formData,
        roles: ["CUSTOMER"],
      };
  
      await updateUserInfo(userId, dataToUpdate); // Cập nhật thông tin người dùng
      toast.success("Cập nhật thông tin thành công!"); // Hiển thị thông báo thành công
  
      // Hoãn điều hướng 1 giây sau khi hiển thị toast
      setTimeout(() => {
        navigate("/userdashboard"); // Điều hướng đến trang dashboard
      }, 1000);
    } catch (err) {
      console.error("Lỗi khi cập nhật thông tin:", err);
      toast.error("Cập nhật thất bại. Vui lòng thử lại!"); // Hiển thị thông báo lỗi
    }
  };
  

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Chỉnh sửa Thông tin</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700">Họ</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded ${errors.firstname ? "border-red-500" : ""}`}
            placeholder="Nhập họ"
          />
          {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Tên</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded ${errors.lastname ? "border-red-500" : ""}`}
            placeholder="Nhập tên"
          />
          {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded ${errors.phone ? "border-red-500" : ""}`}
            placeholder="Nhập số điện thoại"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded ${errors.email ? "border-red-500" : ""}`}
            placeholder="Nhập email"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Giới tính</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded ${errors.gender ? "border-red-500" : ""}`}
          >
            <option value="true">Nam</option>
            <option value="false">Nữ</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Ngày sinh</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded ${errors.dob ? "border-red-500" : ""}`}
          />
          {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Lưu Thay Đổi
          </button>
        </div>
      </form>

      {/* Thêm ToastContainer để hiển thị thông báo toast */}
      <ToastContainer />
    </>
  );
};

export default EditProfileForm;
