import React, { useEffect, useState } from "react";
import Sidebar from "../views/User/Sidebar";
import MainContent from "../views/User/MainContent";
import EditProfileForm from "../views/User/EditProfileForm";
import AddressBookForm from "../views/User/AddressBookForm";
import OrdersForm from "../views/User/OrdersForm";
import FavoritesForm from "../views/User/FavoritesForm";
import RecentlyViewedForm from "../views/User/RecentlyViewedForm";
import { useNavigate } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import { getUserInfo } from "../services/UserApi";

const UserDashboard: React.FC = () => {
  const [selectedForm, setSelectedForm] = useState("MainContent");
  const [userInfo, setUserInfo] = useState<any>(null);
  const navigate = useNavigate();
  const handleMenuClick = (formName: string) => {
    setSelectedForm(formName);
  };

  const handleEditProfile = () => {
    setSelectedForm("EditProfile");
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo(); // Gọi API để lấy thông tin người dùng
        setUserInfo(data.result); // Lưu trữ thông tin người dùng
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchUserInfo(); // Gọi hàm fetch khi component mount
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-10 md:px-20 py-10 bg-gray-100">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <Sidebar
            onMenuClick={handleMenuClick}
            onEditProfile={handleEditProfile}
          />
        </div>

        {/* Nội dung chính */}
        <div className="w-full md:w-3/4 mt-4 md:mt-0 ml-0 md:ml-4">
          {selectedForm === "UserProfile" && (
            <UserProfile onEditProfile={handleEditProfile} />
          )}
          {selectedForm === "EditProfile" && userInfo && (
            <EditProfileForm userInfo={userInfo} />
          )}
          {selectedForm === "Orders" && <OrdersForm />}
          {selectedForm === "AddressBook" && <AddressBookForm />}
          {selectedForm === "Favorites" && <FavoritesForm />}
          {selectedForm === "MainContent" && <MainContent />}
          {selectedForm === "RecentlyViewed" && <RecentlyViewedForm />}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
