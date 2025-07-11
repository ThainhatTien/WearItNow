import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTags,
  faBox,
  faUser,
  faMapMarkerAlt,
  faHeart,
  faHistory,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import UserProfile from "../../components/UserProfile"; // Import UserProfile
import { getUserInfo } from "../../services/UserApi";

interface SidebarProps {
  onMenuClick: (formName: string) => void; // Prop for form switch
  onEditProfile: () => void; // Prop for edit profile
}

const menuItems = [
  { label: "Mã ưu đãi", icon: faTags, form: "MainContent" },
  { label: "Đơn hàng", icon: faBox, form: "Orders" },
  // { label: "Thẻ thành viên", icon: faUser, form: "MembershipCard" },
  { label: "Sổ địa chỉ", icon: faMapMarkerAlt, form: "AddressBook" },
  { label: "Yêu thích", icon: faHeart, form: "Favorites" },
  { label: "Đã xem gần đây", icon: faHistory, form: "RecentlyViewed" },
];

const Sidebar: React.FC<SidebarProps> = ({ onMenuClick, onEditProfile }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word ? word[0].toUpperCase() : '')
      .join('');
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo(); // Gọi API để lấy thông tin người dùng
        setUserInfo(data.result); // Lưu trữ thông tin người dùng
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserInfo(); // Gọi hàm fetch khi component mount
  }, []);

  return (
    <div className="w-full bg-white rounded-lg shadow p-4">
      <div className="flex flex-col items-center">
        {/* User Profile */}
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xl">
          {userInfo && getInitials(`${userInfo.firstname} ${userInfo.lastname}`)}
        </div>
        <UserProfile onEditProfile={onEditProfile} />{" "}
        {/* Pass the onEditProfile prop */}
        <button
          onClick={() => onMenuClick("EditProfile")}
          className="bg-green-500 text-white px-2 py-1 rounded-l "
        >
          Chỉnh sửa Thông tin
        </button>
      </div>

      {/* Sidebar Menu Items */}
      <ul className="mt-4">
        {menuItems.map((item) => (
          <li
            key={item.label}
            className="flex items-center py-2 text-gray-700 cursor-pointer hover:bg-gray-100 rounded-lg"
            onClick={() => onMenuClick(item.form)}
          >
            <FontAwesomeIcon icon={item.icon} className="mr-2" />
            <span>{item.label}</span>
          </li>
        ))}

        {/* Logout Item */}
        <li
          className="flex items-center py-2 text-gray-700 cursor-pointer hover:bg-gray-100 rounded-lg"
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          <span>Đăng xuất</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
