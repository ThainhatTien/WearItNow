import axiosInstance from "./api.service"

export const GET_API = 'products'

const cleanParams = (params: any) => {
  return Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== ""));
};
export const getAllProductService = (
  productCurrentPage: number,
  productPageSize: number,
  searchParams?: { productName?: string; categoryId?: number; color?: string; productSize?: string }
) => {
 
  // Làm sạch tham số trước khi gửi đi
  const params = cleanParams({
    page: productCurrentPage,
    size: productPageSize,
    ...searchParams,  // Thêm các tham số tìm kiếm như tên, danh mục, màu sắc, size
  });
  return axiosInstance.get(GET_API, { params });
};



export const getAllProductServices = () => axiosInstance.get(GET_API)

export const getOneProductService = (productId: number) => axiosInstance.get(GET_API + '/productdetail/' + productId)

export const postProductService = (product: FormData) => axiosInstance.post(GET_API, product, {
  headers: {
    'Content-Type': 'multipart/form-data', // Đặt Content-Type cho FormData
  },
})
export const putProductService = (productId: number, product: FormData) => axiosInstance.put(GET_API + '/' + productId, product, {
  headers: {
    'Content-Type': 'multipart/form-data', // Đặt Content-Type cho FormData
  },
})
export const DeleteProductService = (productId: number) => axiosInstance.delete(GET_API + '/' + productId)

