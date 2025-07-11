import {
  FETCH_CATEGORIES_FAILURE,
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  ADD_CATEGORY_REQUEST,
  ADD_CATEGORY_SUCCESS,
  ADD_CATEGORY_FAILURE,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAILURE,
} from './CategotiesAction';
import { CategoryWithId } from 'types/CategoryType';

interface CategoryState {
  loading: boolean;
  categories: CategoryWithId[];
  error: string | null;
  categoryCurrentPage: number;
  categoryPageSize: number;
  totalElements: number;
  totalCategoryPages: number;
}

const initialState: CategoryState = {
  loading: false,
  categories: [],
  error: null,
  categoryCurrentPage: 1,
  categoryPageSize: 100,
  totalElements: 0,
  totalCategoryPages: 0,
};

const categoryReducer = (state = initialState, action: any): CategoryState => {
  switch (action.type) {
    case FETCH_CATEGORIES_REQUEST:
    case ADD_CATEGORY_REQUEST:
    case DELETE_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: action.payload.categories, 
        categoryCurrentPage: action.payload.categoryCurrentPage, 
        categoryPageSize: action.payload.categoryPageSize, 
        totalElements: action.payload.totalElements, 
        totalCategoryPages: action.payload.totalCategoryPages, 
      };

    case ADD_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: [...state.categories, action.payload], 
      };

    case DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: state.categories.filter((category) => category.categoryId !== action.payload), 
      };

    case FETCH_CATEGORIES_FAILURE:
    case ADD_CATEGORY_FAILURE:
    case DELETE_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default categoryReducer;
