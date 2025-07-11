import React from "react";

const NewsletterSubscription = () => {
    return (
        <section className="mb-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Đăng ký nhận bản tin</h2>
            <p className="mb-4">
                Cùng WearItNow Blog cập nhật những thông tin mới nhất về thời trang và phong cách sống.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center">
                <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="p-2 border border-gray-300 rounded-l sm:rounded-l-none sm:rounded-l-md mb-2 sm:mb-0 sm:w-80"
                />
                <button className="px-6 py-2 bg-black text-white rounded-lg sm:ml-2">
                    Đăng Ký
                </button>
            </div>
        </section>
    );
};

export default NewsletterSubscription;
