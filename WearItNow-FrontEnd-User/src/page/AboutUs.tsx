import React from "react";
import "../styles/AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <header className="about-us-header">
        <h1>Về Chúng Anh Đào Minh Quân</h1>
        <p>
          Chúng em là một nhóm sinh viên đang thực hiện đồ án tốt nghiệp tại
          trường.
        </p>
        <p>Chúng em xin gửi lời chào trân trọng đến thầy cô và các bạn.</p>
      </header>
      <section className="about-us-mission">
        <h2>Sứ Mệnh</h2>
        <p>
          Chúng em cam kết mang đến giá trị và sự hài lòng cho khách hàng thông
          qua các sản phẩm chất lượng cao.
        </p>
        <p>
          Chúng em luôn nỗ lực cải tiến và đổi mới để đáp ứng nhu cầu ngày càng
          cao của thị trường.
        </p>
      </section>
      <section className="about-us-team">
        <h2>Đội Ngũ</h2>
        <p>
          Đội ngũ của chúng em bao gồm những thành viên nhiệt huyết và đầy đam
          mê, hiện đang làm việc cho đồ án tốt nghiệp:
        </p>
        <ul>
          <li>
            <strong className="team-member">Bùi Hoàng An</strong> - Trưởng nhóm,
            phụ trách quản lý dự án và lập kế hoạch.
          </li>
          <li>
            <strong className="team-member">Hoàng Bình Quân</strong> - Back-end,
            chịu trách nhiệm phát triển và duy trì hệ thống máy chủ.
          </li>
          <li>
            <strong className="team-member">Nguyễn Trung Hiếu</strong> -
            Back-end, làm việc với cơ sở dữ liệu và API.
          </li>
          <li>
            <strong className="team-member">Võ Lương Bảo Kha</strong> -
            Front-end, thiết kế giao diện người dùng và trải nghiệm người dùng.
          </li>
          <li>
            <strong className="team-member">Nguyễn Thanh Trường</strong> -
            Front-end, phát triển các tính năng tương tác cho ứng dụng.
          </li>
        </ul>
        <p>
          Chúng em tự hào về đội ngũ của mình và mong muốn hoàn thành đồ án này
          với kết quả tốt nhất.
        </p>
      </section>
      <footer className="about-us-footer">
        <p>Liên hệ với chúng em qua email: wearltnow@gmail.com</p>
      </footer>
    </div>
  );
};

export default AboutUs;
