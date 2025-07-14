import axios from 'axios';

// API configuration - these should be moved to environment variables in production
const API_BASE_URL = 'https://online-gateway.ghn.vn/shiip/public-api/master-data';
// TODO: Move these to environment variables
const API_KEY = process.env.REACT_APP_GHN_API_KEY || '2b58ec75-8ea6-11ef-a205-de063ca823db';
const SHOP_ID = process.env.REACT_APP_GHN_SHOP_ID || '5401403 - 0976745901';
const GHN_TOKEN = process.env.REACT_APP_GHN_TOKEN || '32620eea-8b9f-11ef-8e53-0a00184fe694';
const GHN_SHOP_ID = process.env.REACT_APP_GHN_SHOP_ID_NUM || 194821;

const API_BASE_URL_ORDER = 'http://localhost:8080/api/orders';
const API_BASE_URL_ADDRESS = "http://localhost:8080/api/user-address/is-active";
const API_BASE_URL_PAYMENT = 'http://localhost:8080/api/payments/payment-types';
const API_BASE_URL_AVAILABLE = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services'
const API_BASE_URL_PAYMENTQRCODE = 'http://localhost:8080/api/payments/createQR'
const API_BASE_URL_FEESHIPNG = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee'
const API_BASE_URL_DISCOUNT = 'http://localhost:8080/api/discount-codes/user';

// Lấy danh sách Tỉnh/Thành
export const getProvinces = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/province`, {
            headers: {
                Token: API_KEY,
                ShopId: SHOP_ID,
            },
        });
        return response.data.data; // Trả về danh sách tỉnh/thành
    } catch (error) {
        // Xử lý lỗi khi không thể lấy danh sách tỉnh/thành
        throw new Error('Không thể lấy danh sách tỉnh/thành');
    }
};

// Lấy danh sách Quận/Huyện dựa trên province_id
export const getDistricts = async (provinceId: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/district?province_id=${provinceId}`, {
            headers: {
                Token: API_KEY,
                ShopId: SHOP_ID,
            },
        });
        return response.data.data; // Trả về danh sách quận/huyện
    } catch (error) {
        // Xử lý lỗi khi không thể lấy danh sách quận/huyện
        throw new Error('Không thể lấy danh sách quận/huyện');
    }
};

// Lấy danh sách Phường/Xã dựa trên district_id
export const getWards = async (districtId: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/ward?district_id=${districtId}`, {
            headers: {
                Token: API_KEY,
                ShopId: SHOP_ID,
            },
        });
        return response.data.data; // Trả về danh sách phường/xã
    } catch (error) {
        // Xử lý lỗi khi không thể lấy danh sách phường/xã
        throw new Error('Không thể lấy danh sách phường/xã');
    }
};

// Tính phí giao hàng
export const calculateShippingFee = async (
    toDistrictId: number,
    serviceTypeId: number,
    toWardCode: string,
    items: Array<{
        name: string;
        quantity: number;
        height: number; // Chiều cao của sản phẩm
        weight: number; // Cân nặng của sản phẩm
        length: number; // Chiều dài của sản phẩm
        width: number;  // Chiều rộng của sản phẩm
    }>
) => {
    try {
        // Chuyển đổi items thành định dạng phù hợp
        const formattedItems = items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            height: item.height, // Sử dụng chiều cao từ item
            weight: item.weight, // Sử dụng cân nặng từ item
            length: item.length, // Sử dụng chiều dài từ item
            width: item.width,   // Sử dụng chiều rộng từ item
        }));

        const response = await axios.post(
            `${API_BASE_URL_FEESHIPNG}`,
            {
                service_type_id: serviceTypeId,
                from_district_id: 1442, // ID quận xuất phát
                to_district_id: toDistrictId, // ID quận đến
                from_ward_code: "21316", // Mã phường xuất phát
                to_ward_code: toWardCode, // Mã phường đến
                //height: formattedItems.reduce((acc, item) => acc + 1 * item.quantity, 0), // Giả định chiều cao cố định cho mỗi sản phẩm
                //length: formattedItems.reduce((acc, item) => acc + 1 * item.quantity, 0), // Giả định chiều dài cố định cho mỗi sản phẩm
                weight: 1,
                //formattedItems.reduce((acc, item) => acc + 200 * item.quantity, 0), // Giả định cân nặng cố định cho mỗi sản phẩm
                //width: formattedItems.reduce((acc, item) => acc + 1 * item.quantity, 0), // Giả định chiều rộng cố định cho mỗi sản phẩm
                insurance_value: 0, // Giá trị bảo hiểm
                coupon: null, // Mã giảm giá
                items: formattedItems // Gửi items dưới dạng mảng đối tượng
            },
            {
                headers: {
                    Token: GHN_TOKEN,
                    ShopId: GHN_SHOP_ID,
                },
            }
        );

        return response.data.data.total; // Trả về tổng phí giao hàng
    } catch (error) {
        // Xử lý lỗi khi không thể tính phí giao hàng
        throw new Error('Không thể tính phí giao hàng');
    }
};

//Check out
export const checkOut = async (requestBody: any): Promise<any> => {
    try {
        const response = await axios.post(`${API_BASE_URL_ORDER}`, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // Trả về dữ liệu từ server
        return response.data;
    } catch (error) {
        // Xử lý lỗi khi không thể thanh toán
        throw new Error('Không thể hoàn tất đơn hàng');
    }
};

//Lấy danh sách dịch vụ giao hàng (loại hình giao hàng)
export const getAvailable = async (districtId: number) => {
    try {
        const response = await axios.post(API_BASE_URL_AVAILABLE, {
            shop_id: GHN_SHOP_ID, // Mã shop
            from_district: 1454, // Mã quận của shop
            to_district: districtId, // Mã quận của khách hàng
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Token': GHN_TOKEN,
            },
        });
        return response.data.data; // Trả về danh sách dịch vụ
    } catch (error) {
        // Xử lý lỗi khi không thể lấy dịch vụ giao hàng
        throw new Error('Không thể lấy dịch vụ giao hàng');
    }
};

// Gọi các phương thức thanh toán
export const PaymentTypes = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL_PAYMENT}`);
        return response.data;
    } catch (error) {
        // Xử lý lỗi khi không thể lấy phương thức thanh toán
        throw new Error('Không thể lấy phương thức thanh toán');
    }
};

//Hàm lấy ra m QrCode
export const PaymentData = async (orderId: number) => {
    try {
        const response = await axios.post(`${API_BASE_URL_PAYMENTQRCODE}`, {orderId});
        return response.data;
    } catch (error) {
        // Xử lý lỗi khi không thể tạo mã QR
        throw new Error('Không thể tạo mã QR thanh toán');
    }
};

// Ham lấy địa chỉ người dùng đã đăng nhập
export const getAddressUser = async (userId: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL_ADDRESS}/${userId}`);
        return response.data.result;
    }catch (error) {
        // Xử lý lỗi khi không thể lấy địa chỉ người dùng
        throw new Error('Không thể lấy địa chỉ người dùng');
    }
}

//Hàm lấy mã giảm giá của người dùng
export const getDiscount = async (userId: number) => {
    try {
        const response = await  axios.get(`${API_BASE_URL_DISCOUNT}/${userId}`);
        return response.data.result;
    } catch (error) {
        // Xử lý lỗi khi không thể lấy mã giảm giá
        throw new Error('Không thể lấy mã giảm giá');
    }
}

