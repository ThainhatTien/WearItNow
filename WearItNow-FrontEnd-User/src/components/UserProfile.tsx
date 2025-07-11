import React, { useEffect, useState } from "react";
import { getUserInfo } from "../services/UserApi"; // Import hàm gọi API
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";

interface UserProfileProps {
  onEditProfile: () => void; // Prop callback để chuyển đến form EditProfile
}

const UserProfile: React.FC<UserProfileProps> = ({ onEditProfile }) => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false); // State cho modal thông báo

  const maskEmail = (email: string) => {
    if (!email) return "N/A";
    const [localPart, domain] = email.split("@");
    const maskedLocalPart = localPart.slice(0, 4) + "...";
    return `${maskedLocalPart}@${domain}`;
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo();
        setUserInfo(data.result);
        // Kiểm tra nếu name hoặc phone rỗng hoặc null
        if (!data.result.firstname || !data.result.phone) {
          setShowModal(true); // Hiển thị modal yêu cầu cập nhật thông tin
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchUserInfo();
  }, []);

  const handleRedirectToEditProfile = () => {
    setShowModal(false);
    onEditProfile(); // Gọi callback để chuyển đến form EditProfile
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!userInfo) {
    return <p>Loading...</p>;
  }

  return (
    <div className="rounded-lg  p-4">
      <h5 className="text-2xl font-bold text-center mb-4">Thông tin</h5>

      <p className="text-opacity-75 mb-2 flex items-center">
        <FontAwesomeIcon className="mr-2" icon={faPhone} /> {userInfo.phone}
      </p>
      <p className="text-opacity-75 mb-2 flex items-center">
        <FontAwesomeIcon className="mr-2" icon={faUser} /> {userInfo.firstname}{" "}
        {userInfo.lastname}
      </p>
      <p className="text-opacity-75 mb-2 flex items-center">
        <FontAwesomeIcon className="mr-2" icon={faEnvelope} />{" "}
        {maskEmail(userInfo.email)}
      </p>

      {/* Modal yêu cầu cập nhật thông tin */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-md mx-4">
            <h3 className="text-xl font-bold text-red-500 mb-4">
              Cập nhật thông tin cá nhân
            </h3>
            <p className="mb-4 text-sm sm:text-base">
              Bạn cần cập nhật thông tin cá nhân của mình để hoàn tất hồ sơ.
            </p>
            <button
              onClick={handleRedirectToEditProfile}
              className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Cập nhật ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
