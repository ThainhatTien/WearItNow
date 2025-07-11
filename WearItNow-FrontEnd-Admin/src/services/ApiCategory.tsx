import { Category } from "types/CategoryType"
import axiosInstance from "./api.service"

export const GET_API = 'categories'

const cleanParams = (params: any) => {
    return Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== ""));
  };
export const getAllCategory = (categoryCurrentPage: number,
    categoryPageSize: number) => {
    const params = cleanParams({
        page: categoryCurrentPage,
        size: categoryPageSize,
    });
    return axiosInstance.get(GET_API, { params })
}

export const getSlugCategory = (slug: string) => axiosInstance.get(GET_API + '/' + slug)

export const createCategory = (category: Category) => axiosInstance.post(GET_API, category)

export const updateCategory = (categoryId: number, category:Category) => axiosInstance.put(GET_API + '/'+categoryId, category)

export const removeCategory = (categoryId: number) => axiosInstance.delete(GET_API + '/' + categoryId)