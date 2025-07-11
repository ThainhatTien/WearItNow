import axiosInstance from "./api.service"

const API_GET = 'statistics' 

// Thêm ngày hiện tại vào yêu cầu API
export const getStatisticsOrder = (fromDate: string, toDate: string) => {
  return axiosInstance.get(`${API_GET}/orders?fromDate=${fromDate}&toDate=${toDate}`);
}

export const getStatisticsRevenue = (fromDate: string, toDate: string) => {
  return axiosInstance.get(`${API_GET}/revenue?fromDate=${fromDate}&toDate=${toDate}`);
}

export const getStatisticsCustomers = () => {
  return axiosInstance.get(`${API_GET}/customers`);
}
export const getStatisticsQuantityProduct = (fromDate: string, toDate: string) => {
  return axiosInstance.get(`${API_GET}/product-quantity?fromDate=${fromDate}&toDate=${toDate}&productId=3`);
}

export const getStatisticsTopProduct = (fromDate: string, toDate: string) => {
  return axiosInstance.get(`${API_GET}/top-products?from=${fromDate}&to=${toDate}`)
}
