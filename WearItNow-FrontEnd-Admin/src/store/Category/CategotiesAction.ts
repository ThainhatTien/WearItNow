import { getAllCategory, createCategory, removeCategory } from "services/ApiCategory"; // API thêm và xóa
import { AppDispatch } from "store";
import { Category, CategoryWithId } from "types/CategoryType";

// Các action constants
export const FETCH_CATEGORIES_REQUEST = 'FETCH_CATEGORIES_REQUEST';
export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE';

export const ADD_CATEGORY_REQUEST = 'ADD_CATEGORY_REQUEST';
export const ADD_CATEGORY_SUCCESS = 'ADD_CATEGORY_SUCCESS';
export const ADD_CATEGORY_FAILURE = 'ADD_CATEGORY_FAILURE';

export const UPDATE_CATEGORY_REQUEST = 'UPDATE_CATEGORY_REQUEST';
export const UPDATE_CATEGORY_SUCCESS = 'UPDATE_CATEGORY_SUCCESS';
export const UPDATE_CATEGORY_FAILURE = 'UPDATE_CATEGORY_FAILURE';

export const DELETE_CATEGORY_REQUEST = 'DELETE_CATEGORY_REQUEST';
export const DELETE_CATEGORY_SUCCESS = 'DELETE_CATEGORY_SUCCESS';
export const DELETE_CATEGORY_FAILURE = 'DELETE_CATEGORY_FAILURE';

export const SET_PAGE_SIZE = 'SET_PAGE_SIZE';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
// Action để bắt đầu quá trình fetch
export const fetchCategoriesRequest = () => ({
  type: FETCH_CATEGORIES_REQUEST,
});

// Action khi fetch thành công
export const fetchCategoriesSuccess = (
  categories: CategoryWithId[],  
  categoryCurrentPage: number,
  categoryPageSize: number,
  totalElements: number,
  totalCategoryPages: number
) => {
  const payload = {
    categories, categoryCurrentPage, categoryPageSize, totalElements, totalCategoryPages
  };
  return {
    type: FETCH_CATEGORIES_SUCCESS,
    payload,
  };
};


// Action khi fetch thất bại
export const fetchCategoriesFailure = (error: string) => ({
  type: FETCH_CATEGORIES_FAILURE,
  payload: error,
});

// Action để bắt đầu quá trình thêm
export const addCategoryRequest = () => ({
  type: ADD_CATEGORY_REQUEST,
});

// Action khi thêm thành công
export const addCategorySuccess = (category: Category) => ({
  type: ADD_CATEGORY_SUCCESS,
  payload: category,
});

// Action khi thêm thất bại
export const addCategoryFailure = (error: string) => ({
  type: ADD_CATEGORY_FAILURE,
  payload: error,
});

// Action để bắt đầu quá trình xóa
export const deleteCategoryRequest = () => ({
  type: DELETE_CATEGORY_REQUEST,
});

// Action khi xóa thành công
export const deleteCategorySuccess = (categoryId: number) => ({
  type: DELETE_CATEGORY_SUCCESS,
  payload: categoryId,
});

// Action khi xóa thất bại
export const deleteCategoryFailure = (error: string) => ({
  type: DELETE_CATEGORY_FAILURE,
  payload: error,
});

// Hàm fetch categories
export const fetchCategories = (searchs : {page: number, size:number}) => {
  return async (dispatch: AppDispatch) => {
    dispatch(fetchCategoriesRequest());
    try {
      const response = await getAllCategory(searchs.page, searchs.size,);
      const {data, currentPage, pageSize, totalElements, totalPages } = response.data.result;
      dispatch(fetchCategoriesSuccess(data, currentPage, pageSize, totalElements, totalPages));
    } catch (error) {
      dispatch(fetchCategoriesFailure(error.message));
    }
  };
};

// Hàm thêm category
export const addCategory = (newCategory: Category, search : {page: number, size:number}) => {
  return async (dispatch: AppDispatch) => {
    dispatch(addCategoryRequest());
    try {
      const response = await createCategory(newCategory); // Giả định API trả về danh mục mới
      dispatch(addCategorySuccess(response.data.result));
      dispatch(fetchCategories(search)); // Fetch lại categories sau khi thêm thành công
    } catch (error) {
      dispatch(addCategoryFailure(error.message));
    }
  };
};

// Hàm xóa category
export const deleteCategory = (categoryId: number,search : {page: number, size:number}) => {
  return async (dispatch: AppDispatch) => {
    dispatch(deleteCategoryRequest());
    try {
      await removeCategory(categoryId); // Giả định API chỉ trả về status thành công
      dispatch(deleteCategorySuccess(categoryId));
      dispatch(fetchCategories(search)); // Fetch lại categories sau khi xóa thành công
    } catch (error) {
      dispatch(deleteCategoryFailure(error.message));
    }
  };
};

export const setCategoryCurrentPage= (page: number) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});
