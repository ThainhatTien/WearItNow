import payment1 from "../assets/images/payments/1.png";
import payment2 from "../assets/images/payments/2.png";
import payment3 from "../assets/images/payments/3.png";
import payment4 from "../assets/images/payments/4.png";
import payment5 from "../assets/images/payments/5.png";
import { PhoneOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-8 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Footer main content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">Liên hệ</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <EnvironmentOutlined className="mr-2" />
                <p>QTPM, To Ky, Quan 12, Ho Chi Minh City, Viet Nam</p>
              </li>
              <li className="flex items-center">
                <PhoneOutlined className="mr-2" />
                <p>(+84) 968-0230-50</p>
              </li>
              <li>
                <a
                  href="mailto:wearitnow@gmail.com"
                  className="text-blue-500"
                  aria-label="Email"
                >
                  wearitnow@gmail.com
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Dịch vụ</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/userdashboard" className="text-blue-500">
                  Tài Khoản
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-blue-500">
                  Hỏi Đáp
                </Link>
              </li>
              <li>
                <Link to="/specials" className="text-blue-500">
                  Khuyến Mãi
                </Link>
              </li>
              <li>
                <Link to="/wearitnow@gmail.com" className="text-blue-500">
                  Trợ Giúp
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Về WearItNow</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about-us" className="text-blue-500">
                  Giới Thiệu
                </Link>
              </li>
              <li>
                <Link to="/recruitment" className="text-blue-500">
                  Tuyển Dụng
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Hỗ Trợ Khách Hàng</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/warranty-policy" className="text-blue-500">
                  Chính Sách Bảo Hành
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-blue-500">
                  Chính Sách Bảo Mật
                </Link>
              </li>
              <li>
                <Link
                  to="/return-and-exchange-policy"
                  className="text-blue-500"
                >
                  Chính Sách Đổi Trả
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social media & payment methods */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Social Media Links */}
          <div className="flex justify-start">
            <ul className="flex space-x-4">
              <li>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  to="#"
                  title="Facebook"
                  className="text-blue-600"
                >
                  <i className="fab fa-facebook-f" aria-label="Facebook"></i>
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  to="#"
                  title="Twitter"
                  className="text-blue-400"
                >
                  <i className="fab fa-twitter" aria-label="Twitter"></i>
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  to="#"
                  title="Google Plus"
                  className="text-red-500"
                >
                  <i
                    className="fab fa-google-plus-g"
                    aria-label="Google Plus"
                  ></i>
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  to="#"
                  title="RSS"
                  className="text-orange-500"
                >
                  <i className="fas fa-rss" aria-label="RSS"></i>
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  to="#"
                  title="Pinterest"
                  className="text-red-700"
                >
                  <i className="fab fa-pinterest" aria-label="Pinterest"></i>
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  to="#"
                  title="LinkedIn"
                  className="text-blue-700"
                >
                  <i className="fab fa-linkedin-in" aria-label="LinkedIn"></i>
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  to="#"
                  title="YouTube"
                  className="text-red-600"
                >
                  <i className="fab fa-youtube" aria-label="YouTube"></i>
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="flex justify-end">
            <ul className="flex space-x-4">
              <li>
                <img src={payment1} alt="Payment Method 1" className="h-8" />
              </li>
              <li>
                <img src={payment2} alt="Payment Method 2" className="h-8" />
              </li>
              <li>
                <img src={payment3} alt="Payment Method 3" className="h-8" />
              </li>
              <li>
                <img src={payment4} alt="Payment Method 4" className="h-8" />
              </li>
              <li>
                <img src={payment5} alt="Payment Method 5" className="h-8" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
